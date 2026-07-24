# SQL — Banco de Dados Completo (Supabase)

## Comando único — cole tudo de uma vez no SQL Editor

Acesse **Supabase → SQL Editor**, cole o bloco abaixo e clique em **Run**.
Todos os comandos são idempotentes: podem ser rodados quantas vezes quiser sem apagar dados existentes.

```sql
-- ── 1. Formulário de contato ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  phone      TEXT NOT NULL,
  message    TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 2. Inscrições no evento ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS inscricoes (
  id           BIGSERIAL PRIMARY KEY,
  nome         TEXT NOT NULL,
  email        TEXT NOT NULL,
  whatsapp     TEXT NOT NULL,
  evento       TEXT NOT NULL DEFAULT '',
  utm_source   TEXT NOT NULL DEFAULT '',
  utm_medium   TEXT NOT NULL DEFAULT '',
  utm_campaign TEXT NOT NULL DEFAULT '',
  utm_content  TEXT NOT NULL DEFAULT '',
  utm_term     TEXT NOT NULL DEFAULT '',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Adiciona as colunas de UTM caso a tabela já existisse sem elas
ALTER TABLE inscricoes
  ADD COLUMN IF NOT EXISTS utm_source   TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS utm_medium   TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS utm_campaign TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS utm_content  TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS utm_term     TEXT NOT NULL DEFAULT '';

-- ── 3. Aulas da semana ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS aulas (
  id         INT PRIMARY KEY,
  dia        TEXT NOT NULL,
  titulo     TEXT NOT NULL DEFAULT '',
  youtube_id TEXT NOT NULL DEFAULT '',
  duracao    TEXT NOT NULL DEFAULT '',
  descricao  TEXT NOT NULL DEFAULT ''
);

INSERT INTO aulas (id, dia, titulo, youtube_id, duracao, descricao) VALUES
  (1, 'Dia 1', 'Por que você ainda não consegue se vestir bem todos os dias!', '_wc9AdSWkfs', '36min', 'Entenda o que o seu jeito de se vestir comunica sobre você e como alinhar sua aparência com quem você realmente é.'),
  (2, 'Dia 2', 'Como montar looks elegantes que realmente funcionam no seu dia a dia!', 'dYViSCujEus', '23min', 'Descubra quais tons realçam a sua pele e aprenda a usá-los com confiança no dia a dia.'),
  (3, 'Dia 3', '', '', '', ''),
  (4, 'Dia 4', '', '', '', '')
ON CONFLICT (id) DO NOTHING;

-- ── 4. Configurações do painel admin ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS settings (
  id                   INT PRIMARY KEY DEFAULT 1,
  site_ativo           BOOLEAN NOT NULL DEFAULT TRUE,
  evento_semana_ativo  BOOLEAN NOT NULL DEFAULT FALSE,
  aulas_ativo          BOOLEAN NOT NULL DEFAULT FALSE,
  matriculas_ativo     BOOLEAN NOT NULL DEFAULT FALSE,
  lista_espera_ativo   BOOLEAN NOT NULL DEFAULT FALSE,
  whatsapp_group_url   TEXT NOT NULL DEFAULT '',
  survey_url           TEXT NOT NULL DEFAULT '',
  whatsapp_number      TEXT NOT NULL DEFAULT '',
  matriculas_video_url TEXT NOT NULL DEFAULT '',
  matriculas_cta_url   TEXT NOT NULL DEFAULT ''
);

INSERT INTO settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Adiciona colunas novas caso a tabela já existisse com menos campos
ALTER TABLE settings
  ADD COLUMN IF NOT EXISTS matriculas_ativo     BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS lista_espera_ativo   BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS whatsapp_number      TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS matriculas_video_url TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS matriculas_cta_url   TEXT NOT NULL DEFAULT '';

-- ── 5. Leads de matrículas ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS matriculas_leads (
  id         BIGSERIAL PRIMARY KEY,
  nome       TEXT NOT NULL,
  email      TEXT NOT NULL,
  whatsapp   TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 6. Lista de espera ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lista_espera (
  id         BIGSERIAL PRIMARY KEY,
  nome       TEXT NOT NULL,
  email      TEXT NOT NULL,
  whatsapp   TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── 7. Migração Brevo → Listmonk/SES (docs/migracao-brevo-ses.md) ──────────
-- Marca quando cada e-mail da Categoria A (gatilho relativo à inscrição) foi
-- enviado. NULL = ainda não enviado. Usado pelo cron em
-- src/app/api/cron/email-sequences/route.ts pra não duplicar envio.
ALTER TABLE inscricoes
  ADD COLUMN IF NOT EXISTS email_1_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS email_2_sent_at TIMESTAMPTZ;
```

---

## Backfill dos contatos existentes (rodar uma única vez, no cutover)

Ver `docs/migracao-brevo-ses.md` §4. Todos os contatos de `inscricoes` já receberam o e-mail 1 via Brevo antes da migração — sem este backfill, o e-mail 1 seria disparado de novo pra todo mundo assim que `EMAIL_PROVIDER` virar `listmonk`.

**Rodar só depois de conferir manualmente no relatório do Brevo que não há contato sem ter recebido o e-mail 1.**

```sql
-- Todos os contatos existentes já receberam o e-mail 1 (automação do Brevo já rodou).
UPDATE inscricoes
SET email_1_sent_at = created_at
WHERE email_1_sent_at IS NULL;

-- Quem se inscreveu há mais de 24h já deve ter recebido o e-mail 2 também.
-- Quem se inscreveu há menos de 24h fica com email_2_sent_at NULL de propósito —
-- o cron novo assume o envio assim que a janela de 24h completar.
UPDATE inscricoes
SET email_2_sent_at = created_at
WHERE email_2_sent_at IS NULL
  AND created_at <= NOW() - INTERVAL '24 hours';
```

---

## Tabelas do projeto

| Tabela | Origem dos dados | Destino Brevo |
|---|---|---|
| `contacts` | Formulário de contato (site principal) | — |
| `inscricoes` | Inscrição na Semana Elegância na Prática | Lista `BREVO_LIST_ID` |
| `aulas` | Gerenciado pelo painel admin | — |
| `settings` | Painel admin (toggles e URLs) | — |
| `matriculas_leads` | Modal de matrícula (`/matriculas-abertas`) | Lista `BREVO_MATRICULAS_LIST_ID` |
| `lista_espera` | Formulário de lista de espera | Apenas Supabase |

> A coluna "Destino Brevo" reflete o estado atual. Durante a migração descrita em `docs/migracao-brevo-ses.md`, `inscricoes` e `matriculas_leads` passam a ir pro Listmonk assim que `EMAIL_PROVIDER=listmonk` for ativado — `lista_espera` continua fora de qualquer um dos dois.

---

## Variáveis de ambiente (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

BREVO_API_KEY=...
BREVO_LIST_ID=...             # Lista de inscrições do evento (Semana)
BREVO_MATRICULAS_LIST_ID=...  # Lista de leads da página de matrículas

# Migração Brevo → Listmonk/SES — ver docs/migracao-brevo-ses.md
# Só a sincronia de contato (dual-write) + campanhas estão ativas (Categoria A pausada, §0.1) —
# por isso não tem EMAIL_PROVIDER, CRON_SECRET nem LISTMONK_TEMPLATE_EMAIL_*_ID aqui.
LISTMONK_API_URL=...                # ex: https://listmonk.leticiademetrio.com.br/api
LISTMONK_API_USERNAME=...           # usuário do API user criado em docs/tutorial-listmonk.md Parte 6
LISTMONK_API_KEY=...                # token do mesmo API user
LISTMONK_LIST_ID=...                # lista de inscrições no Listmonk
LISTMONK_MATRICULAS_LIST_ID=...     # lista de matrículas no Listmonk
UNSUBSCRIBE_SECRET=...              # assina o token do link de cancelamento — string aleatória longa, gerar uma vez e nunca trocar (trocar invalida todo link já enviado)
NEXT_PUBLIC_SITE_URL=https://www.leticiademetrio.com.br  # usado pra montar o link de /cancelar-inscricao nos e-mails
```
