# Integração com Google Tag Manager (GTM)

## O que você vai precisar

- [ ] ID do container GTM da Letícia — formato `GTM-XXXXXXX`
- [ ] Acesso ao código do projeto para editar `src/app/layout.tsx`

> Se a Letícia ainda não tem uma conta GTM, crie uma em [tagmanager.google.com](https://tagmanager.google.com). É gratuito. Crie um container do tipo **Web** e o ID aparece no topo da tela.

---

## Parte 1 — Instalar o GTM no site

Abra o arquivo `src/app/layout.tsx` e faça as duas alterações abaixo.

### 1.1 — Adicionar o import do Script

No topo do arquivo, adicione a linha de import:

```tsx
import Script from 'next/script'
```

### 1.2 — Adicionar o script no `<head>`

Dentro do `<html>`, antes do `<body>`, adicione:

```tsx
<Script
  id="gtm-script"
  strategy="afterInteractive"
  src="https://www.googletagmanager.com/gtm.js?id=GTM-XXXXXXX"
/>
```

> Substitua `GTM-XXXXXXX` pelo ID real.

### 1.3 — Adicionar o noscript no `<body>`

Logo após a abertura da tag `<body>`, adicione:

```tsx
<noscript>
  <iframe
    src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
    height="0"
    width="0"
    style={{ display: 'none', visibility: 'hidden' }}
  />
</noscript>
```

> Substitua `GTM-XXXXXXX` pelo ID real aqui também.

### Como o arquivo ficará (estrutura resumida)

```tsx
import Script from 'next/script'
// ... outros imports

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtm.js?id=GTM-XXXXXXX"
      />
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>

        {children}
      </body>
    </html>
  )
}
```

---

## Parte 2 — Verificar se o GTM está funcionando

1. Suba o site (ou rode localmente com `npm run dev`)
2. Instale a extensão **[Google Tag Assistant](https://tagassistant.google.com/)** no Chrome
3. Acesse o site e abra a extensão — ela vai mostrar se o GTM foi detectado corretamente

Ou dentro do próprio GTM: **Preview mode** → insira a URL do site → ele abre o site com um painel de debug na parte de baixo mostrando todos os eventos em tempo real.

---

## Parte 3 — Configurar o GA4 dentro do GTM

Depois de instalar o GTM, você conecta o Google Analytics 4 direto pelo painel do GTM — sem precisar mexer no código de novo.

1. No GTM: **Tags → Nova tag**
2. Tipo: **Google Analytics: GA4 Configuration**
3. Cole o **Measurement ID** do GA4 (formato `G-XXXXXXXXXX`)
4. Trigger: **All Pages**
5. Salvar e **Publicar** o container

A partir daí, o GA4 passa a registrar todas as visitas automaticamente.

---

## Parte 4 — UTM tags (como usar)

UTM tags são parâmetros que você adiciona nos links das campanhas antes de postar. O GA4 os lê automaticamente — sem nenhuma configuração extra.

### Criar links com UTM

Use o **[Google Campaign URL Builder](https://ga.google.com/analytics/web/#utm_source=help&utm_medium=link)** ou monte manualmente:

```
https://leticiademetrio.com.br/semana
  ?utm_source=instagram
  &utm_medium=stories
  &utm_campaign=semana-imagem-junho
```

| Parâmetro | O que preencher | Exemplo |
|---|---|---|
| `utm_source` | De onde vem o tráfego | `instagram`, `email`, `whatsapp` |
| `utm_medium` | Tipo de canal | `stories`, `feed`, `link_bio`, `cpc` |
| `utm_campaign` | Nome da campanha | `semana-imagem-junho`, `lancamento-curso` |
| `utm_content` | Variação do criativo (opcional) | `banner_rosa`, `video_30s` |

### Onde usar

- Link na bio do Instagram → `?utm_source=instagram&utm_medium=link_bio`
- Stories com link → `?utm_source=instagram&utm_medium=stories`
- Disparo de e-mail → `?utm_source=email&utm_medium=newsletter`
- Anúncio pago → `?utm_source=instagram&utm_medium=cpc`

### Onde ver os resultados

No GA4: **Relatórios → Aquisição → Aquisição de tráfego**. Você vê quantas pessoas vieram de cada campanha, quantas se inscreveram, quanto tempo ficaram no site, etc.

---

## Opcional — Capturar UTM nos formulários

Se quiser saber de qual campanha cada lead veio (visível no Supabase junto com nome/email), é uma funcionalidade adicional que pode ser implementada depois. Me fale quando quiser e adiciono ao projeto — leva cerca de 1 hora.

---

## Resumo do que fazer

1. **Pegar o ID GTM** com a Letícia (`GTM-XXXXXXX`)
2. **Editar `src/app/layout.tsx`** conforme a Parte 1
3. **Verificar** com o Tag Assistant (Parte 2)
4. **Conectar o GA4** dentro do GTM (Parte 3) — sem mexer no código
5. **Usar links com UTM** em todas as campanhas (Parte 4)

---

*Documentação preparada em junho de 2026.*
