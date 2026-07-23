# Tutorial — Configurar Listmonk

Passo a passo pra colocar o Listmonk no ar, ligado ao Amazon SES, e pronto pra receber chamadas do site. Parte do plano em `docs/migracao-brevo-ses.md`. Pré-requisito: `docs/tutorial-amazon-ses.md` concluído até a Parte 5 (credenciais SMTP em mãos).

---

## Parte 1 — Deploy via EasyPanel

1. No painel do EasyPanel, vá em **Templates** (catálogo de apps prontos) e procure **Listmonk**.
2. Escolha deployar dentro do mesmo projeto do site (ou um projeto novo dedicado a serviços internos — `leticia-demetrio-services`, por exemplo).
3. O template já vem com o Postgres necessário embutido — confirme os campos padrão (usuário/senha do banco podem ficar como o template sugerir, são internos, o Next.js nunca acessa esse banco diretamente).
4. Configure o **domínio** de acesso ao painel do Listmonk — sugestão: um subdomínio interno tipo `listmonk.leticiademetrio.com.br`, com SSL automático (Let's Encrypt, igual ao resto do EasyPanel).
5. Deploy. Aguarde o container subir (poucos minutos).

> Os nomes exatos de botão podem variar um pouco conforme a versão do EasyPanel — o importante é: app com Postgres, domínio com SSL, porta exposta pro painel web do Listmonk (padrão 9000).

---

## Parte 2 — Primeiro acesso

1. Acesse o domínio configurado (`https://listmonk.leticiademetrio.com.br`).
2. Na primeira vez, o Listmonk pede pra criar o **usuário super admin** — use um e-mail e senha fortes, esse é o acesso administrativo completo.

---

## Parte 3 — Configurar o SMTP (conectar no SES)

1. No painel do Listmonk, vá em **Settings** → **SMTP**.
2. **Add SMTP server**:
   - **Host**: o SMTP endpoint anotado no tutorial do SES (ex: `email-smtp.us-east-1.amazonaws.com`)
   - **Port**: `587`
   - **Auth protocol**: `LOGIN`
   - **Username**: o SMTP Username gerado no SES
   - **Password**: o SMTP Password gerado no SES
   - **TLS**: `STARTTLS`
3. Salve e use o botão de **teste de conexão**, se disponível, pra confirmar que autenticou certo.

---

## Parte 4 — Criar as listas

1. **Lists** → **New**.
2. Criar:
   - `Inscrições — Semana Elegância` (equivalente ao `BREVO_LIST_ID` de hoje)
   - `Matrículas` (equivalente ao `BREVO_MATRICULAS_LIST_ID`, sem automação — só armazenamento de contato)
3. Anote o **ID numérico** de cada lista (aparece na URL ao abrir a lista, ex: `/admin/lists/3`) — vai pras variáveis de ambiente do Next.js (`LISTMONK_LIST_ID`, `LISTMONK_MATRICULAS_LIST_ID`).

---

## Parte 5 — Criar os templates

Duas categorias diferentes (ver `docs/migracao-brevo-ses.md` §3.1):

### Templates transacionais (Categoria A — e-mail 1 e e-mail 2)

1. **Campaigns** → **Templates** → **New**.
2. Tipo: **Transactional**.
3. Cole o HTML de `docs/emails/1-email-obrigado-pesquisa.html` (recorte só entre os comentários `<!-- EMAIL START -->` e `<!-- EMAIL END -->`).
4. Troque **todas** as merge tags do Brevo pela sintaxe do Listmonk (ver tabela de conversão abaixo) — deixar qualquer `{{ contact.* }}` sem trocar quebra a compilação do template (`function "contact" not defined"`).
5. Salve, anote o **ID do template** — vai em `EMAIL_SEQUENCES` no código (`src/lib/email-sequences.ts`).
6. Repita pro `2-email-grupo-whatsapp.html`.

### Templates de campanha (Categoria B — e-mail 3, 4, 5 e todos os futuros)

**Diferente do transacional**: um template de campanha no Listmonk não é o e-mail inteiro — é um **wrapper reutilizável** (header + footer + a marca da Letícia), com um marcador `{{ template "content" . }}` no meio, onde o Listmonk injeta o conteúdo *daquela campanha específica*. Se você colar o HTML inteiro de cada e-mail direto no template, o Listmonk recusa com `the placeholder {{ template "content" . }} should appear exactly once`.

Isso na prática é bom pra você: o header/footer não precisa ser recriado 25+ vezes, só uma.

**Passo 1 — criar o template wrapper, uma única vez:**

1. **Campaigns** → **Templates** → **New**.
2. Tipo: **Campaign**.
3. Cole o conteúdo de `docs/emails/listmonk/template-campanha.html` (já pronto, com `{{ template "content" . }}` no lugar certo e o link de cancelamento no rodapé).
4. Salve como algo tipo "Template Padrão — Letícia Demétrio". **Esse template é reaproveitado por todas as campanhas futuras** — não crie um novo a cada e-mail.

**Passo 2 — pra cada e-mail de data fixa (3, 4, 5, e qualquer um dos 25+ futuros):**

1. **Campaigns** → **New**.
2. Escolha o template wrapper criado no Passo 1.
3. No editor de conteúdo da campanha (não é mais em "Templates"), cole **só o miolo** do e-mail — ex: `docs/emails/listmonk/3-faltam-7-dias.html`, que já é só o corpo (sem header/footer, esses já vêm do template wrapper).
4. Trocar as merge tags do corpo, se ainda não estiverem convertidas (tabela abaixo).
5. Escolher a lista e agendar (Parte 7).

> **Esse é o passo que se repete pra cada um dos 25+ e-mails futuros do funil**: extrair o miolo do HTML novo, colar como conteúdo de uma campanha nova usando o mesmo template wrapper. Nenhuma outra parte do sistema muda.

### Tabela de conversão de merge tags (Brevo → Listmonk)

Todas as ocorrências que existem hoje nos 5 templates de `docs/emails/`:

| Brevo | Transacional (e-mail 1, 2) | Campanha (e-mail 3, 4, 5 e futuros) |
|---|---|---|
| `{{ contact.NAME }}` | `{{ .Subscriber.Name }}` | `{{ .Subscriber.Name }}` |
| `{{ contact.SURVEY_URL }}` | `{{ .Tx.Data.survey_url }}` | *(não usado hoje nos templates de campanha)* |
| `{{ contact.WHATSAPP_GROUP_URL }}` | `{{ .Tx.Data.whatsapp_group_url }}` | `{{ .Subscriber.Attribs.whatsapp_group_url }}` |
| `{{ unsubscribe }}` | `{{ .Subscriber.Attribs.unsubscribe_url }}` | `{{ .Subscriber.Attribs.unsubscribe_url }}` |

Por quê a diferença entre transacional e campanha (exceto na última linha): `.Tx.Data.*` só existe quando o e-mail é disparado via `POST /api/tx` (é o payload `data` que o código manda naquele momento — ver `src/lib/listmonk.ts`). Campanhas não passam por `/api/tx`, então precisam pegar o valor de algum lugar já salvo no subscriber — por isso `.Subscriber.Attribs.*`, que é preenchido no momento da inscrição por `addSubscriberToListmonk()` (mesma limitação que já existe hoje no Brevo: se o link do grupo do WhatsApp mudar depois que alguém já se inscreveu, quem já tem o attrib salvo não pega o valor novo automaticamente).

> **Sobre o cancelamento de inscrição — não use `{{ UnsubscribeURL }}`.** O Listmonk só registra essa função pra templates de **campanha** (confirmado no código-fonte dele) — em template transacional ela quebra a compilação com `function "UnsubscribeURL" not defined"`, e mesmo funcionando, a página nativa dele exige um UUID de campanha que um envio transacional não tem. Por isso construímos nosso próprio link de cancelamento: `{{ .Subscriber.Attribs.unsubscribe_url }}` — preenchido automaticamente pra todo subscriber em `addSubscriberToListmonk()` (`src/lib/listmonk.ts`), aponta pra `/cancelar-inscricao` no próprio site (`src/app/cancelar-inscricao/page.tsx`), que valida um token assinado (`UNSUBSCRIBE_SECRET`) e chama `PUT /api/subscribers/{id}/blocklist`. Funciona igual em templates transacionais e de campanha — use essa mesma tag em qualquer e-mail futuro.

---

## Parte 6 — Gerar a API key pro Next.js

O Listmonk usa RBAC: não dá pra marcar permissões direto num usuário — primeiro cria-se uma **User role** com as permissões, depois um usuário (nesse caso, um **API user**) que usa essa role. Enquanto nenhuma role própria existir, a tela de criar usuário só vai oferecer **Super Admin**.

**Passo 1 — criar a role:**

1. **Admin** → **Users** → **User roles** → **New**.
2. Nome: algo tipo `API — Next.js`.
3. Marcar só o necessário pro que o código faz (`src/lib/listmonk.ts` só chama `/api/subscribers*` e `/api/tx` — nunca mexe em campanha, lista ou template):
   - `subscribers:manage` — criar/atualizar/blocklist de subscriber
   - `subscribers:manage_lists` — associar o subscriber a uma lista (sem isso, criar subscriber já com `lists: [id]` dá `"Permission denied: lists"` — testado e confirmado)
   - `subscribers:get` — buscar subscriber por e-mail
   - `tx:send` — disparar transacional
4. Salvar. **Não** precisa de nada em Lists (gerenciar as listas em si), Campaigns ou Templates — isso continua sendo feito por você, logado normalmente, não pela API key.

**Passo 2 — criar o API user usando essa role:**

1. **Admin** → **Users** → **New**.
2. Tipo: **API user** (não é um usuário de login normal).
3. Role: escolher a `API — Next.js` criada no Passo 1 (não Super Admin).
4. Ao salvar, o **token** aparece **uma única vez** — copie e guarde. Vai em `LISTMONK_API_KEY` no `.env`.


---

## Parte 7 — Como agendar uma campanha (e-mail de data fixa)

Pra cada um dos e-mails de data fixa (hoje: 3, 4, 5; no futuro: qualquer um dos 25+ restantes):

1. **Campaigns** → **New**.
2. Escolha o template criado na Parte 5 (Categoria B).
3. Escolha a lista de destino (**Inscrições — Semana Elegância**, ou outra quando existir).
4. Em **Schedule**, escolha data e hora exatas do disparo.
5. Salve como **Scheduled** (não **Draft** — draft não dispara sozinho).
6. Confirme na lista de campanhas que o status ficou **Scheduled**, não **Paused**.

---

## Parte 8 — Testar antes de confiar

Enquanto o SES ainda está em sandbox mode (ver `docs/tutorial-amazon-ses.md` Parte 4), só é possível entregar pra endereços verificados. Use isso a seu favor:

1. Crie um subscriber de teste no Listmonk com o seu e-mail verificado no SES.
2. Dispare manualmente (botão de teste de campanha, ou chame a API `/api/tx` direto com esse e-mail).
3. Confirme que chegou na caixa de entrada (não no spam) e que a formatação/merge tag saiu correta.
4. Só depois de confirmar isso, seguir pro gate de decisão de produção descrito em `docs/migracao-brevo-ses.md` §6.3.

---

## Resumo do que fica anotado pra usar depois

- [ ] URL do painel do Listmonk
- [ ] ID da lista de inscrições
- [ ] ID da lista de matrículas
- [ ] IDs dos templates transacionais (e-mail 1 e 2)
- [ ] API key (`LISTMONK_API_KEY`)

---

*Tutorial preparado em julho de 2026, como parte da migração descrita em `docs/migracao-brevo-ses.md`.*
