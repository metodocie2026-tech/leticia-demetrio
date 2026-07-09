# Deploy com Coolify no VPS Hostinger

## O que é o Coolify?

Coolify é uma plataforma de deploy gratuita e open-source que você instala no próprio VPS. Depois de configurado, funciona como o Vercel: você faz `git push` no GitHub e o site atualiza automaticamente em 2–3 minutos — sem precisar acessar o servidor toda vez.

Ideal para este projeto pela frequência de atualizações (eventos, replays, conteúdo).

---

## Pré-requisitos

Antes de começar, você precisa ter:

- [ ] Acesso SSH ao VPS da Hostinger (IP + usuário + senha ou chave SSH)
- [ ] O projeto em um repositório no **GitHub** (público ou privado)
- [ ] Um domínio apontando para o IP do VPS (configurado no painel da Hostinger/registro de domínio)
- [ ] VPS com pelo menos **2 vCPUs e 2 GB de RAM** — plano KVM 2 da Hostinger ou superior

> **Verificar o IP do VPS:** painel da Hostinger → VPS → detalhes do servidor.

---

## Parte 1 — Instalar o Coolify no VPS

### 1.1 Conectar via SSH

No terminal do seu computador:

```bash
ssh root@SEU_IP_AQUI
```

Substitua `SEU_IP_AQUI` pelo IP do VPS. Se for a primeira vez, aceite a chave digitando `yes`.

### 1.2 Instalar o Coolify

Cole o comando abaixo e aguarde (instala Docker + Coolify automaticamente, leva ~5 minutos):

```bash
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

Quando terminar, você verá uma mensagem indicando que o Coolify está rodando.

### 1.3 Abrir o painel do Coolify

No navegador, acesse:

```
http://SEU_IP:8000
```

Na primeira vez, ele pede para criar uma conta de administrador. Use um e-mail e senha que você não vai esquecer — é o acesso ao painel de deploy.

---

## Parte 2 — Conectar ao GitHub

### 2.1 Adicionar source

No painel do Coolify:
1. Menu lateral → **Sources**
2. Clique em **Add a new source**
3. Escolha **GitHub App** (recomendado — não expira)
4. Siga as instruções para instalar o Coolify GitHub App na sua conta do GitHub
5. Autorize o acesso ao repositório do projeto

---

## Parte 3 — Criar o projeto no Coolify

### 3.1 Novo projeto

1. Menu lateral → **Projects** → **+ New Project**
2. Dê um nome: `leticia-demetrio`

### 3.2 Nova aplicação

Dentro do projeto criado:
1. Clique em **+ New Resource** → **Application**
2. Escolha **GitHub** como source
3. Selecione o repositório do projeto
4. Branch: `main`

### 3.3 Configurações de build

O Coolify detecta Next.js automaticamente via **Nixpacks**. Confirme ou preencha:

| Campo | Valor |
|---|---|
| Build Command | `npm run build` |
| Start Command | `npm start` |
| Port | `3000` |

### 3.4 Variáveis de ambiente

Ainda nas configurações da aplicação, vá em **Environment Variables** e adicione as três variáveis — as mesmas do `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL        = https://xxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY       = eyJ...
ADMIN_PASSWORD                  = sua_senha_do_painel
```

> ⚠️ O arquivo `.env.local` **não vai para o GitHub** (está no `.gitignore`). As variáveis ficam guardadas com segurança no Coolify.

---

## Parte 4 — Domínio e SSL

### 4.1 Configurar o domínio

Nas configurações da aplicação:
1. Vá em **Domains**
2. Adicione o domínio: `https://www.leticiademetrio.com.br` (ou o domínio dela)
3. Ative **Generate SSL Certificate** — o Coolify instala o Let's Encrypt automaticamente

### 4.2 Verificar DNS

Certifique-se de que no painel do domínio (Registro.br, Hostinger Domains, etc.) existe um registro **A** apontando para o IP do VPS:

```
Tipo: A
Nome: @  (ou www)
Valor: SEU_IP_DO_VPS
TTL: 3600
```

> A propagação do DNS pode levar até 24h, mas geralmente é bem mais rápida (15–30 minutos).

---

## Parte 5 — Primeiro deploy

Com tudo configurado:
1. Na página da aplicação no Coolify, clique em **Deploy**
2. Acompanhe os logs em tempo real — você verá o build do Next.js
3. Quando terminar, o site estará no ar no domínio configurado

---

## Parte 6 — Deploys automáticos (o dia a dia)

Depois da configuração inicial, atualizar o site é simples:

```bash
git add .
git commit -m "atualização do evento / novo replay / etc"
git push origin main
```

O Coolify recebe o webhook do GitHub e inicia o deploy automaticamente. Em ~2–3 minutos o site está atualizado.

> **Para ativar o webhook automático:** nas configurações da aplicação no Coolify, certifique-se de que **"Automatic Deployment"** está ativado.

---

## Resumo do fluxo de atualização

```
Edita constants (replay, evento, conteúdo)
        ↓
   git push origin main
        ↓
  Coolify recebe o webhook
        ↓
  Build automático (~2 min)
        ↓
  Site atualizado no ar ✓
```

---

## Dicas úteis

**Ver logs do app em produção**
No Coolify → sua aplicação → aba **Logs**. Útil para debugar se algo der errado.

**Rollback para versão anterior**
Coolify → sua aplicação → **Deployments** → escolha um deploy anterior → **Redeploy**. Não precisa mexer no código.

**Atualizar variáveis de ambiente**
Coolify → sua aplicação → **Environment Variables** → edite → clique em **Redeploy**. O site recarrega com as novas variáveis.

**Painel admin em produção**
Acessível em `https://seudominio.com.br/admin` — protegido pela senha definida em `ADMIN_PASSWORD`.

---

## Custo total da infraestrutura

| Serviço | Custo |
|---|---|
| VPS Hostinger | já pago (2 anos) |
| Coolify | gratuito |
| Supabase | gratuito (plano free) |
| SSL (Let's Encrypt) | gratuito |
| **Total mensal** | **R$ 0** |

---

*Documentação preparada em junho de 2026.*
