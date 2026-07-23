# Runbook — Manutenção do funil de e-mail (Listmonk/SES)

Guia rápido do dia a dia. Pra configuração inicial, ver os tutoriais em `docs/tutorial-amazon-ses.md` e `docs/tutorial-listmonk.md`.

**Escopo atual (desde 22/07/2026)**: só a Categoria B (campanhas de data fixa) está ativa via Listmonk. O e-mail imediato + o de 24h após inscrição (Categoria A) continuam 100% no Brevo, sem previsão de mudar — ver `docs/migracao-brevo-ses.md` §0.1. As API routes só sincronizam o contato no Listmonk silenciosamente (sem disparar nada), pra manter a lista pronta pras campanhas abaixo.

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

## Como adicionar um novo e-mail por gatilho (relativo ao momento em que o lead entrou) — **pausado**

Isso é a Categoria A (algo como "e-mail X horas depois de Y") — hoje **não implementada de propósito** (`docs/migracao-brevo-ses.md` §0.1). O e-mail imediato + o de 24h continuam no Brevo, sem plano de mudar.

Se um dia isso for retomado, o desenho completo (config `EMAIL_SEQUENCES`, rota de cron, colunas `*_sent_at`) está preservado em `docs/migracao-brevo-ses.md` §3.2 — já foi construído e testado uma vez, só foi removido do repositório por decisão de escopo, não porque não funcionava.

---

## Como adicionar uma lista nova

1. Listmonk: **Lists** → **New**, anotar o ID.
2. Seguir o padrão de `src/app/api/evento/matriculas/route.ts` ou `src/app/api/evento/inscricao/route.ts` — as duas só chamam `addSubscriberToListmonk()` de `src/lib/listmonk.ts` pra sincronizar (sem disparar e-mail).
3. Adicionar a variável de ambiente com o novo `listId` no EasyPanel.

---

## Onde olhar quando algo não dispara

1. **Logs da aplicação** (EasyPanel → app → Logs) — os erros de sync são logados com prefixo `[Listmonk]` (e os do Brevo com `[Brevo]`, inalterado).
2. **Histórico de campanha no painel do Listmonk** — mostra o que foi enviado, entregue, e com bounce.
3. **SES** (console AWS) → **Reputation dashboard** — taxa de bounce/complaint, e se a conta ainda está em boa saúde.
4. Se um contato não aparece no Listmonk: confirmar que as env vars `LISTMONK_API_URL`/`LISTMONK_API_USERNAME`/`LISTMONK_API_KEY`/`LISTMONK_LIST_ID` estão configuradas no ambiente — sem elas, o sync falha silenciosamente (por design, pra nunca travar o formulário) e só aparece nos logs.

---

*Runbook criado em julho de 2026, como parte da migração descrita em `docs/migracao-brevo-ses.md`.*
