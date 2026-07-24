# Tutorial — Configurar Amazon SES

Passo a passo pra sair do zero até ter o SES pronto pra enviar e-mail em produção. Parte do plano em `docs/migracao-brevo-ses.md`.

> **Faça as Partes 1–4 ainda hoje.** A saída do sandbox mode (Parte 4) é o item que mais demora (até 3 dias úteis pra aprovação) e é o que trava todo o resto do cronograma — quanto antes for solicitado, antes o cutover pode acontecer.

---

## Pré-requisitos

- [ ] Acesso a uma conta AWS (criar uma nova se não tiver — cartão de crédito é exigido no cadastro, mas o custo de envio pro nosso volume é centavos)
- [ ] Acesso ao painel de DNS do domínio `leticiademetrio.com.br` (Hostinger Domains, Registro.br, ou onde estiver gerenciado)
- [ ] Decidido: vamos usar um **subdomínio dedicado** só pra e-mail, não a raiz do domínio — sugestão: `mail.leticiademetrio.com.br` (ajuste o nome se preferir outro, ex: `email.` ou `news.`)

---

## Parte 1 — Acessar o console do SES

1. Acesse [console.aws.amazon.com/ses](https://console.aws.amazon.com/ses/)
2. No canto superior direito, escolha a **região** — recomendado `us-east-1` (N. Virginia) por ser a mais barata/estável pro SES, a menos que exista uma exigência de dados no Brasil (`sa-east-1`, São Paulo, também é opção válida se preferir manter os dados na região).
3. Guarde qual região foi escolhida — vai ser usada de novo na configuração do SMTP no Listmonk.

---

## Parte 2 — Criar a identidade de domínio (subdomínio de envio)

1. No menu lateral, em **Configuration**, clique em **Identities**.
2. **Create identity**.
3. Tipo: **Domain**.
4. Domain: `mail.leticiademetrio.com.br` (ou o subdomínio escolhido).
5. Em **Advanced DKIM settings** (seção expansível, na mesma tela), deixe **Easy DKIM** selecionado, tamanho da chave **RSA 2048-bit** (padrão).
6. **"Use a custom MAIL FROM domain"** — checkbox separado, **deixar desmarcado**. Isso é opcional: troca o domínio técnico de bounce/envelope-from do SES (por padrão um subdomínio de `amazonses.com`) pelo seu próprio subdomínio, evitando o "via amazonses.com" que aparece no Gmail e alcançando alinhamento SPF mais estrito com DMARC. É só cosmético/polimento de entregabilidade, não afeta se o e-mail funciona — e exige mais 2 registros DNS (MX + TXT) e mais uma espera de propagação. Dá pra ativar depois, editando a identidade, sem precisar reverificar o domínio. Não vale gastar tempo nisso agora com o prazo apertado.
7. Crie a identidade. Isso **não mostra os registros DNS ainda** — eles aparecem na tela seguinte.

### Publicar os registros DNS

Na página da identidade recém-criada, aba **Authentication** → expandir **Publish DNS records**:

No painel de DNS do domínio, adicione:

1. **DKIM (3 registros CNAME)** — copiados da tela de identidade recém-criada (nome e valor exatos, o SES gera automaticamente).
2. **SPF (1 registro TXT)** no próprio subdomínio:
   ```
   Nome: mail.leticiademetrio.com.br
   Tipo: TXT
   Valor: v=spf1 include:amazonses.com ~all
   ```
3. **DMARC (1 registro TXT)**, recomendado desde o início (protege a reputação do domínio):
   ```
   Nome: _dmarc.mail.leticiademetrio.com.br
   Tipo: TXT
   Valor: v=DMARC1; p=none; rua=mailto:SEU_EMAIL_AQUI
   ```
   (`p=none` só monitora, sem bloquear nada — dá pra apertar pra `p=quarantine` mais adiante, depois de confirmar que está tudo passando certinho.)

> A propagação pode levar até 72h segundo a AWS, mas normalmente é bem mais rápida (minutos a poucas horas). O status da identidade muda pra **Verified** no console assim que detectar os registros.

### Se o DNS for gerenciado no Cloudflare

Dashboard da Cloudflare → domínio → **DNS** → **Records** → **Add record**. Duas pegadinhas que quebram a verificação silenciosamente se passarem despercebidas:

1. **O campo "Name" é relativo à zona, não o domínio completo.** A Cloudflare já acrescenta `leticiademetrio.com.br` sozinha. Se colar o nome completo que a AWS mostra, o registro fica duplicado (`....leticiademetrio.com.br.leticiademetrio.com.br`) e nunca verifica.

   | Registro | Nome que a AWS mostra | O que digitar no "Name" da Cloudflare |
   |---|---|---|
   | DKIM (3x CNAME) | `abc123._domainkey.mail.leticiademetrio.com.br` (exemplo) | `abc123._domainkey.mail` |
   | SPF (TXT) | `mail.leticiademetrio.com.br` | `mail` |
   | DMARC (TXT) | `_dmarc.mail.leticiademetrio.com.br` | `_dmarc.mail` |

2. **Proxy status precisa ficar "DNS only" (nuvem cinza) nos 3 CNAMEs do DKIM** — nunca "Proxied" (nuvem laranja). Se ficar proxied, a Cloudflare intercepta o registro em vez de apontar direto pro alvo da AWS, e a verificação nunca completa. Os registros TXT (SPF, DMARC) não têm essa opção — só os CNAME.

TTL pode ficar em **Auto** em todos. A propagação na Cloudflare costuma ser rápida (segundos a poucos minutos), bem mais rápida que o pior caso de 72h que a AWS menciona.

---

## Parte 3 — Verificar um e-mail pessoal (pra testar ainda em sandbox)

Enquanto o sandbox mode não sai, o SES só entrega pra endereços verificados manualmente. Verifique o seu e-mail (ou o da Letícia) pra poder testar o pipeline de ponta a ponta sem esperar a aprovação:

1. **Identities** → **Create identity** → tipo **Email address**.
2. Digite o e-mail (ex: `legnafernandes@gmail.com`).
3. O SES manda um link de confirmação — clique nele.

---

## Parte 4 — Solicitar saída do sandbox mode (production access)

**Fazer isso hoje, é o item mais demorado do cronograma.**

1. No console do SES, vá em **Account dashboard** (menu lateral).
2. No topo, tem um aviso de que a conta está em sandbox — clique em **View Get set up page** (ou vá direto em **Account dashboard** → **Request production access**).
3. Preencha o formulário:
   - **Mail type**: escolha **Transactional** se a maior parte for e-mail 1-pra-1 disparado por ação do lead, ou **Marketing** se for majoritariamente campanha em massa. No nosso caso é um funil misto (transacional + campanha) — escolha o que representar a maioria do volume esperado; **Transactional** é a opção mais segura de aprovar rápido.
   - **Website URL**: `https://www.leticiademetrio.com.br` (ou domínio real do site).
   - **Use case description**: descreva em poucas linhas — ex: "Envio de e-mails transacionais e de campanha pra leads que se inscrevem voluntariamente em formulários no site (dupla confirmação de interesse via formulário próprio), relacionados a um funil de eventos gratuitos de consultoria de imagem. Volume esperado: até ~1.500 contatos, poucos milhares de envios por mês."
   - **Additional contacts**: seu e-mail, pra receber updates do caso.
   - **Preferred contact language**: English ou Portuguese, tanto faz.
4. Envie. Isso abre um **support case** — a AWS Trust & Safety team normalmente responde dentro de 24h, aprovação completa em até 1–3 dias úteis.
5. Acompanhe a resposta em **Support Center** (canto superior direito do console AWS) → **Your support cases**.

> Enquanto não aprovar: limite de 200 e-mails/dia, só pra endereços verificados (Parte 3). Suficiente pra testar, não pra produção.

---

## Parte 5 — Gerar credenciais SMTP

1. No console do SES, vá em **SMTP settings** (menu lateral, em **Configuration**).
2. Anote o **SMTP endpoint** (algo como `email-smtp.us-east-1.amazonaws.com`) e a **porta** (`587`, com STARTTLS).
3. **Create SMTP credentials**.
4. Dê um nome ao usuário IAM gerado (ex: `listmonk-smtp`).
5. **Create** — a AWS mostra o **SMTP Username** e **SMTP Password** *só uma vez*. Copie e guarde num lugar seguro (essas credenciais vão direto na configuração do Listmonk, não são as mesmas access keys da conta AWS).

---

## Parte 6 — SNS pra bounce/complaint (fazer depois do deploy do Listmonk)

Esse passo depende de já existir uma URL pública do Listmonk pra receber o webhook — então fica pra depois da Parte de deploy em `docs/tutorial-listmonk.md`. Deixado documentado aqui pra não esquecer:

1. Criar um **SNS Topic** (ex: `ses-bounces-complaints`).
2. Na identidade de domínio do SES (Parte 2), aba **Notifications**, configurar **Bounce** e **Complaint** apontando pro tópico SNS criado.
3. Criar uma **subscription** HTTPS no tópico, apontando pra URL de webhook do Listmonk (`https://SEU_LISTMONK/webhooks/service/ses` ou equivalente — confirmar path exato na doc do Listmonk).
4. Confirmar a subscription (SNS manda um handshake que o Listmonk deve confirmar automaticamente).

---

## Resumo do que fica anotado pra usar depois

Ao final deste tutorial, você deve ter guardado:

- [ ] Região AWS escolhida (ex: `us-east-1`)
- [ ] Nome do subdomínio verificado (ex: `mail.leticiademetrio.com.br`)
- [ ] SMTP endpoint + porta
- [ ] SMTP Username + SMTP Password
- [ ] Confirmação de que o support case de saída do sandbox foi aberto (e depois, quando aprovado)

Esses dados vão direto na configuração do Listmonk (`docs/tutorial-listmonk.md`).

---

## Custo

- Verificação de domínio, DKIM, SPF, DMARC: gratuito.
- Sandbox / production access: gratuito, é só aprovação.
- Envio: US$0,10 por 1.000 e-mails. Pro nosso volume (centenas de contatos, poucos milhares de envios/mês), o custo fica bem abaixo de US$1–2/mês.

---

*Tutorial preparado em julho de 2026, como parte da migração descrita em `docs/migracao-brevo-ses.md`.*
