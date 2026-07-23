# Tutorial — Cron Job no EasyPanel (e-mail de +24h)

Passo a passo pra criar o Cron Job que chama a rota `/api/cron/email-sequences` de hora em hora, responsável por disparar o e-mail 2 (24h após a inscrição) e qualquer outro e-mail futuro por gatilho relativo (Categoria A — ver `docs/migracao-brevo-ses.md` §3.2).

Pré-requisito: a rota já implantada em produção (`src/app/api/cron/email-sequences/route.ts`) e a variável `CRON_SECRET` configurada no app.

---

## Parte 1 — Criar o Cron Job

1. No painel do EasyPanel, dentro do projeto do site, **+ New Service** → **Cron Job**.
2. Nome: `email-sequences-cron`.
3. **Schedule**: `0 * * * *` (todo início de hora — ajuste em [crontab.guru](https://crontab.guru) se quiser outra frequência).
4. **Command**: um `curl` simples que chama a rota do próprio site, autenticado com o secret:
   ```bash
   curl -sf -X POST \
     -H "Authorization: Bearer $CRON_SECRET" \
     https://www.leticiademetrio.com.br/api/cron/email-sequences
   ```
5. Se o Cron Job do EasyPanel exigir uma imagem Docker (em vez de rodar comando direto), use uma imagem leve com `curl`, ex: `curlimages/curl`, ou peça uma imagem baseada em `alpine` com `curl` instalado via Dockerfile mínimo — ver `docs/deploy-coolify.md`-style, seção de Cron Job na doc oficial do EasyPanel (`easypanel.io/docs/guides/cron-job`) tem os dois formatos (com e sem Dockerfile).
6. Configure a variável `CRON_SECRET` nesse serviço (mesmo valor usado no app principal).

---

## Parte 2 — Alternativa sem Dockerfile

Se preferir não criar um serviço de cron dentro do EasyPanel, dá pra usar um serviço externo gratuito de cron, como [cron-job.org](https://cron-job.org):

1. Criar conta gratuita.
2. Novo cron job, URL: `https://www.leticiademetrio.com.br/api/cron/email-sequences`.
3. Método: `POST`.
4. Header customizado: `Authorization: Bearer SEU_CRON_SECRET`.
5. Intervalo: a cada hora.

Essa opção é mais simples de configurar, mas depende de um serviço terceiro — se preferir manter tudo dentro do próprio VPS, use a Parte 1.

---

## Parte 3 — Testar

1. Rode o `curl` manualmente do seu terminal (fora do cron, só pra validar a rota):
   ```bash
   curl -i -X POST \
     -H "Authorization: Bearer SEU_CRON_SECRET" \
     https://www.leticiademetrio.com.br/api/cron/email-sequences
   ```
2. Confira o retorno (deve listar quantos e-mails foram processados/enviados) e os logs da aplicação no EasyPanel.
3. Confirme no Listmonk que o envio de teste apareceu no histórico.

---

## Parte 4 — Verificar depois de configurado

- [ ] Cron Job criado e ativo no EasyPanel (ou no cron-job.org)
- [ ] `CRON_SECRET` configurado tanto no serviço de cron quanto no app principal
- [ ] Teste manual da rota retornou sucesso
- [ ] Aguardar a primeira execução automática (próxima hora cheia) e conferir os logs

---

*Tutorial preparado em julho de 2026, como parte da migração descrita em `docs/migracao-brevo-ses.md`.*
