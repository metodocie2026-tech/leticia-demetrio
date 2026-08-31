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
  id         BIGSERIAL PRIMARY KEY,
  nome       TEXT NOT NULL,
  email      TEXT NOT NULL,
  whatsapp   TEXT NOT NULL,
  evento     TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

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

-- ── 7. Ofertas (serviços e produtos/cursos) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS ofertas (
  id                BIGSERIAL PRIMARY KEY,
  tipo              TEXT NOT NULL CHECK (tipo IN ('servico', 'produto_curso')),
  modalidade        TEXT NOT NULL DEFAULT 'ambos' CHECK (modalidade IN ('online', 'presencial', 'ambos', 'digital')),
  slug              TEXT NOT NULL UNIQUE,
  titulo            TEXT NOT NULL DEFAULT '',
  descricao_curta   TEXT NOT NULL DEFAULT '',
  icone             TEXT NOT NULL DEFAULT '',
  destaque          BOOLEAN NOT NULL DEFAULT FALSE,
  ordem             INT NOT NULL DEFAULT 0,
  cta_tipo          TEXT NOT NULL DEFAULT 'whatsapp' CHECK (cta_tipo IN ('whatsapp', 'link')),
  cta_url           TEXT NOT NULL DEFAULT '',
  cta_mensagem      TEXT NOT NULL DEFAULT '',
  cta_label         TEXT NOT NULL DEFAULT '',
  sobre             JSONB NOT NULL DEFAULT '[]',
  como_funciona     JSONB NOT NULL DEFAULT '[]',
  galeria           JSONB NOT NULL DEFAULT '[]',
  faq               JSONB NOT NULL DEFAULT '[]',
  seo_titulo        TEXT NOT NULL DEFAULT '',
  seo_descricao     TEXT NOT NULL DEFAULT '',
  investimento_nota TEXT NOT NULL DEFAULT '',
  ativo             BOOLEAN NOT NULL DEFAULT TRUE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Caso a tabela já exista de uma rodada anterior deste bloco (sem a coluna "sobre"):
ALTER TABLE ofertas
  ADD COLUMN IF NOT EXISTS sobre JSONB NOT NULL DEFAULT '[]';

-- Caso a tabela já exista com a constraint antiga (sem 'digital' como opção de modalidade):
ALTER TABLE ofertas DROP CONSTRAINT IF EXISTS ofertas_modalidade_check;
ALTER TABLE ofertas ADD CONSTRAINT ofertas_modalidade_check
  CHECK (modalidade IN ('online', 'presencial', 'ambos', 'digital'));

-- Seed: migra o conteúdo que já estava hardcoded em src/constants/services.ts,
-- pra não regredir o site no ar. Campos de CTA/página individual/SEO ficam
-- vazios de propósito — preenchidos depois pelo admin. Produtos/cursos são
-- sempre 'digital' (ebook ou curso gravado) — nunca presencial, nunca "online"
-- no sentido de encontro ao vivo.
INSERT INTO ofertas (tipo, modalidade, slug, titulo, descricao_curta, icone, destaque, ordem) VALUES
  ('servico', 'ambos', 'coloracao-pessoal', 'Análise de Coloração Pessoal', 'Descubra as cores que harmonizam com sua pele, cabelo e olhos. Crie uma paleta pessoal que valoriza e ilumina você em qualquer situação.', 'Palette', TRUE, 1),
  ('servico', 'ambos', 'consultoria-imagem', 'Consultoria de Imagem Completa', 'Uma jornada de autoconhecimento para desenvolver um estilo autêntico que reflete sua personalidade, valores e objetivos de vida.', 'Sparkles', TRUE, 2),
  ('servico', 'presencial', 'personal-shopper', 'Personal Shopper', 'Compras assertivas e sem desperdício. Vou com você para montar looks perfeitos para cada ocasião, respeitando seu orçamento e estilo.', 'ShoppingBag', FALSE, 3),
  ('servico', 'presencial', 'visagismo', 'Visagismo', 'Harmonia entre seu rosto, corte de cabelo e acessórios para realçar sua beleza natural de forma equilibrada e elegante.', 'Scissors', FALSE, 4),
  ('servico', 'ambos', 'cursos-workshops', 'Cursos & Workshops', 'Aprenda as ferramentas da consultoria de imagem e transforme não só seu guarda-roupa, mas sua autoestima e confiança.', 'BookOpen', FALSE, 5),
  ('servico', 'ambos', 'mentoria-individual', 'Mentoria Individual', 'Acompanhamento personalizado e contínuo para quem deseja uma transformação profunda e duradoura na sua imagem e autoestima.', 'Heart', FALSE, 6),
  ('produto_curso', 'digital', 'cores-identidade', 'Método Cores & Identidade', 'Análise completa de coloração pessoal integrada à consultoria de imagem em um programa transformador que une técnica e essência.', '', TRUE, 1),
  ('produto_curso', 'digital', 'imagem-pessoal-do-zero', 'Imagem Pessoal do Zero', 'Para quem quer aprender a se vestir bem por conta própria. Domine os fundamentos do estilo pessoal com didática e leveza.', '', TRUE, 2),
  ('produto_curso', 'digital', 'armario-capsula', 'Workshop Armário Cápsula', 'Crie um guarda-roupa funcional e incrível com menos peças, mais versatilidade e zero culpa nas compras.', '', FALSE, 3),
  ('produto_curso', 'digital', 'programa-imagem-completa', 'Programa Imagem Completa', 'O programa mais abrangente: coloração, estilo, personal shopping e visagismo em uma experiência imersiva e única.', '', TRUE, 4),
  ('produto_curso', 'digital', 'estilo-em-casa', 'Estilo em Casa', 'Acesse os ensinamentos de Letícia de onde você estiver. Metodologia online com suporte e comunidade exclusiva.', '', FALSE, 5)
ON CONFLICT (slug) DO NOTHING;

-- Caso as linhas acima já tenham sido inseridas antes desta mudança (ON CONFLICT
-- DO NOTHING as ignora), força a correção pra 'digital' nos produtos/cursos existentes:
UPDATE ofertas SET modalidade = 'digital' WHERE tipo = 'produto_curso' AND modalidade != 'digital';
```

---

## Conteúdo de exemplo (fake) nas páginas individuais

Pra poder revisar como as páginas `/servicos/[slug]` e `/produtos/[slug]` ficam com conteúdo de verdade, populamos "Sobre" e "Perguntas frequentes" pras 11 ofertas do seed, com texto de exemplo — **pra ajustar/reescrever depois pelo admin** (`/admin/ofertas` → "Editar detalhes"), não é texto final. A galeria só foi preenchida em 2 ofertas (uma de cada tipo), reaproveitando fotos que já existem em `public/images` só como placeholder visual — **substituir por fotos reais de atendimento assim que possível**, incluindo nas outras 9 ofertas.

```sql
UPDATE ofertas SET
  sobre = '["A análise de coloração pessoal é o primeiro passo para descobrir quais tons realmente valorizam você. Em um encontro individual, avaliamos sua pele, olhos e cabelo para identificar sua paleta de cores ideal.", "Com esse mapa em mãos, fica muito mais fácil montar looks, escolher maquiagem e até renovar o guarda-roupa com confiança — sem gastar com peças que não combinam com você."]'::jsonb,
  faq = '[{"pergunta":"Quanto tempo dura a sessão?","resposta":"Em média, de 1h30 a 2h, incluindo a análise completa e a explicação da sua paleta de cores."},{"pergunta":"Preciso levar alguma roupa específica?","resposta":"Não é necessário. Trabalhamos com tecidos de referência neutros durante a análise — o ideal é vir sem maquiagem, se possível."},{"pergunta":"O atendimento é presencial ou online?","resposta":"Os dois formatos estão disponíveis. A versão presencial costuma ter mais precisão na percepção das cores, mas a online também é bem estruturada."}]'::jsonb,
  galeria = '["/images/leticia.png", "/images/hero.png", "/images/leticia-profile-matriculas.jpeg"]'::jsonb
WHERE slug = 'coloracao-pessoal';

UPDATE ofertas SET
  sobre = '["A Consultoria de Imagem Completa é uma jornada de autoconhecimento que vai muito além da roupa. Trabalhamos sua postura, seu estilo de vida e como você quer ser percebida no mundo.", "Ao final do processo, você sai com muito mais clareza sobre o que veste, por quê veste e como isso comunica quem você realmente é."]'::jsonb,
  faq = '[{"pergunta":"Quantos encontros tem o programa?","resposta":"O programa completo é feito em 4 encontros, com atividades entre uma sessão e outra."},{"pergunta":"Serve para qualquer fase da vida?","resposta":"Sim! É especialmente procurado por mulheres em transição de carreira, pós-parto ou que simplesmente querem se reconectar com sua imagem."},{"pergunta":"Tem acompanhamento depois?","resposta":"Sim, você recebe um material de apoio e pode tirar dúvidas por WhatsApp por 30 dias após o término."}]'::jsonb
WHERE slug = 'consultoria-imagem';

UPDATE ofertas SET
  sobre = '["No Personal Shopper, eu vou com você às compras (ou faço a curadoria online) pra garantir que cada peça escolhida realmente converse com o seu estilo e o seu guarda-roupa atual.", "O objetivo é acabar com as compras por impulso e te ajudar a investir de forma consciente, sempre dentro do seu orçamento."]'::jsonb,
  faq = '[{"pergunta":"O serviço inclui as roupas?","resposta":"Não, o valor do serviço é referente à consultoria — as peças escolhidas são de sua responsabilidade."},{"pergunta":"Vocês vão a quais lojas?","resposta":"Definimos juntas as melhores opções pro seu perfil e orçamento, podendo incluir desde lojas de shopping até brechós selecionados."},{"pergunta":"Posso fazer só online?","resposta":"Sim, montamos uma seleção de peças de lojas online com base no seu perfil e enviamos pra sua aprovação."}]'::jsonb
WHERE slug = 'personal-shopper';

UPDATE ofertas SET
  sobre = '["O visagismo estuda a harmonia entre o formato do seu rosto, corte de cabelo, óculos e acessórios — tudo pra realçar seus traços de forma natural e elegante.", "É um serviço rápido e certeiro, ideal pra quem está pensando em mudar o corte, a cor do cabelo ou simplesmente quer entender melhor o que combina com o próprio rosto."]'::jsonb,
  faq = '[{"pergunta":"O visagismo indica o corte de cabelo certo?","resposta":"Sim, é um dos focos principais — analisamos formato de rosto, textura e estilo de vida pra sugerir os melhores cortes."},{"pergunta":"Preciso cortar o cabelo depois?","resposta":"Não é obrigatório, mas a maioria das clientes sai da sessão com vontade de aplicar as recomendações."},{"pergunta":"O serviço é feito com o cabelo molhado ou seco?","resposta":"Seco, para uma leitura mais precisa do volume e do formato natural."}]'::jsonb
WHERE slug = 'visagismo';

UPDATE ofertas SET
  sobre = '["Essa categoria reúne os workshops avulsos que a Letícia ministra ao longo do ano, sempre com foco prático — pra você sair de cada encontro já aplicando o que aprendeu.", "São turmas pequenas, pensadas pra gerar troca real entre as participantes e não só uma aula expositiva."]'::jsonb,
  faq = '[{"pergunta":"Os workshops são presenciais?","resposta":"Depende da edição — alguns são presenciais e outros online, sempre divulgados com antecedência."},{"pergunta":"Preciso ter feito outro curso antes?","resposta":"Não, os workshops são abertos pra qualquer pessoa interessada no tema específico de cada turma."},{"pergunta":"Tem certificado?","resposta":"Sim, todas as participantes recebem certificado de participação."}]'::jsonb
WHERE slug = 'cursos-workshops';

UPDATE ofertas SET
  sobre = '["A Mentoria Individual é pra quem já entende um pouco sobre imagem pessoal, mas quer um acompanhamento mais próximo e contínuo pra sustentar a mudança a longo prazo.", "Ao longo dos encontros, a imagem vai sendo ajustada junto com os momentos da sua vida — trabalho, relacionamentos, autoestima — sempre no seu ritmo."]'::jsonb,
  faq = '[{"pergunta":"Qual a duração da mentoria?","resposta":"O formato padrão é de 3 meses, com encontros quinzenais, mas pode ser adaptado."},{"pergunta":"É feita presencialmente?","resposta":"Pode ser online ou presencial, dependendo da sua localização e preferência."},{"pergunta":"Como funciona entre os encontros?","resposta":"Você tem acesso direto por WhatsApp pra tirar dúvidas do dia a dia entre uma sessão e outra."}]'::jsonb
WHERE slug = 'mentoria-individual';

UPDATE ofertas SET
  sobre = '["O Método Cores & Identidade une, num só programa, a análise de coloração pessoal e a consultoria de imagem — pra você entender de uma vez só as cores e o estilo que combinam com você.", "É o programa mais completo pra quem quer resultado rápido e não quer fazer os dois processos separadamente."]'::jsonb,
  faq = '[{"pergunta":"Esse método substitui os outros dois serviços separados?","resposta":"Sim, ele já inclui a análise de cores e a consultoria de imagem completa, com um investimento mais em conta do que contratar os dois separadamente."},{"pergunta":"Tem turma fechada ou é individual?","resposta":"É um atendimento individual, no seu ritmo."},{"pergunta":"Posso parcelar?","resposta":"Sim, consulte as condições de pagamento diretamente pelo WhatsApp."}]'::jsonb,
  galeria = '["/images/hero.png", "/images/leticia.png", "/images/leticia-profile-matriculas.jpeg"]'::jsonb
WHERE slug = 'cores-identidade';

UPDATE ofertas SET
  sobre = '["Imagem Pessoal do Zero é o curso ideal pra quem nunca teve contato com consultoria de imagem e quer aprender os fundamentos do estilo pessoal no seu próprio ritmo.", "Todo o conteúdo é gravado e fica disponível pra assistir quantas vezes for preciso, sempre que precisar relembrar algum conceito."]'::jsonb,
  faq = '[{"pergunta":"O curso é ao vivo ou gravado?","resposta":"100% gravado, com acesso liberado assim que a compra é confirmada."},{"pergunta":"Por quanto tempo tenho acesso?","resposta":"O acesso é vitalício, incluindo atualizações futuras do curso."},{"pergunta":"Tem suporte pra tirar dúvidas?","resposta":"Sim, você entra num grupo exclusivo de alunas com suporte direto."}]'::jsonb
WHERE slug = 'imagem-pessoal-do-zero';

UPDATE ofertas SET
  sobre = '["O Workshop Armário Cápsula ensina você a montar um guarda-roupa funcional, com menos peças e muito mais combinações possíveis entre elas.", "É um encontro prático — as roupas são literalmente organizadas em looks durante o workshop, usando peças que você já tem em casa."]'::jsonb,
  faq = '[{"pergunta":"Preciso levar roupas?","resposta":"Sim, o ideal é trazer uma seleção das suas peças favoritas pro exercício prático."},{"pergunta":"Funciona pra qualquer estilo?","resposta":"Sim, o método se adapta ao seu estilo pessoal — não é imposto um padrão único."},{"pergunta":"É em grupo ou individual?","resposta":"É um workshop em grupo, com turmas pequenas para manter a qualidade do atendimento."}]'::jsonb
WHERE slug = 'armario-capsula';

UPDATE ofertas SET
  sobre = '["O Programa Imagem Completa é a experiência mais abrangente oferecida: coloração pessoal, consultoria de estilo, personal shopping e visagismo, tudo em um só pacote.", "É pensado pra quem quer uma transformação de verdade e prefere resolver tudo de uma vez, com acompanhamento próximo do início ao fim."]'::jsonb,
  faq = '[{"pergunta":"Quanto tempo dura o programa completo?","resposta":"Em média, 6 a 8 semanas, dependendo da agenda das sessões."},{"pergunta":"As compras estão incluídas?","resposta":"A curadoria e o acompanhamento nas compras estão inclusos; o valor das peças é à parte."},{"pergunta":"Posso fazer só parte do programa?","resposta":"O programa foi desenhado como uma experiência completa — fale com a Letícia pra avaliar o seu caso específico."}]'::jsonb
WHERE slug = 'programa-imagem-completa';

UPDATE ofertas SET
  sobre = '["Estilo em Casa é a forma mais acessível de acompanhar os ensinamentos da Letícia de onde você estiver, com uma metodologia 100% online e uma comunidade exclusiva de apoio.", "Ideal pra quem quer evoluir aos poucos, no seu próprio tempo, sem abrir mão de suporte e direcionamento."]'::jsonb,
  faq = '[{"pergunta":"Preciso de algum equipamento especial?","resposta":"Não, só um celular ou computador com acesso à internet."},{"pergunta":"Tem data pra começar?","resposta":"Não, o acesso é liberado assim que a inscrição é confirmada e você começa quando quiser."},{"pergunta":"A comunidade é ativa?","resposta":"Sim, é um espaço com trocas frequentes entre as participantes e conteúdos extras publicados periodicamente."}]'::jsonb
WHERE slug = 'estilo-em-casa';
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
| `ofertas` | Serviços e produtos/cursos (`/admin/ofertas`), exibidos em `/` e em `/servicos/[slug]` e `/produtos/[slug]` | — |

---

## Variáveis de ambiente (`.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...

BREVO_API_KEY=...
BREVO_LIST_ID=...             # Lista de inscrições do evento (Semana)
BREVO_MATRICULAS_LIST_ID=...  # Lista de leads da página de matrículas
```
