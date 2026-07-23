# Status da migração Brevo → SES/Listmonk

Log vivo do progresso real. Atualizar conforme os passos do checklist em `docs/migracao-brevo-ses.md` §11 forem concluídos. Plano completo e contexto em `docs/migracao-brevo-ses.md`.

**Escopo atual (desde 22/07/2026): só sincronia de contato (dual-write) + campanhas de data fixa.** A Categoria A (e-mail imediato + 24h) foi pausada — Brevo continua sendo o único responsável por ela, permanentemente, não só até um cutover. Não existe mais flag `EMAIL_PROVIDER` nem cron — ver §0.1 de `docs/migracao-brevo-ses.md`. As entradas abaixo de 19/07 são histórico de quando esse escopo ainda incluía a Categoria A — mantidas pra registro, não representam mais o estado atual do código.

---

## 19/07/2026

**Feito:**
- Código implementado e testado localmente com `tsc`/`eslint` (sem servidor Listmonk real ainda — não dá pra testar o pipeline ponta a ponta até a Parte 1 abaixo estar concluída):
  - `src/lib/listmonk.ts` — cliente da API do Listmonk (subscribers + transactional)
  - `src/lib/email-sequences.ts` — config da Categoria A (e-mail imediato + 24h)
  - `src/app/api/evento/inscricao/route.ts` e `.../matriculas/route.ts` — atualizadas com flag `EMAIL_PROVIDER`, comportamento inalterado enquanto a flag não for setada pra `listmonk`
  - `src/app/api/cron/email-sequences/route.ts` — rota nova, protegida por `CRON_SECRET`, no-op se `EMAIL_PROVIDER` não for `listmonk`
  - Migration + script de backfill em `docs/sql-migrations.md` (colunas `email_1_sent_at`/`email_2_sent_at` — **migration ainda não rodada no Supabase real**, script de backfill **ainda não rodado**)
- Documentação: `docs/tutorial-amazon-ses.md`, `docs/tutorial-listmonk.md`, `docs/tutorial-easypanel-cron.md`, `docs/runbook-emails.md`

**Atualização, mesmo dia — teste local + templates:**
- `docker-compose.listmonk.yml` + `docs/teste-local.md`: stack local (Listmonk + Postgres + Mailhog) verificado rodando, sem dependência de AWS. `npm run listmonk:local`.
- IDs criados no Listmonk (local, e presumivelmente os mesmos serão recriados em produção): lista `matrículas` = 4, lista `inscrições` = 3.
- **Descoberta**: `{{ UnsubscribeURL }}` do Listmonk só funciona em templates de **campanha**, não em transacional (limitação do próprio Listmonk, não erro nosso — ver `docs/tutorial-listmonk.md` Parte 5). Corrigido com uma página própria de cancelamento: `src/app/cancelar-inscricao/page.tsx` + `src/lib/unsubscribe.ts` (token assinado) + `blocklistListmonkSubscriberByEmail()` em `src/lib/listmonk.ts`. Toda tag de unsubscribe nos templates passa a ser `{{ .Subscriber.Attribs.unsubscribe_url }}`, igual em transacional e campanha.
- Versões dos templates 1 e 2 já convertidas e prontas pra colar, em `docs/emails/listmonk/` — evita repetir o erro de sintaxe na hora de criar os templates 2, e futuramente qualquer outro.
- `tsc`/`eslint` seguem limpos com todo o código novo.
- Duas env vars novas por causa disso: `UNSUBSCRIBE_SECRET`, `NEXT_PUBLIC_SITE_URL` (lista completa em `docs/sql-migrations.md`).
- **Correção de estrutura dos templates de campanha**: um template de campanha no Listmonk é um wrapper reutilizável com `{{ template "content" . }}` no meio, não o e-mail inteiro colado — colar o HTML completo dá erro `the placeholder ... should appear exactly once`. Corrigido: `docs/emails/listmonk/template-campanha.html` é o wrapper único (criar **uma vez só** no Listmonk), e os três e-mails de data fixa foram refeitos como só o miolo de cada um — `docs/emails/listmonk/3-faltam-7-dias.html`, `4-faltam-4-dias.html`, `5-e-amanha.html` (cola no conteúdo de cada campanha, não no template). `docs/tutorial-listmonk.md` Parte 5 e `docs/runbook-emails.md` corrigidos pra esse fluxo. Os 3 estão prontos e verificados (sem tag do Brevo sobrando, sem duplicar header/footer/unsubscribe no miolo).

**Atualização, mesmo dia — API user + `.env.local`:**
- Listmonk usa RBAC — criar um usuário de API exige criar uma **User role** primeiro (senão só oferece Super Admin). Role `API — Next.js` criada com `subscribers:manage`, `subscribers:manage_lists`, `subscribers:get`, `tx:send`.
- **Confirmado por teste direto** (`curl` contra `localhost:9000/api/subscribers`, registro de teste criado e removido em seguida): `subscribers:manage` sozinho **não** é suficiente pra criar um subscriber já associado a uma lista — dá `"Permission denied: lists"`. Precisa também de `subscribers:manage_lists`. `docs/tutorial-listmonk.md` Parte 6 corrigida com isso como permissão obrigatória, não fallback.
- `.env.local` atualizado com todas as variáveis Listmonk: `LISTMONK_API_URL=http://localhost:9000/api`, `LISTMONK_API_USERNAME=api_user`, `LISTMONK_API_KEY` preenchido, `LISTMONK_LIST_ID=3`, `LISTMONK_MATRICULAS_LIST_ID=4`, `EMAIL_PROVIDER=listmonk` (seguro localmente — não afeta produção, EasyPanel tem env vars próprias), `NEXT_PUBLIC_SITE_URL=http://localhost:3000` (importante: local usa localhost no link de unsubscribe, não o domínio de produção). **Faltam preencher**: `LISTMONK_TEMPLATE_EMAIL_1_ID` e `LISTMONK_TEMPLATE_EMAIL_2_ID` (IDs dos templates 1 e 2 já criados no Listmonk — pegar na URL de cada template).
- Auth da API confirmada funcionando de ponta a ponta (criar subscriber com lista, deletar) — próximo passo é testar via `npm run dev` seguindo `docs/teste-local.md` §5.

**Atualização, mesmo dia — teste de ponta a ponta rodado de verdade (local):**
- Faltava mais uma permissão: `subscribers:sql_query` (usada pela busca por e-mail em `findSubscriberByEmail()`, tanto no fluxo de merge/409 quanto no cancelamento). Adicionada à role `API — Next.js`. `docs/tutorial-listmonk.md` Parte 6 atualizada — role final: `subscribers:manage`, `subscribers:manage_lists`, `subscribers:get`, `subscribers:sql_query`, `tx:send`.
- Migration de `email_1_sent_at`/`email_2_sent_at` rodada em produção (Supabase).
- **Teste de ponta a ponta via `npm run dev` local, confirmado funcionando**: e-mail 1 imediato (subscriber criado com lista/attribs certos, e-mail no Mailhog, merge tags corretas, `email_1_sent_at` gravado); reenvio do mesmo e-mail exercitou o caminho de merge/409 sem duplicar subscriber; cron do e-mail 2 (+24h) pegou exatamente o registro de teste backdatado, enviou, gravou `email_2_sent_at`.
- **Achado importante, quase-incidente**: o mesmo run do cron reportou `"failed": 22` — a tabela `inscricoes` real tem ~24 leads de verdade (gente que já se inscreveu no evento ao vivo, hoje atendida pelo Brevo). Como a migration zera `email_2_sent_at` (NULL) pra linhas já existentes, a query do cron os pegou também. Não aconteceu nada de ruim porque **nenhum deles existe como subscriber no Listmonk ainda** — a chamada `/api/tx` falhou com "subscriber not found" antes de qualquer coisa ser enviada (confirmado: Supabase não foi alterado nesses registros, Mailhog só recebeu os 3 e-mails de teste). **Isso não é proteção por design — é sorte de estado atual.** No momento em que esses leads existirem como subscribers no Listmonk (o que acontece naturalmente no cutover real) e `EMAIL_PROVIDER=listmonk` estiver ativo contra o SES real, esse mesmo cron reenviaria o e-mail 2 pra todo mundo que já recebeu do Brevo. **Conclusão prática: o backfill (§4 / `docs/sql-migrations.md`) precisa rodar em produção ANTES de ativar `EMAIL_PROVIDER=listmonk` lá — não é um nice-to-have, é um bloqueador real, confirmado por teste.**
- Dados de teste limpos (linhas do Supabase e subscriber do Listmonk removidos) depois da verificação.

---

## 22/07/2026 — mudança de escopo: Categoria A pausada

**Decisão**: não ativar a automação por gatilho (e-mail imediato + 24h) por enquanto — continua 100% no Brevo, indefinidamente. Só campanhas de data fixa via Listmonk seguem em andamento. Ver `docs/migracao-brevo-ses.md` §0.1 pro racional completo.

**Feito:**
- Removidos `src/lib/email-sequences.ts` e `src/app/api/cron/email-sequences/route.ts` (dormentes, só usados pela Categoria A) — desenho preservado em §3.2 do plano caso seja retomado.
- Removida `sendListmonkTransactional` de `src/lib/listmonk.ts` (ficou sem uso).
- `src/app/api/evento/inscricao/route.ts` e `.../matriculas/route.ts` reescritas: chamam Brevo **e** Listmonk sempre, cada um no seu `try/catch` independente — não existe mais escolha binária via `EMAIL_PROVIDER` (a flag foi removida das rotas e do `.env.local`/`docs/sql-migrations.md`; `CRON_SECRET` e `LISTMONK_TEMPLATE_EMAIL_*_ID` também saíram, sem uso).
- **Testado localmente de novo, ponta a ponta**: `POST /api/evento/inscricao` cria contato no Listmonk (lista + attribs corretos, incl. `unsubscribe_url`) e **não dispara nenhum e-mail** (confirmado: 0 mensagens no Mailhog) — exatamente o comportamento novo esperado. `tsc`/`eslint` limpos.
- `docs/migracao-brevo-ses.md`, `docs/runbook-emails.md`, `docs/teste-local.md`, `docs/teste-producao-sem-cutover.md` e `docs/sql-migrations.md` atualizados pro novo escopo.
- Corrigida também uma data desatualizada: o plano dizia "hoje é 19/07" em vários lugares — hoje é na verdade 22/07/2026 (3 dias se passaram durante a implementação). O disparo de 20/07 (`faltam-7-dias`) já aconteceu, via Brevo, como planejado.

**Pendente (próximos passos, nessa ordem):**
1. Seguir `docs/tutorial-amazon-ses.md` até confirmar a identidade **Verified** e abrir a solicitação de saída do sandbox mode, se ainda não feito.
2. Deploy do Listmonk em produção via EasyPanel (`docs/tutorial-listmonk.md`), configurar SMTP com SES, criar listas + API user/role, criar o template wrapper de campanha + os templates 3/4/5.
3. Configurar as variáveis de ambiente em produção (lista atualizada em `docs/sql-migrations.md` — bem menor agora, sem `EMAIL_PROVIDER`/`CRON_SECRET`/templates transacionais).
4. Importar os contatos já existentes no Listmonk de produção (`docs/migracao-brevo-ses.md` §4).
5. Testar contra a infra de produção a partir da máquina local (`docs/teste-producao-sem-cutover.md`).
6. Se o gate passar a tempo (folga de 1 dia antes de 26/07): agendar a campanha `5-e-amanha` no Listmonk. Senão, fica no Brevo também.

**Gate de decisão (docs/migracao-brevo-ses.md §6.3) — status por disparo:**

| Disparo | Data | Status |
|---|---|---|
| E-mail 3 (`faltam-7-dias`) | 20/07/2026 | Já enviado, via Brevo |
| E-mail 4 (`faltam-4-dias`) | 23/07/2026 (amanhã) | Fica no Brevo — sem tempo de validar o gate |
| E-mail 5 (`e-amanha`) | 26/07/2026 | Aguardando — depende dos passos pendentes acima |

---

*Atualizar este arquivo a cada marco relevante — não deixar decisões importantes só na memória da conversa.*
