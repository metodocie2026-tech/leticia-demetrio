# Runbook — Manutenção do funil de e-mail (Listmonk/SES)

Guia rápido do dia a dia. Pra configuração inicial, ver os tutoriais em `docs/tutorial-amazon-ses.md` e `docs/tutorial-listmonk.md`.

**Escopo atual (desde 31/08/2026)**: Categoria A e Categoria B ativas via Listmonk/SES — o Brevo foi removido do projeto. O e-mail imediato (Categoria A, passo 1) dispara direto na rota de inscrição; o de +24h (passo 2) é varrido pelo cron de hora em hora. Ver `docs/migracao-brevo-ses.md` §0.2.

---

## Como adicionar um novo e-mail de campanha (data fixa)

É o caso mais comum — praticamente todos os e-mails futuros do funil (25+ planejados) são assim. **Não precisa de nenhuma mudança de código.**

Existe **um único template wrapper** no Listmonk ("Template Padrão — Letícia Demétrio", criado a partir de `docs/emails/listmonk/template-campanha.html`), com o header/footer/marca já prontos e um marcador `{{ template "content" . }}` no meio. Você não cria um template novo pra cada e-mail — só uma campanha nova reaproveitando esse template.

1. Do HTML do e-mail novo (produzido separadamente, com a identidade visual da Letícia), extraia só o **miolo** — o conteúdo entre o header preto e o footer preto (sem repetir a logo, a faixa gradiente, nem o rodapé com "cancelar inscrição", que já vêm do template wrapper).
2. Troque as merge tags pra sintaxe do Listmonk: nome do lead é `{{ .Subscriber.Name }}`, link do grupo é `{{ .Subscriber.Attribs.whatsapp_group_url }}` (o link de cancelamento **não precisa** ir no miolo — já está no wrapper).
3. **Campaigns** → **New** → escolha o template wrapper existente, cole o miolo no editor de conteúdo, escolha a lista de destino, e agende a data/hora em **Schedule**.
4. Salve como **Scheduled** (não fica como **Draft** por engano).

Se algum dia a Letícia quiser um layout visualmente diferente (não só texto novo, mas um header/footer diferente), aí sim vale criar um segundo template wrapper — mas isso é exceção, não a regra.

---

## Como adicionar um novo e-mail por gatilho (relativo ao momento em que o lead entrou)

Isso é a Categoria A (algo como "e-mail X horas depois de Y") — ativa desde 31/08/2026, config em `src/lib/email-sequences.ts`:

```ts
export const EMAIL_SEQUENCES: SequenceStep[] = [
  { table: 'inscricoes', delayHours: 0,  listmonkTemplateId: ..., sentColumn: 'email_1_sent_at' },
  { table: 'inscricoes', delayHours: 24, listmonkTemplateId: ..., sentColumn: 'email_2_sent_at' },
]
```

1. Criar o template transacional no Listmonk (**Campaigns → Templates → New**, tipo `Tx`), anotar o ID.
2. Adicionar uma coluna nova de controle na tabela de origem (ex.: `email_3_sent_at`) — ver o padrão em `docs/sql-migrations.md`.
3. Adicionar um novo item em `EMAIL_SEQUENCES` com o `delayHours`, `listmonkTemplateId` (via env var) e `sentColumn` corretos.
4. Se `delayHours: 0`, o disparo já acontece automaticamente na API route correspondente (mesmo padrão do e-mail 1). Se `delayHours > 0`, o cron em `src/app/api/cron/email-sequences/route.ts` já varre todos os passos da lista — não precisa tocar na rota do cron.

O cron só processa leads do evento atual (`evento = EVENTO_TAG`, de `src/constants/evento.ts`) — leads de um evento anterior nunca são pegos, mesmo que a coluna de controle esteja `NULL` neles.

---

## Como adicionar uma lista nova

1. Listmonk: **Lists** → **New**, anotar o ID.
2. Seguir o padrão de `src/app/api/evento/matriculas/route.ts` ou `src/app/api/evento/inscricao/route.ts` — as duas só chamam `addSubscriberToListmonk()` de `src/lib/listmonk.ts` pra sincronizar (sem disparar e-mail).
3. Adicionar a variável de ambiente com o novo `listId` no EasyPanel.

---

## Onde olhar quando algo não dispara

1. **Logs da aplicação** (EasyPanel → app → Logs) — os erros de sync/envio são logados com prefixo `[Listmonk]`, os do cron com `[cron/email-sequences]`.
2. **Histórico de campanha no painel do Listmonk** — mostra o que foi enviado, entregue, e com bounce.
3. **SES** (console AWS) → **Reputation dashboard** — taxa de bounce/complaint, e se a conta ainda está em boa saúde.
4. Se um contato não aparece no Listmonk: confirmar que as env vars `LISTMONK_API_URL`/`LISTMONK_API_USERNAME`/`LISTMONK_API_KEY`/`LISTMONK_LIST_ID` estão configuradas no ambiente — sem elas, o sync falha silenciosamente (por design, pra nunca travar o formulário) e só aparece nos logs.

---

*Runbook criado em julho de 2026, como parte da migração descrita em `docs/migracao-brevo-ses.md`.*
