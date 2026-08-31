# Testar a infra de produção (Listmonk no EasyPanel + SES)

Depois que o Listmonk estiver no ar em produção (via EasyPanel, `docs/tutorial-listmonk.md`), como validar que tudo funciona de verdade antes de agendar uma campanha real pra todos os leads.

> **Escopo (desde 31/08/2026)**: Categoria A (e-mail 1 imediato + e-mail 2 +24h) e Categoria B (campanhas) ativas via Listmonk/SES — o Brevo foi removido do projeto (`docs/migracao-brevo-ses.md` §0.2). Este doc valida tanto o disparo automático quanto se o Listmonk/SES de produção estão prontos pra uma campanha agendada.

**A ideia central**: o app publicado no EasyPanel só lê as env vars que estão configuradas *nele*. O `.env.local` da sua máquina é um arquivo completamente separado, que só o `next dev` local enxerga. Então dá pra rodar o app **localmente**, mas apontado pras credenciais **reais** de produção (Listmonk de verdade, e mais tarde o SES de verdade) — isso exercita o código real contra a infra real, sem o app publicado jamais saber que esse teste aconteceu.

---

## Pré-requisitos

- [ ] Listmonk publicado no EasyPanel, com domínio próprio (ex: `https://listmonk.leticiademetrio.com.br`)
- [ ] SMTP do Listmonk configurado (Mailhog-like/teste, ou já o SES real — funciona nos dois casos, ver Parte 1)
- [ ] Listas e o API user + role criados no Listmonk de produção — mesmos passos de `docs/tutorial-listmonk.md`, só que rodando lá, não no Docker local
- [ ] Template wrapper de campanha (`docs/emails/listmonk/template-campanha.html`) criado, se for testar o envio de uma campanha (Parte 4)

---

## Parte 1 — Teste isolado do Listmonk de produção (sem tocar no Next.js)

Confirma que Listmonk↔SMTP funciona, antes de envolver o app. Substitua a URL/token pelos valores reais:

```bash
# Autenticação
curl -s -H "Authorization: token SEU_API_USER:SEU_TOKEN" \
  https://listmonk.leticiademetrio.com.br/api/lists

# Criar um subscriber de teste (use um e-mail seu, verificado no SES se já estiver indo pro SES real)
curl -s -X POST \
  -H "Authorization: token SEU_API_USER:SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"SEU_EMAIL_VERIFICADO@dominio.com","name":"Teste Produção","status":"enabled","lists":[ID_DA_LISTA],"attribs":{},"preconfirm_subscriptions":true}' \
  https://listmonk.leticiademetrio.com.br/api/subscribers
```

Confirme que o subscriber aparece corretamente no painel.

---

## Parte 2 — Apontar o `.env.local` pra produção (temporariamente)

**Não edite as env vars do EasyPanel.** Edite só o `.env.local` da sua máquina:

```env
LISTMONK_API_URL=https://listmonk.leticiademetrio.com.br/api
LISTMONK_API_USERNAME=SEU_API_USER_DE_PRODUCAO
LISTMONK_API_KEY=SEU_TOKEN_DE_PRODUCAO
LISTMONK_LIST_ID=...              # ID real da lista de inscrições em produção
LISTMONK_MATRICULAS_LIST_ID=...

UNSUBSCRIBE_SECRET=qualquer-coisa-local
NEXT_PUBLIC_SITE_URL=http://localhost:3000   # ok deixar local aqui, só afeta o link de cancelamento gerado neste teste
```

> `NEXT_PUBLIC_SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` continuam os mesmos de sempre — é o Supabase de produção real, não muda. Ou seja, esse teste grava linhas de verdade lá, igual nos testes locais anteriores. Use um e-mail de teste óbvio e limpe depois.

Suba o dev server: `npm run dev`.

---

## Parte 3 — Testar a sincronia de contato contra o Listmonk de produção

```bash
curl -s -X POST http://localhost:3000/api/evento/inscricao \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste Producao","email":"SEU_EMAIL_VERIFICADO@dominio.com","whatsapp":"11999999999"}'
```

Confirme:
- [ ] `{"success":true}`
- [ ] Subscriber criado no Listmonk **de produção**, na lista certa, com os `attribs` certos (`whatsapp_group_url`, `survey_url`, `unsubscribe_url`)
- [ ] **O e-mail 1 chega na sua caixa de entrada** (`SEU_EMAIL_VERIFICADO@dominio.com`) — a Categoria A está ativa (`docs/migracao-brevo-ses.md` §0.2); exige `LISTMONK_TEMPLATE_EMAIL_1_ID` configurado e o template correspondente já criado no Listmonk de produção
- [ ] `email_1_sent_at` preenchido na linha de `inscricoes` no Supabase

Pra testar o e-mail 2 (+24h) sem esperar: edite a linha de teste no Supabase, mude `created_at` pra mais de 24h atrás, e chame o cron manualmente com o `.env.local` ainda apontado pra produção:

```bash
curl -s -X POST http://localhost:3000/api/cron/email-sequences \
  -H "Authorization: Bearer <valor de CRON_SECRET em produção>"
```

Confirme o e-mail 2 chegando e `email_2_sent_at` preenchido.

---

## Parte 4 — Testar uma campanha real via SES

1. No Listmonk de produção, crie uma campanha de teste (pode reusar o template wrapper + um dos e-mails de `docs/emails/listmonk/`), direcionada só pro seu contato de teste (ou uma lista pequena/segmentada).
2. Agende ou dispare.
3. Confirme que chega na sua caixa real. Se o SES ainda estiver em sandbox, só chega se o endereço já estiver verificado (`docs/tutorial-amazon-ses.md` Parte 3).
4. Confira o painel do Listmonk: status de entrega, sem bounce.

Isso é o teste que efetivamente confirma o gate de `docs/migracao-brevo-ses.md` §6.3 antes de agendar a campanha de verdade pra toda a lista.

---

## Parte 5 — Testar o cancelamento de inscrição

1. Pegue o link `unsubscribe_url` salvo nos `attribs` do subscriber criado na Parte 3, ou copie direto do e-mail recebido na Parte 4.
2. Abra o link no navegador (vai ser algo como `http://localhost:3000/cancelar-inscricao?email=...&token=...` — local mesmo, `NEXT_PUBLIC_SITE_URL` ficou local de propósito nesse teste).
3. Confirme a página de sucesso.
4. Confirme no Listmonk de produção que o subscriber ficou com status **Blocklisted**.

---

## Parte 6 — Limpar

```sql
DELETE FROM inscricoes WHERE email = 'SEU_EMAIL_VERIFICADO@dominio.com';
```

Deletar o subscriber de teste no Listmonk de produção também (`DELETE /api/subscribers/{id}`).

Reverter o `.env.local` de volta pro Listmonk local (Docker), se for continuar testando localmente depois: `LISTMONK_API_URL=http://localhost:9000/api` etc.

---

## Depois de tudo isso passar

Não existe mais um "cutover" único (§6.2 do plano) — a sincronia de contato já roda em paralelo assim que deployada (não depende de gate nenhum). O que passar aqui só libera: **pode agendar a campanha de verdade pra todos os leads**, seguindo `docs/migracao-brevo-ses.md` §6.3.

Ainda vale confirmar antes de agendar pra toda a lista:
1. SES já saiu do sandbox mode (`docs/tutorial-amazon-ses.md` Parte 4) — sem isso só entrega pra endereços verificados.
2. Contatos existentes (de antes da sincronia entrar em produção) já foram importados no Listmonk (`docs/migracao-brevo-ses.md` §4).

---

*Doc criado em julho de 2026, como parte da migração descrita em `docs/migracao-brevo-ses.md`. Escopo atualizado em 22/07/2026.*
