# Custos de Produção — Letícia Demétrio Landing Page

Documento para alinhar com a Letícia todos os gastos necessários para colocar o projeto no ar e mantê-lo rodando.

---

## Resumo Executivo

| Item | Situação | Custo Mensal |
|------|----------|--------------|
| VPS Hostinger | Já pago (2 anos) | R$0 |
| Domínio | Já pago | R$0 |
| Coolify (deploy) | Gratuito, roda no VPS | R$0 |
| Supabase (banco de dados) | Gratuito | R$0 |
| SSL (HTTPS) | Gratuito via Let's Encrypt | R$0 |
| Google Analytics + GTM | Gratuito | R$0 |
| **Total mínimo** | | **R$0/mês** |

---

## O que já está pago

### VPS Hostinger
- Servidor dedicado para rodar a aplicação
- Já contratado por 2 anos — **nenhum custo adicional**
- O Coolify (sistema de deploy) roda gratuitamente dentro desse servidor
- Serve como host do site, banco de dados, e painel administrativo

### Domínio
- Já adquirido — **nenhum custo adicional**
- Precisará apenas apontar os DNS do domínio para o IP do servidor Hostinger (configuração única, gratuita)
- O SSL (cadeado verde HTTPS) será gerado automaticamente pelo Coolify via Let's Encrypt, sem custo

---

## O que é gratuito

### Supabase (banco de dados de leads)
- Armazena formulários de contato, inscrições de eventos e configurações do painel
- **Free tier**: 500MB de armazenamento
- Na prática: comporta aproximadamente **1 milhão de leads** sem custo algum
- Quando (e se) atingir o limite: plano Pro custa **US$25/mês** (≈ R$130/mês)
- Para uma consultoria de imagem, esse limite provavelmente nunca será alcançado

### Coolify
- Plataforma de deploy self-hosted — roda no próprio servidor Hostinger
- Gerencia deploys automáticos a cada push no GitHub
- Monitoramento básico de CPU, memória e uptime
- **100% gratuito**

### Google Analytics 4 + Google Tag Manager
- Análise de visitantes, origem do tráfego, conversões
- Configuração de eventos (clique no WhatsApp, envio de formulário, etc.)
- **100% gratuito**

---

## Decisões pendentes (custo zero possível)

### 1. E-mail profissional
Se a Letícia quiser um e-mail do tipo `leticia@seudominio.com.br`:

| Opção | Custo | Observação |
|-------|-------|------------|
| **Zoho Mail** | R$0 | 1 conta gratuita, suficiente para uso pessoal |
| Hostinger Email | Geralmente incluído no plano VPS | Verificar se o plano atual já inclui |
| Google Workspace | ≈ R$30/usuário/mês | Desnecessário para o escopo atual |

**Recomendação**: Verificar se o plano Hostinger já inclui e-mail. Se não, usar Zoho Mail gratuito.

### 2. Envio de e-mails transacionais
Para notificar a Letícia quando alguém preenche o formulário de contato:

| Opção | Custo | Limite gratuito |
|-------|-------|-----------------|
| **Brevo** (recomendado) | R$0 | 300 e-mails/dia, 9.000/mês |
| Resend | R$0 | 3.000 e-mails/mês |

**Recomendação**: Brevo na faixa gratuita cobre 100% das necessidades atuais e ainda permite disparos de newsletter futuramente.

### 3. Envio de newsletter para leads
Se a Letícia quiser enviar e-mails de marketing para a lista de inscritos:

| Volume da lista | Plataforma | Custo |
|-----------------|------------|-------|
| Até 9.000 contatos | Brevo free | R$0 |
| Acima disso | Brevo pago | ≈ R$80/mês |

**Observação**: Não é necessário para o lançamento. Pode ser avaliado conforme a lista cresce.

---

## Monitoramento de uptime (opcional)

Para receber alertas caso o site fique fora do ar:

- **UptimeRobot** — gratuito para 5 monitores, verifica a cada 5 minutos
- Envia alerta por e-mail se o site cair
- Configuração leva 5 minutos

---

## Backup do banco de dados

| Opção | Custo | Retenção |
|-------|-------|----------|
| Supabase free tier | R$0 | 1 dia |
| Supabase Pro | ≈ R$130/mês | 7 dias |
| Backup manual via Coolify | R$0 | Manual |

**Recomendação**: Para o estágio atual, o backup automático de 1 dia do Supabase é suficiente. Backup manual pode ser feito mensalmente sem custo.

---

## Projeção de custos ao longo do tempo

```
Agora (lançamento)
└── R$0/mês — tudo no free tier, VPS e domínio já pagos

Em 1-2 anos (se a lista crescer muito)
└── R$0–R$80/mês — apenas se precisar de e-mail marketing acima de 9.000 contatos

Em vários anos (se atingir ~1 milhão de leads)
└── R$0–R$130/mês — upgrade do Supabase (muito improvável para consultoria)
```

---

## Checklist para o lançamento

- [ ] Apontar DNS do domínio para o IP do VPS Hostinger
- [ ] Configurar variáveis de ambiente no Coolify (ver `docs/deploy-coolify.md`)
- [ ] Criar tabelas no Supabase (ver `docs/supabase.md`)
- [ ] Configurar Google Tag Manager (ver `docs/gtm-integracao.md`) — aguardando ID do GTM
- [ ] Atualizar número de WhatsApp real em `src/constants/navigation.ts`
- [ ] Atualizar URL do Instagram real em `src/constants/navigation.ts`
- [ ] Atualizar dados do evento em `src/constants/evento.ts` (datas, links, etc.)
- [ ] Testar formulário de contato em produção
- [ ] Testar painel administrativo em produção
- [ ] Configurar UptimeRobot para monitorar o site (opcional, gratuito)
