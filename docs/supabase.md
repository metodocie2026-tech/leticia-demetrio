# Integração com Supabase — Letícia Demétrio

## O que é o Supabase?

O Supabase é uma plataforma de banco de dados na nuvem. Em termos simples: é onde os dados do seu site ficam salvos com segurança. Toda vez que alguém preenche um formulário — seja no site principal ou na página do evento — as informações chegam automaticamente ao Supabase, organizadas numa tabela, como uma planilha online.

Você acessa tudo pelo painel em [supabase.com](https://supabase.com), sem precisar de nenhum conhecimento técnico.

---

## O que está integrado

### 1. Formulário de contato (site principal)
Cada pessoa que preencher o formulário de contato do site tem os dados salvos na tabela **`contacts`**:

| Campo | Descrição |
|---|---|
| `name` | Nome da pessoa |
| `email` | E-mail |
| `phone` | Telefone |
| `message` | Mensagem enviada |
| `created_at` | Data e hora do envio |

### 2. Inscrições no evento (página `/semana`)
Cada pessoa que se inscrever no evento tem os dados salvos na tabela **`inscricoes`**:

| Campo | Descrição |
|---|---|
| `nome` | Nome da pessoa |
| `email` | E-mail |
| `whatsapp` | Número de WhatsApp |
| `evento` | Nome do evento (preenchido automaticamente) |
| `created_at` | Data e hora da inscrição |

### 3. Aulas da semana (página `/aulas`)
Os vídeos de cada dia são gerenciados na tabela **`aulas`** — editável direto pelo painel administrativo, sem precisar de redeploy:

| Campo | Descrição |
|---|---|
| `id` | Número do dia (1 a 4, fixo) |
| `dia` | Label exibido ("Dia 1", "Dia 2"...) |
| `titulo` | Título da aula |
| `youtube_id` | ID do vídeo no YouTube (vazio = "Em breve") |
| `duracao` | Duração exibida ("36min", etc.) |
| `descricao` | Texto de descrição da aula |

**SQL para criar a tabela** (rodar no Supabase → SQL Editor):

```sql
create table aulas (
  id int primary key,
  dia text not null,
  titulo text not null default '',
  youtube_id text not null default '',
  duracao text not null default '',
  descricao text not null default ''
);

insert into aulas (id, dia, titulo, youtube_id, duracao, descricao) values
  (1, 'Dia 1', 'Por que você ainda não consegue se vestir bem todos os dias!', '_wc9AdSWkfs', '36min', 'Entenda o que o seu jeito de se vestir comunica sobre você e como alinhar sua aparência com quem você realmente é.'),
  (2, 'Dia 2', 'Como montar looks elegantes que realmente funcionam no seu dia a dia!', 'dYViSCujEus', '23min', 'Descubra quais tons realçam a sua pele e aprenda a usá-los com confiança no dia a dia.'),
  (3, 'Dia 3', '', '', '', ''),
  (4, 'Dia 4', '', '', '', '');
```

### 4. Configurações do painel
A tabela **`settings`** guarda as chaves de ativação dos módulos:

| Campo | Descrição |
|---|---|
| `evento_semana_ativo` | Liga/desliga a página `/semana` |
| `aulas_ativo` | Liga/desliga a página `/aulas` |

---

## Como acessar os dados

1. Acesse [supabase.com](https://supabase.com) e faça login
2. Abra o projeto **leticia-demetrio**
3. No menu lateral, clique em **Table Editor**
4. Escolha a tabela que quer visualizar (`contacts` ou `inscricoes`)
5. Todos os registros aparecem ali, do mais recente para o mais antigo

Você também pode exportar os dados como `.csv` (Excel) clicando em **Export** no canto superior direito da tabela — útil para importar em ferramentas de e-mail marketing como Brevo ou Mailchimp.

---

## Preços

O Supabase tem um **plano gratuito generoso** que cobre com folga o uso deste projeto:

### Plano Free (gratuito para sempre)
| Recurso | Limite |
|---|---|
| Projetos ativos | 2 projetos |
| Banco de dados | 500 MB de armazenamento |
| Requisições à API | Ilimitadas |
| Usuários ativos/mês | 50.000 |
| Bandwidth | 5 GB/mês |

Para uma landing page com formulário de contato e funil de evento, o plano gratuito é mais do que suficiente por muito tempo. Mesmo com centenas de inscrições por evento, o espaço utilizado é mínimo (cada linha ocupa menos de 1 KB).

### Quando o plano pago seria necessário?
Apenas se o projeto crescer muito além do esperado — por exemplo, dezenas de milhares de formulários preenchidos por mês, ou se for necessário manter mais de 2 projetos ativos. O plano pago começa em **US$ 25/mês (~R$ 130/mês)**, mas esse cenário está distante para o momento atual.

### Resumo de custo atual
> **R$ 0/mês** — o plano gratuito cobre todas as necessidades do projeto hoje.

---

## Segurança

- Os dados ficam armazenados em servidores na região **South America (São Paulo)**, dentro do território brasileiro
- A chave de acesso ao banco (`service_role key`) fica guardada no servidor, nunca exposta para visitantes do site
- O banco de dados tem **Row Level Security (RLS)** ativado — ninguém consegue ler ou modificar os dados diretamente sem autenticação

---

## Próximos passos possíveis

Com o banco de dados funcionando, as próximas integrações naturais seriam:

- **E-mail marketing** — exportar a lista de inscritos para uma ferramenta como [Brevo](https://brevo.com) (gratuito até 300 e-mails/dia) para enviar confirmações, lembretes e campanhas futuras
- **Painel administrativo** — uma página privada dentro do próprio site onde você visualiza os leads sem precisar abrir o Supabase
- **Notificação automática** — receber um e-mail ou mensagem no WhatsApp sempre que alguém se inscrever

---

*Documentação preparada em junho de 2026.*
