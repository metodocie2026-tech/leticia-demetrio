# Testar localmente (sem AWS)

Como validar o pipeline — Next.js → Supabase → Listmonk → "envio" de e-mail — na sua máquina, sem precisar de conta AWS nem SES aprovado. O SES só entra quando for testar em produção de verdade (`docs/tutorial-amazon-ses.md`).

O truque: o **Mailhog** substitui o SES localmente. Ele é um SMTP falso — captura qualquer e-mail que o Listmonk tentar enviar e mostra numa caixa de entrada web, sem mandar nada de verdade.

> **Escopo (desde 22/07/2026)**: só a sincronia de contato (dual-write, silenciosa) e as campanhas de data fixa estão ativas. O e-mail imediato/+24h (Categoria A) foi pausado — ver `docs/migracao-brevo-ses.md` §0.1. Este doc reflete só o que está ativo hoje.

---

## 1. Subir o stack local

```bash
npm run listmonk:local
```

Isso sobe 3 containers (definidos em `docker-compose.listmonk.yml`):

| Serviço | URL | O que é |
|---|---|---|
| Listmonk | http://localhost:9000 | O painel, igual ao que vai rodar no EasyPanel em produção |
| Mailhog | http://localhost:8025 | Caixa de entrada falsa — é aqui que os e-mails de teste aparecem |
| Postgres | `localhost:5433` | Banco interno do Listmonk (não precisa mexer) |

Na primeira vez, o Listmonk se instala sozinho e cria um usuário admin com as credenciais das variáveis `LISTMONK_ADMIN_USER` / `LISTMONK_ADMIN_PASSWORD` (se não definidas, usa `admin` / `admin123456` — **só serve pra local, nunca use isso em produção**).

Pra derrubar tudo depois: `npm run listmonk:local:down`.

---

## 2. Configurar o Listmonk local (feito uma vez, manual — a UI de criar API token não dá pra automatizar)

1. Acesse http://localhost:9000, faça login (`admin` / `admin123456`).
2. **Settings → SMTP** → **Add SMTP server**:
   - Host: `mailhog`
   - Port: `1025`
   - Auth protocol: `None`
   - TLS: `None`
   - (diferente da produção — lá vai ser o host/porta reais do SES, ver `docs/tutorial-listmonk.md`)
3. Siga as **Partes 4, 5 e 6 de `docs/tutorial-listmonk.md`**:
   - Criar as listas `Inscrições — Semana Elegância` e `Matrículas` → anotar os IDs
   - Criar a role `API — Next.js` (`subscribers:manage`, `subscribers:manage_lists`, `subscribers:get`, `subscribers:sql_query`) e o API user com ela → anotar username + token
   - (Os templates transacionais do e-mail 1/2 não são mais necessários pro escopo atual — só crie os de campanha, se for testar o envio de uma campanha também, seção 6)

---

## 3. Configurar o `.env.local`

Adicione (sem apagar as variáveis `BREVO_*`, elas continuam lá e continuam sendo chamadas normalmente):

```env
LISTMONK_API_URL=http://localhost:9000/api
LISTMONK_API_USERNAME=<username do API user criado acima>
LISTMONK_API_KEY=<token do API user>
LISTMONK_LIST_ID=<id da lista de inscrições>
LISTMONK_MATRICULAS_LIST_ID=<id da lista de matrículas>
UNSUBSCRIBE_SECRET=qualquer-coisa-local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> **Atenção**: o app local ainda aponta pro Supabase de **produção** (mesmo `.env.local` de sempre — não existe Supabase separado pra teste). Testar o formulário de inscrição localmente cria uma linha de verdade na tabela `inscricoes`. Use um e-mail/nome claramente de teste e apague a linha depois (seção 7).

---

## 4. Testar a sincronia de contato (dual-write)

Com `npm run dev` rodando:

```bash
curl -s -X POST http://localhost:3000/api/evento/inscricao \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste Local","email":"teste-local@example.com","whatsapp":"11999999999"}'
```

Confirme:
- [ ] Resposta `{"success":true}`
- [ ] Linha nova em `inscricoes` no Supabase
- [ ] Subscriber novo na lista de inscrições, no painel do Listmonk, com os `attribs` certos (`whatsapp`, `whatsapp_group_url`, `survey_url`, `unsubscribe_url`)
- [ ] **Nenhum e-mail aparece no Mailhog** — isso é o comportamento certo agora, não um bug (a automação de e-mail continua só no Brevo)

Repita o mesmo `curl` de novo com o mesmo e-mail — deve continuar dando `{"success":true}`, sem duplicar o subscriber no Listmonk (exercita o caminho de merge/409, que depende da permissão `subscribers:sql_query`).

---

## 5. Testar o cancelamento de inscrição

1. Pegue o `unsubscribe_url` salvo nos `attribs` do subscriber (via `GET /api/subscribers?query=subscribers.email='teste-local@example.com'` no Listmonk, ou olhando o subscriber na UI).
2. Abra o link no navegador (`http://localhost:3000/cancelar-inscricao?email=...&token=...`).
3. Confirme a página de sucesso.
4. Confirme no Listmonk que o subscriber ficou com status **Blocklisted**.
5. Teste também um token inválido (mude um caractere na URL) — deve mostrar a página de erro, **sem** blocklistar ninguém.

---

## 6. Testar uma campanha (opcional, mas recomendado antes de agendar uma de verdade)

1. Crie o template wrapper (`docs/emails/listmonk/template-campanha.html`) e um dos e-mails de campanha (`docs/emails/listmonk/3-faltam-7-dias.html`, por exemplo) seguindo `docs/tutorial-listmonk.md` §5.
2. Crie uma campanha de teste na lista de inscrições, agendada pra alguns minutos no futuro (ou dispare manualmente, se o Listmonk tiver essa opção na UI).
3. Confirme que o e-mail chega no Mailhog, com `{{ .Subscriber.Name }}`, `{{ .Subscriber.Attribs.whatsapp_group_url }}` e `{{ .Subscriber.Attribs.unsubscribe_url }}` todos resolvidos corretamente.

---

## 7. Limpar depois do teste

```sql
DELETE FROM inscricoes WHERE email = 'teste-local@example.com';
```

Deletar o subscriber de teste no Listmonk também (`DELETE /api/subscribers/{id}`).

```bash
npm run listmonk:local:down   # derruba os containers locais (mantém o volume — dados ficam salvos se quiser subir de novo)
```

---

## O que isso NÃO valida

- Entregabilidade real (SPF/DKIM/DMARC, reputação de domínio) — só o SES real testa isso.
- Latência/comportamento do SMTP do SES especificamente — o Mailhog não simula rate limit nem bounce do SES.
- O gate de produção em `docs/migracao-brevo-ses.md` §6.3 exige um envio real em produção, não local — este teste local é o passo anterior, pra pegar bug de código antes de gastar o ciclo de aprovação do SES em cima de um bug bobo.

---

*Doc criado em julho de 2026, como parte da migração descrita em `docs/migracao-brevo-ses.md`. Escopo atualizado em 22/07/2026.*
