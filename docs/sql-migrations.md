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
  descricao  TEXT NOT NULL DEFAULT '',
  release_at TIMESTAMPTZ
);

-- Adiciona a coluna de agendamento caso a tabela já existisse sem ela
ALTER TABLE aulas
  ADD COLUMN IF NOT EXISTS release_at TIMESTAMPTZ;

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
  evento     TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Adiciona a coluna de evento caso a tabela já existisse sem ela
ALTER TABLE matriculas_leads
  ADD COLUMN IF NOT EXISTS evento TEXT NOT NULL DEFAULT '';

-- ── 6. Lista de espera ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lista_espera (
  id         BIGSERIAL PRIMARY KEY,
  nome       TEXT NOT NULL,
  email      TEXT NOT NULL,
  whatsapp   TEXT NOT NULL,
  evento     TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Adiciona a coluna de evento caso a tabela já existisse sem ela
ALTER TABLE lista_espera
  ADD COLUMN IF NOT EXISTS evento TEXT NOT NULL DEFAULT '';

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

## Backfill do evento em `matriculas_leads` e `lista_espera` (rodar uma única vez)

As colunas `evento` em `matriculas_leads` e `lista_espera` foram adicionadas quando o
evento mudou de "Semana Elegância na Prática" para "O Mapa do Estilo Próprio"
(rota `/mapa-do-estilo-proprio`, tag `mapa-do-estilo-proprio` — ver `EVENTO_TAG` em
`src/constants/evento.ts`). Toda linha criada antes dessa migração é da Semana
Elegância na Prática (não existia outro evento antes) e fica com `evento = ''` por
causa do `DEFAULT ''` da coluna nova — rode este backfill uma vez para marcá-las como
legado, senão o painel `/admin/resultados` não consegue separar "antigo" de "novo".

```sql
UPDATE matriculas_leads SET evento = 'semana-elegancia-na-pratica' WHERE evento = '';
UPDATE lista_espera      SET evento = 'semana-elegancia-na-pratica' WHERE evento = '';
```

---

## Tabelas do projeto

| Tabela | Origem dos dados | Destino Listmonk |
|---|---|---|
| `contacts` | Formulário de contato (site principal) | — |
| `inscricoes` | Inscrição no evento (coluna `evento` distingue Semana Elegância na Prática × Mapa do Estilo Próprio) | Lista `LISTMONK_LIST_ID` — e-mail 1 (imediato) + e-mail 2 (+24h) via `LISTMONK_TEMPLATE_EMAIL_*_ID` |
| `aulas` | Gerenciado pelo painel admin | — |
| `settings` | Painel admin (toggles e URLs) | — |
| `matriculas_leads` | Modal de matrícula (`/matriculas-abertas`) — coluna `evento` idem `inscricoes` | Lista `LISTMONK_MATRICULAS_LIST_ID` — só sincronia, sem automação |
| `lista_espera` | Formulário de lista de espera — coluna `evento` idem `inscricoes` | Fora do escopo do Listmonk |

> O Brevo foi removido do projeto — ver `docs/migracao-brevo-ses.md`. Todo o envio de e-mail (Categoria A por gatilho + Categoria B por campanha) passa pelo Listmonk/SES.

---

## Variáveis de ambiente (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

# Brevo → Listmonk/SES — ver docs/migracao-brevo-ses.md. Brevo foi removido do
# projeto (sem BREVO_API_KEY/BREVO_LIST_ID/BREVO_MATRICULAS_LIST_ID); Categoria A
# (e-mail 1 imediato + e-mail 2 +24h) roda via Listmonk/SES, por isso precisa de
# CRON_SECRET e dos LISTMONK_TEMPLATE_EMAIL_*_ID.
LISTMONK_API_URL=...                # ex: https://listmonk.leticiademetrio.com.br/api
LISTMONK_API_USERNAME=...           # usuário do API user criado em docs/tutorial-listmonk.md Parte 6
LISTMONK_API_KEY=...                # token do mesmo API user
LISTMONK_LIST_ID=...                # lista de inscrições no Listmonk
LISTMONK_MATRICULAS_LIST_ID=...     # lista de matrículas no Listmonk
LISTMONK_TEMPLATE_EMAIL_1_ID=...    # template transacional do e-mail 1 (imediato)
LISTMONK_TEMPLATE_EMAIL_2_ID=...    # template transacional do e-mail 2 (+24h)
CRON_SECRET=...                     # autentica o Cron Job do EasyPanel contra /api/cron/email-sequences — string aleatória longa
UNSUBSCRIBE_SECRET=...              # assina o token do link de cancelamento — string aleatória longa, gerar uma vez e nunca trocar (trocar invalida todo link já enviado)
NEXT_PUBLIC_SITE_URL=https://www.leticiademetrio.com.br  # usado pra montar o link de /cancelar-inscricao nos e-mails
```
