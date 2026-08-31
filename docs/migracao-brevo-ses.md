# Plano: Migração de E-mail Brevo → Amazon SES + Listmonk

Documento de proposta — **migração concluída em 31/08/2026** (ver §0.2). O histórico abaixo (§0.1 em diante) documenta o processo real, incluindo a pausa temporária da Categoria A — mantido como registro, não representa mais o estado atual do código.

---

## 0.2 Retomada e conclusão (31/08/2026)

SES saiu do sandbox e o Listmonk está em produção. Com o evento trocando de "Semana Elegância na Prática" pra "O Mapa do Estilo Próprio" ([[project_semana_elegancia_funnel]]), a base de inscritos recomeça do zero, então o import de contatos existentes (§4) deixou de ser necessário — só falta quem se inscrever daqui pra frente, e isso é sincronizado automaticamente.

**Decisão**: reverter §0.1 — a Categoria A (e-mail 1 imediato + e-mail 2 +24h) foi reconstruída a partir do desenho preservado em §3.2, agora rodando 100% via Listmonk/SES. **O Brevo foi removido do projeto por completo**: `src/lib/brevo.ts` deletado, as chamadas `addContactToBrevo`/`addMatriculasContactToBrevo` removidas das API routes, e as variáveis `BREVO_*` tiradas da lista de env vars (`docs/sql-migrations.md`).

O que existe agora:
- `src/lib/email-sequences.ts` — config `EMAIL_SEQUENCES`, igual ao desenho de §3.2, escopada ao evento atual via `EVENTO_TAG` (evita repetir o quase-incidente de 19/07 — ver `docs/status-migracao-brevo-ses.md` — em que leads de um evento anterior seriam pegos pela varredura do cron).
- `src/app/api/cron/email-sequences/route.ts` — recriada, protegida por `CRON_SECRET`, consulta `inscricoes` filtrando por `evento = EVENTO_TAG`.
- `src/lib/listmonk.ts` — `sendListmonkTransactional()` recriada.
- `src/app/api/evento/inscricao/route.ts` — dispara o e-mail 1 direto após sincronizar o subscriber no Listmonk (a ordem importa: `/tx` falha se o subscriber ainda não existir).

**Pendente pra ativar de verdade em produção** (nenhum destes itens foi confirmado a partir desta sessão — ver checklist §11 atualizado):
1. Criar/confirmar os templates transacionais 1 e 2 no Listmonk de produção (HTML já pronto em `docs/emails/listmonk/1-email-obrigado-pesquisa.html` e `2-email-grupo-whatsapp.html`) e anotar os IDs.
2. Configurar `LISTMONK_TEMPLATE_EMAIL_1_ID`, `LISTMONK_TEMPLATE_EMAIL_2_ID` e `CRON_SECRET` no EasyPanel.
3. Criar o Cron Job no EasyPanel apontando pra `/api/cron/email-sequences` (`docs/tutorial-easypanel-cron.md`, já reflete que isso está ativo de novo).
4. Testar uma inscrição real em produção e confirmar que o e-mail 1 chega, e (depois de 24h ou testando com uma linha backdatada) que o cron dispara o e-mail 2.
5. Remover `BREVO_API_KEY`/`BREVO_LIST_ID`/`BREVO_MATRICULAS_LIST_ID` do EasyPanel e do `.env.local` (não removidos automaticamente — só as referências no código e na documentação).

---

## 0. Janela de tempo — atenção

Hoje é **22/07/2026**. O evento atual (Semana Elegância na Prática) acontece em **27, 29 e 30/07/2026**. Os disparos de data fixa desse ciclo:

| E-mail | Data de disparo | Status |
|---|---|---|
| `3-faltam-7-dias` | 20/07/2026 | Já passou — saiu pelo Brevo, como decidido |
| `4-faltam-4-dias` | **23/07/2026 (amanhã)** | Ainda pelo Brevo — sem tempo de validar o Listmonk pra amanhã |
| `5-e-amanha` | 26/07/2026 | Candidato a migrar pro Listmonk, se o gate (§6.3) passar a tempo |

### 0.1 Mudança de escopo (22/07/2026)

Decisão: **não vamos ativar a automação por gatilho (Categoria A — e-mail imediato + e-mail de +24h) por enquanto.** O Brevo continua sendo o único responsável por isso, indefinidamente, não só até um cutover. O código que já existia pra Categoria A (`src/lib/email-sequences.ts`, a rota de cron) foi **removido** do repositório — o desenho continua documentado em §3.2 (agora marcado como não implementado) caso seja retomado depois.

O que fica ativo a partir de agora é só:
- **Sincronia silenciosa de contatos com o Listmonk** ("dual-write"): toda vez que alguém se inscreve, o contato continua indo pro Brevo exatamente como sempre foi (lista + automação do Brevo dispara normalmente) **e também** é sincronizado no Listmonk (mesma lista/attribs), sem nenhum e-mail sendo disparado a partir daí. Isso mantém a lista do Listmonk sempre atualizada, pronta pra qualquer campanha.
- **Categoria B (campanhas de data fixa)**: continua exatamente como planejado — templates + campanhas agendadas no Listmonk, zero código.

Isso simplifica bastante o que falta fazer: não tem mais gate de "e-mail 1/2 pros novos leads", não tem cron pra configurar, não tem backfill de `email_1_sent_at`/`email_2_sent_at` (essas colunas continuam existindo no Supabase, só não são mais usadas por enquanto). O único gate real que resta é: **o Listmonk consegue mandar uma campanha de verdade via SES?** — e isso só precisa estar prontes antes de agendar 26/07.

---

## 1. Problema

O Brevo cobra por **faixa de contatos**, não por volume de disparo. Mesmo no plano intermediário, o teto fica em ~300–1.500 contatos dependendo da faixa contratada. Com a meta de **1.500 contatos**, o custo mensal do Brevo sobe consideravelmente — e só tende a crescer conforme novas turmas/eventos alimentam a lista.

Referência de mercado (2026): o plano Starter do Brevo vai de 500 até 2.500 contatos por faixa, de **US$9/mês** (5k e-mails) a **US$69/mês** (100k e-mails) — e ultrapassar o teto de contatos força upgrade automático de faixa.

**Amazon SES** cobra por e-mail enviado (**US$0,10 por 1.000 e-mails**), sem limite de contatos armazenados. Isso é essencialmente irrelevante em custo pro nosso volume.

O trade-off: SES é só o "motor de envio" (SMTP puro). Ele não tem listas, templates, automações ou UI — isso é o que o Brevo resolve hoje e precisa ser substituído por outra peça.

---

## 2. Como funciona hoje (as-is)

### 2.1 Fluxo de captura

```
Formulário (InscricaoForm / MatriculasCta / ListaEsperaForm)
        ↓
API route (/api/evento/inscricao ou /api/evento/matriculas)
        ↓
INSERT no Supabase (tabela inscricoes / matriculas_leads / lista_espera)
        ↓
addContactToBrevo() — src/lib/brevo.ts
        ↓
Contato criado/atualizado numa lista do Brevo (BREVO_LIST_ID ou BREVO_MATRICULAS_LIST_ID)
        ↓
Automação do Brevo dispara (configurada dentro do próprio Brevo, fora deste repo)
```

Escopo real, confirmado em 19/07/2026:

| Tabela | Vai pro Brevo hoje? | Tem automação hoje? | Entra na migração? |
|---|---|---|---|
| `inscricoes` | Sim (`BREVO_LIST_ID`) | **Sim** — os 5 e-mails do funil | **Sim** — é o único fluxo que precisa de automação |
| `matriculas_leads` | Sim (`BREVO_MATRICULAS_LIST_ID`) | **Não** — só entra na lista, sem automação, e não há plano de criar uma | Sincroniza contato pra manter paridade, **sem** automação (igual hoje) |
| `lista_espera` | **Não** | — | **Fora do escopo** — não vai pro Listmonk |

### 2.2 Automação de e-mail (evento "Semana Elegância na Prática")

Hoje existem 5 templates prontos em `docs/emails/`, mas o funil completo planejado tem **mais de 30 e-mails** ao longo do relacionamento com o lead — a maioria ainda sem layout definido, a serem criados sob demanda.

| # | Template | Gatilho | Timing |
|---|---|---|---|
| 1 | `1-email-obrigado-pesquisa.html` | Inscrição no formulário | Imediato |
| 2 | `2-email-grupo-whatsapp.html` | — | +24h após inscrição |
| 3 | `3-faltam-7-dias.html` | — | Data fixa: 20/07/2026 |
| 4 | `4-faltam-4-dias.html` | — | Data fixa: 23/07/2026 |
| 5 | `5-e-amanha.html` | — | Data fixa: 26/07/2026 |
| 6+ | *(a criar)* | — | Data fixa, uma por e-mail |

Ponto-chave pra arquitetura: os e-mails 1 e 2 são relativos ao momento da inscrição (drip por lead — precisariam de automação/cron) — **esses continuam 100% no Brevo, por decisão de escopo (§0.1), sem data prevista de migração.** Todos os outros — os que restam neste ciclo e os 25+ que ainda serão criados — são disparos em massa numa data de calendário fixa, iguais pra toda a lista. Isso é uma campanha agendada, não uma automação por lead, e **não precisa de nenhum código** — só do agendador nativo de campanhas do Listmonk (ver §3.1). É essa segunda categoria que está sendo migrada agora.

Os templates usam merge tags do Brevo (`{{ contact.NAME }}`) e já têm a identidade visual da Letícia (header preto, faixa gradiente rosa/vinho, tipografia Georgia + Helvetica) — isso **não muda**, só a sintaxe do merge tag.

### 2.3 Infra atual

- VPS Hostinger, gerenciado via **EasyPanel** (RAM/CPU com folga confirmada — não é uma restrição pra rodar Listmonk + Postgres).
- App Next.js + Supabase (free tier) + Brevo (contato/e-mail).
- Custo de infra atual: ~R$0/mês (VPS e domínio já pagos, Supabase free tier).
- **Sem ambiente de staging** — só produção e local. As contas AWS/SES e Listmonk que forem criadas já são as oficiais, não existem "contas de teste" separadas.

---

## 3. Proposta

**Amazon SES** (envio) + **Listmonk** (listas, templates, campanhas), self-hosted no mesmo VPS via EasyPanel.

### 3.1 Duas categorias de e-mail (uma delas adiada por decisão de escopo)

A arquitetura sempre separou os e-mails em duas categorias, porque elas têm necessidades de engenharia completamente diferentes — isso continua valendo, só que a Categoria A está **pausada** (§0.1), não implementada:

**A. E-mails por gatilho relativo ao lead** (e-mail 1 e e-mail 2 da `inscricoes`) — **adiada, continua 100% no Brevo**
- Precisaria de código: uma chamada na API route (imediato) e um cron job (delay). Já foi construída, testada e removida do repo por decisão de escopo — desenho preservado em §3.2 caso seja retomada.

**B. E-mails de campanha em data fixa** (e-mail 3, 4, 5 — e os 25+ que ainda serão criados) — **é o que está ativo agora**
- **Zero código.** Criar o template no painel do Listmonk, criar uma campanha, escolher a lista, agendar data/hora. O Listmonk dispara sozinho no horário.
- Depende de os contatos já estarem sincronizados no Listmonk — é isso que a sincronia silenciosa (§3.1.1) resolve.

### 3.1.1 Sincronia silenciosa de contatos (dual-write) — o que está ativo hoje

Como a Categoria A não dispara mais nada a partir do código, mas as campanhas da Categoria B precisam de uma lista atualizada no Listmonk, as duas API routes (`inscricao` e `matriculas`) fazem hoje:

```
INSERT no Supabase (sem mudança)
        ↓
   ┌────┴─────────────────────────────┐
   ↓                                  ↓
addContactToBrevo()              addSubscriberToListmonk()
(igual sempre foi —               (novo — só sincroniza contato +
automação do Brevo                lista/attribs, NÃO dispara
dispara normalmente)              nenhum e-mail)
```

As duas chamadas são independentes, cada uma no seu próprio `try/catch` — uma falhar não afeta a outra, e nenhuma das duas pode derrubar a submissão do formulário. O Brevo nem percebe que o Listmonk existe; o Listmonk só fica com uma cópia sempre atualizada da lista, pronta pra qualquer campanha ser agendada contra ela.

### 3.2 Categoria A — desenho genérico (não implementado — histórico/referência caso seja retomado)

*Esta seção descreve o desenho que **já foi construído e testado**, e depois **removido** do repositório em 22/07/2026 por decisão de escopo (§0.1). Fica aqui só como referência exata de como reconstruir, se um dia isso voltar a ser prioridade — não representa código existente hoje.*

Em vez de escrever uma rota de cron dedicada por e-mail (o que não escalaria bem se amanhã `matriculas_leads` também ganhar um e-mail +48h, por exemplo), a Categoria A virava uma **configuração pequena**, não uma rota por e-mail:

```ts
// src/lib/email-sequences.ts
type SequenceStep = {
  table: 'inscricoes'          // tabela de origem
  delayHours: number           // 0 = imediato, disparado na própria API route
  listmonkTemplateId: number
  sentColumn: string           // coluna timestamp em Supabase que marca "já enviado"
}

export const EMAIL_SEQUENCES: SequenceStep[] = [
  { table: 'inscricoes', delayHours: 0,  listmonkTemplateId: 1, sentColumn: 'email_1_sent_at' },
  { table: 'inscricoes', delayHours: 24, listmonkTemplateId: 2, sentColumn: 'email_2_sent_at' },
]
```

- O passo `delayHours: 0` era chamado direto na API route de inscrição.
- Um cron job (rodando de hora em hora) percorria os passos com `delayHours > 0`, consultava a tabela indicada por leads dentro da janela de delay com `sentColumn IS NULL`, disparava via Listmonk e marcava o timestamp.
- As colunas `email_1_sent_at`/`email_2_sent_at` continuam existindo em `inscricoes` (migration já rodada), só não são mais escritas por ninguém — inofensivas, ficam `NULL` até serem retomadas.

### 3.3 Por que Listmonk

| Ferramenta | O que resolve | Por que sim/não |
|---|---|---|
| **Listmonk** | Listas, templates, campanhas agendadas, API de subscribers | ✅ Template pronto no EasyPanel · single binary Go + Postgres, leve · tem agendamento de campanha nativo pra Categoria B (os 25+ e-mails futuros não tocam em código) · integra bounce/complaint do SES nativamente |
| n8n | Automação visual (workflows com delay, condicionais) | Também disponível no EasyPanel — mas não traz vantagem aqui: a Categoria B já é resolvida pelo agendador nativo do Listmonk, e a Categoria A (que usaria isso) está pausada |
| Postal / Mailu | Servidor de e-mail completo (MTA próprio) | Alternativas ao **SES**, não ao Brevo — rodar MTA próprio exige reputação de IP e warm-up manual. Sem vantagem sobre SES pro nosso volume |

### 3.4 Arquitetura atual

```
Formulário (sem mudança)
        ↓
API route (Next.js)
        ↓
INSERT no Supabase (sem mudança)
        ↓
   ┌────┴─────────────────────────────┐
   ↓                                  ↓
addContactToBrevo()              addSubscriberToListmonk()
(automação do Brevo               (só sincroniza contato — sem
dispara normalmente,              disparar nenhum e-mail)
inalterado)

Campanhas agendadas no painel do Listmonk (Categoria B)
(criadas com antecedência, uma por e-mail — hoje 3, no futuro 25+)
        ↓
No horário agendado, Listmonk dispara pra lista/segmento escolhido
                                       ↓
                                  Listmonk → SMTP SES → inbox de todos os leads
```

---

## 4. Migração dos contatos já existentes

Como a Categoria A está pausada, **não existe mais o risco de duplicar e-mail 1/2** que motivava o backfill original (esse desenho de backfill fica preservado em `docs/sql-migrations.md`, referência caso a Categoria A seja retomada). O que continua sendo necessário, mais simples:

1. **Importar os contatos já existentes de `inscricoes`/`matriculas_leads` como subscribers no Listmonk** (nome + e-mail + whatsapp como atributo) — só quem se inscrever *depois* da sincronia (§3.1.1) entrar em produção é sincronizado automaticamente; quem já estava na base antes precisa desse import único.
2. Fazer isso via a mesma função de sync (`addSubscriberToListmonk`) rodada em lote contra as linhas existentes, ou via import CSV direto no painel do Listmonk (**Lists → Import**) — qualquer um dos dois funciona, o import CSV é mais rápido pra um lote único.

---

## 5. Documentação a ser produzida durante a implementação

Pedido explícito: tutoriais passo a passo, não só o plano de arquitetura. Serão criados como documentos separados (estilo `docs/deploy-coolify.md`, passo a passo com checkboxes), durante as fases correspondentes da implementação — não fazem parte deste doc de proposta:

| Documento | Conteúdo |
|---|---|
| `docs/tutorial-amazon-ses.md` | Criar conta AWS (ou usar existente), criar identidade de domínio/subdomínio no SES, configurar DNS (SPF/DKIM via Easy DKIM/DMARC), solicitar saída do sandbox mode, gerar credenciais SMTP, configurar SNS pra bounce/complaint |
| `docs/tutorial-listmonk.md` | Deploy do Listmonk no EasyPanel, configurar SMTP apontando pro SES, criar listas, criar templates transacionais e de campanha, importar subscribers, como fazer um envio de teste |
| `docs/tutorial-easypanel-cron.md` | Como criar um Cron Job no EasyPanel — **não usado no momento** (era pra Categoria A, pausada), mantido caso ela seja retomada |
| `docs/runbook-emails.md` | **Runbook de manutenção**: como adicionar um novo e-mail de campanha (Categoria B) sem tocar em código; como adicionar uma lista nova. A seção de Categoria A por gatilho fica marcada como pausada |
| `docs/status-migracao-brevo-ses.md` | Log vivo do progresso real da migração (o que já foi feito, o que falta, decisões tomadas no meio do caminho) — atualizado conforme a implementação avança |
| `docs/teste-local.md` | Testar o pipeline inteiro localmente (Docker: Listmonk + Postgres + Mailhog), sem depender de nada da AWS |
| `docs/teste-producao-sem-cutover.md` | Testar o Listmonk real (EasyPanel) + SES real a partir da máquina local, sem tocar no `EMAIL_PROVIDER` do app publicado — o gate de decisão de §6.3 na prática |

---

## 6. Estratégia de rollout

### 6.1 Sem ambiente de staging

Não existe conta AWS/SES nem instância de Listmonk "de teste" — as que forem criadas já são as oficiais. A validação ponta a ponta acontece assim:

1. **Local**: rodar Listmonk via Docker localmente (docker-compose), apontado pro SES real ainda em **sandbox mode** — nesse modo o SES só entrega pra endereços verificados manualmente, então dá pra testar o pipeline (Supabase → API route → Listmonk → SES → inbox) mandando só pro próprio e-mail da Letícia/seu, sem risco de mandar nada pra um lead real. Passo a passo: `docs/teste-local.md`. **Concluído em 19/07/2026** (na época ainda incluía a Categoria A, hoje pausada — mas a sincronia de contato e o cancelamento de inscrição foram validados e continuam iguais).
2. **Infra de produção**: o Listmonk real (EasyPanel) e o SES real são testados **a partir da sua máquina local**, apontando o `.env.local` pra URL/credenciais de produção — o app publicado no EasyPanel nem participa desse teste, já que esse arquivo `.env.local` é local e nunca chega no deploy. Passo a passo: `docs/teste-producao-sem-cutover.md` (as seções de e-mail 1/2/cron já não se aplicam, só a parte de sync + campanha).
3. Como não existe mais um cutover único (§6.2), o resultado desses testes só determina: o Listmonk de produção está pronto pra ter campanhas agendadas contra ele.

### 6.2 Não existe mais um "cutover" único

Como a Categoria A ficou de fora, **não há mais um momento único de virar uma chave** — o Brevo continua rodando a automação pra sempre (ou até esse escopo ser revisitado), em paralelo, permanentemente. O que existe agora são dois processos independentes, cada um com seu próprio ritmo:

1. **Sincronia de contatos (dual-write)**: já está ativa em produção (assim que deployada) — não depende de nenhum gate, é só uma adição silenciosa que nunca deveria quebrar nada (`try/catch` isolado, igual ao padrão que já protegia a chamada do Brevo).
2. **Campanhas de data fixa**: cada uma agendada individualmente no Listmonk, só depois que o SES/Listmonk estiverem confirmados funcionando (gate em §6.3). Não tem "ligar" ou "desligar" um provedor — é só uma questão de quando cada campanha específica está pronta pra ser agendada.

### 6.3 Este ciclo específico (evento de 27–30/07) — gate de decisão

O único gate que resta: **o Listmonk consegue mandar uma campanha de verdade via SES, com deliverability confirmada?**

> **Gate**: considerado "pronto" depois de um envio de teste real, em produção, entregue com sucesso na inbox (sem bounce, sem cair em spam) — feito com pelo menos 1 dia de folga antes do disparo em questão.

| Disparo | Status |
|---|---|
| 20/07 (`faltam-7-dias`) | Já passou pelo Brevo |
| 23/07 (`faltam-4-dias`) | Fica no Brevo — sem tempo de validar o gate até amanhã |
| 26/07 (`e-amanha`) | Migra pro Listmonk **se** o gate passar até 25/07; senão fica no Brevo |

O Brevo **nunca é desligado preventivamente** — a campanha que ainda não migrou continua armada e configurada no Brevo até o gate passar especificamente pra ela.

---

## 7. Mudanças de código — atualizadas em 31/08/2026 (ver `docs/status-migracao-brevo-ses.md`)

- **`src/lib/brevo.ts` foi deletado.** Não existe mais nenhuma chamada ao Brevo no código.
- `src/lib/listmonk.ts` — `addSubscriberToListmonk` (sync), `blocklistListmonkSubscriberByEmail` (cancelamento) e `sendListmonkTransactional` (recriada — envia o e-mail 1/2 via `/api/tx`, exige que o subscriber já exista no Listmonk).
- `src/app/api/evento/inscricao/route.ts`: sincroniza o subscriber no Listmonk e, na sequência, dispara o e-mail 1 (imediato) via `sendListmonkTransactional`, marcando `email_1_sent_at`. `.../matriculas/route.ts`: só sincroniza (sem automação, como sempre foi).
- **Recriados** (31/08/2026, a partir do desenho de §3.2): `src/lib/email-sequences.ts` (config `EMAIL_SEQUENCES`, agora escopada por `EVENTO_TAG`) e `src/app/api/cron/email-sequences/route.ts` (dispara o e-mail 2, +24h).
- Colunas `email_1_sent_at`/`email_2_sent_at` em `inscricoes`: voltaram a ser escritas, só pra linhas do evento atual (`evento = EVENTO_TAG`) — linhas de eventos anteriores nunca são tocadas pelo cron.
- `src/lib/unsubscribe.ts` + `src/app/cancelar-inscricao/page.tsx` — inalterados.
- Variáveis de ambiente (lista completa em `docs/sql-migrations.md`): `LISTMONK_API_URL`, `LISTMONK_API_USERNAME`, `LISTMONK_API_KEY`, `LISTMONK_LIST_ID`, `LISTMONK_MATRICULAS_LIST_ID`, `LISTMONK_TEMPLATE_EMAIL_1_ID`, `LISTMONK_TEMPLATE_EMAIL_2_ID`, `CRON_SECRET`, `UNSUBSCRIBE_SECRET`, `NEXT_PUBLIC_SITE_URL`. As `BREVO_*` não são mais usadas pelo código — remover do EasyPanel e do `.env.local` quando conveniente.

---

## 8. Comparativo de custo

| | Hoje (Brevo) | Proposto (SES + Listmonk) |
|---|---|---|
| Armazenar 1.500 contatos | Exige faixa paga do plano Starter (~US$9–29/mês conforme volume de envio) | Sem custo — Listmonk não cobra por contato |
| Enviar e-mails (funil completo, 30+ por lead ao longo do relacionamento) | Incluído na faixa do plano | US$0,10 a cada 1.000 envios — pra 1.500 contatos × 30 e-mails = 45.000 envios, ≈ **US$4,50 no total**, não por mês |
| Infra de envio | Gerenciada pelo Brevo | Listmonk container no VPS já pago — sem custo adicional relevante de RAM/CPU (confirmado que há folga) |
| **Total mensal estimado** | US$9–29+/mês, crescendo com a lista | **< US$2/mês** na prática, praticamente fixo até volumes bem maiores |

---

## 9. Riscos e pontos de atenção

- **Janela de tempo do ciclo atual** — ver §0 e §6.3, já endereçado (Brevo continua pros disparos que restam).
- **Reputação de domínio nova**: primeiro grande volume de envio via SES nesse domínio/subdomínio — vale um "aquecimento" gradual mesmo sendo baixo volume.
- **Aprovação do sandbox do SES** não é instantânea (1–3 dias úteis) — precisa ser solicitada com folga.
- **Sem ambiente de teste separado** (§6.1) — mitigado testando com endereços verificados enquanto o SES ainda está em sandbox, tanto local quanto em produção.
- **Sem builder visual de e-mail**: o Brevo tem editor drag-and-drop; o Listmonk edita HTML/rich-text direto. Como os templates atuais já são HTML codado à mão, isso não deve ser um problema — só precisa colar o HTML (a parte do meio, ver `docs/tutorial-listmonk.md` §5) e trocar os merge tags.
- **Backup**: Listmonk guarda suas listas no Postgres do próprio container — precisa entrar no plano de backup do VPS (hoje isso não existe nem pro Supabase em produção, segundo `docs/custos-producao.md`).
- **Categoria A pausada indefinidamente**: se em algum momento decidir retomar o e-mail imediato/+24h via Listmonk, o desenho e o código já existiram e estão documentados em §3.2 — não é preciso reinventar, só reconstruir a partir dali.

---

## 10. Pendências reais (o que ainda falta decidir)

1. Nome exato do subdomínio de envio — **decidido**: `mail.leticiademetrio.com.br` (identidade criada no SES, DNS configurado no Cloudflare, SES fora do sandbox — confirmado em 31/08/2026).
2. Confirmar com a Letícia se ela tem/quer acesso direto ao painel do Listmonk pra criar campanhas dos e-mails futuros, ou se isso continua sendo feito por você (afeta o nível de detalhe do runbook em `docs/runbook-emails.md`).
3. ~~Se/quando retomar a Categoria A~~ — **retomada em 31/08/2026**, ver §0.2.

---

## 11. Checklist de implementação

Status detalhado e sempre atualizado em `docs/status-migracao-brevo-ses.md` — esta lista é a visão geral.

- [x] Escrever os documentos de `docs/tutorial-amazon-ses.md`, `docs/tutorial-listmonk.md`, `docs/runbook-emails.md`, `docs/teste-local.md`, `docs/teste-producao-sem-cutover.md`
- [x] Criar `src/lib/listmonk.ts` (sync de contato + blocklist + transacional)
- [x] `src/lib/unsubscribe.ts` + `src/app/cancelar-inscricao/page.tsx`
- [x] Testar o fluxo completo localmente (Docker + Mailhog) — subscriber sync, sem disparo de e-mail, confirmado
- [x] Criar identidade de domínio no SES (`mail.leticiademetrio.com.br`) + DNS no Cloudflare (DKIM/SPF/DMARC)
- [x] Confirmar identidade **Verified** no console SES
- [x] Solicitar e confirmar saída do sandbox mode no SES
- [x] Deploy do Listmonk em produção (EasyPanel)
- [x] ~~Importar os contatos já existentes no Listmonk (§4)~~ — não necessário: evento novo, base recomeça do zero (§0.2)
- [x] Reconstruir a Categoria A a partir do desenho de §3.2: `src/lib/email-sequences.ts`, `src/app/api/cron/email-sequences/route.ts`, disparo do e-mail 1 em `src/app/api/evento/inscricao/route.ts`
- [x] Remover o Brevo do código: `src/lib/brevo.ts` deletado, chamadas removidas das API routes
- [ ] Confirmar SMTP do Listmonk de produção apontando pro SES (não verificado nesta sessão)
- [ ] Confirmar listas + API user/role no Listmonk de produção (não verificado nesta sessão)
- [ ] Criar/confirmar os templates transacionais 1 e 2 no Listmonk de produção (HTML pronto em `docs/emails/listmonk/`) e anotar os IDs
- [ ] Configurar `LISTMONK_TEMPLATE_EMAIL_1_ID`, `LISTMONK_TEMPLATE_EMAIL_2_ID`, `CRON_SECRET` no EasyPanel
- [ ] Criar o Cron Job no EasyPanel apontando pra `/api/cron/email-sequences` (`docs/tutorial-easypanel-cron.md`)
- [ ] Remover `BREVO_API_KEY`/`BREVO_LIST_ID`/`BREVO_MATRICULAS_LIST_ID` do EasyPanel e do `.env.local`
- [ ] Testar uma inscrição real em produção: e-mail 1 chega, e-mail 2 dispara via cron depois de 24h (ou linha backdatada)
- [ ] Migrar os templates de campanha existentes pro Listmonk (wrapper + 3, 4, 5), ajustando merge tags — datas do ciclo antigo (27–30/07) não se aplicam mais, replanejar pro Mapa do Estilo Próprio (14, 16 e 18/09)
- [ ] Manter `docs/status-migracao-brevo-ses.md` atualizado durante todo o processo

---

*Documento de planejamento — status de execução em `docs/status-migracao-brevo-ses.md`.*
