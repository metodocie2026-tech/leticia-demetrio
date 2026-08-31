# Tutorial — Disparar de hora em hora a rota `/api/cron/email-sequences`

Passo a passo pra chamar `/api/cron/email-sequences` periodicamente em produção, responsável por disparar o e-mail 2 (24h após a inscrição) e qualquer outro e-mail futuro por gatilho relativo (Categoria A — ativa desde 31/08/2026, ver `docs/migracao-brevo-ses.md` §0.2 e §3.2).

**Correção em relação à versão anterior deste doc**: ela citava uma tela "+ New Service → Cron Job" no EasyPanel e mencionava Coolify — nenhum dos dois está certo. Este projeto nunca usou Coolify (VPS roda só EasyPanel — ver `docs/deploy-coolify.md`, que é um doc antigo e desatualizado). E, conferindo agora a documentação oficial do EasyPanel (`easypanel.io/docs/guides/cron-job`), ele **não tem** um tipo de recurso "Cron Job" nativo com formulário próprio — o guia oficial deles descreve só duas formas de rodar algo periodicamente, as duas abaixo.

Pré-requisito: a rota já implantada em produção (`src/app/api/cron/email-sequences/route.ts`) e a variável `CRON_SECRET` configurada no app principal (Settings do app no EasyPanel → Environment).

---

## Opção 1 (recomendada) — serviço externo gratuito, sem infra extra

É a própria alternativa que o guia oficial do EasyPanel recomenda pra quem não quer mexer em Dockerfile. Usa [cron-job.org](https://cron-job.org) (gratuito, sem cartão).

1. Crie uma conta em https://console.cron-job.org/signup.
2. No console, crie um novo cron job (botão de criar, geralmente "CREATE CRONJOB").
3. **Title**: `email-sequences` (ou qualquer nome).
4. **URL/Address**: `https://www.leticiademetrio.com.br/api/cron/email-sequences`.
5. **Schedule**: a cada hora — normalmente há um preset "every hour", ou configure manualmente igual ao cron `0 * * * *` ([crontab.guru](https://crontab.guru) se quiser conferir a expressão).
6. Nas configurações **avançadas** desse cron job (procure por algo como "Advanced" ou "Request settings" na tela de edição):
   - **Request method**: `POST`.
   - **Custom headers**: adicione um header `Authorization` com valor `Bearer SEU_CRON_SECRET` (o mesmo valor configurado no EasyPanel).
7. Salve.

cron-job.org confirma suporte a método `POST` e headers customizados (usado exatamente pra esse tipo de autenticação via `Authorization: Bearer`) — é o mecanismo certo pra essa rota, que rejeita qualquer chamada sem esse header (`401 Unauthorized`).

O único trade-off é depender de um serviço terceiro pro agendamento — se isso for um problema, use a Opção 2.

---

## Opção 2 (alternativa) — App dedicado no EasyPanel, com Dockerfile próprio

Se preferir manter tudo dentro do próprio VPS: crie um **segundo App** no EasyPanel (separado do app principal do site, que não tem Dockerfile — ele roda via build automático do Next.js). Esse app novo não serve pra nada além de rodar `crond` chamando o `curl` de hora em hora.

1. No EasyPanel, dentro do seu projeto, crie um **App** novo (ex: `email-cron`), com origem "From Source" apontando pra um repositório/pasta com o Dockerfile abaixo — ou "From a Dockerfile" direto, se o EasyPanel oferecer essa opção pro seu plano.
2. Dockerfile mínimo:
   ```Dockerfile
   FROM alpine:latest
   RUN apk add --no-cache curl

   # Roda o curl a cada hora cheia. O CRON_SECRET é injetado como env var do
   # container (configurada no EasyPanel), não hardcoded aqui.
   RUN echo "0 * * * * curl -sf -X POST -H \"Authorization: Bearer \$CRON_SECRET\" https://www.leticiademetrio.com.br/api/cron/email-sequences >> /var/log/cron.log 2>&1" > /etc/crontabs/root

   CMD ["crond", "-f", "-l", "2"]
   ```
3. Nesse app novo (`email-cron`), configure a env var `CRON_SECRET` com o mesmo valor do app principal.
4. Faça o deploy. Esse container não expõe porta nenhuma — só fica rodando `crond` em segundo plano.

Essa opção exige manter um segundo serviço rodando (consumo mínimo de RAM/CPU, mas é mais uma peça pra monitorar) — só vale a pena se você quiser evitar a dependência externa da Opção 1.

---

## Testar manualmente (qualquer uma das duas opções)

Antes de configurar o agendamento, valide a rota direto do terminal:

```bash
curl -i -X POST \
  -H "Authorization: Bearer SEU_CRON_SECRET" \
  https://www.leticiademetrio.com.br/api/cron/email-sequences
```

Confira:
- Resposta `{"success":true,"results":{"email_2_sent_at":{"sent":N,"failed":N}}}`.
- Logs da aplicação no EasyPanel (prefixo `[cron/email-sequences]` se algo falhar).
- No painel do Listmonk, se algum e-mail 2 foi enviado, ele aparece no histórico do subscriber.

---

## Checklist

- [ ] Cron configurado (cron-job.org **ou** app dedicado no EasyPanel — escolha uma)
- [ ] `CRON_SECRET` configurado tanto no agendador (header, no caso do cron-job.org) quanto no app principal
- [ ] Teste manual da rota (`curl` acima) retornou sucesso
- [ ] Aguardar a primeira execução automática (próxima hora cheia) e conferir os logs

---

*Tutorial preparado em julho de 2026, revisado em 31/08/2026 para corrigir a menção incorreta a Coolify e a uma tela de "Cron Job" nativa do EasyPanel que não existe — conferido contra a documentação oficial (`easypanel.io/docs/guides/cron-job`) nesta revisão. Parte da migração descrita em `docs/migracao-brevo-ses.md`.*
