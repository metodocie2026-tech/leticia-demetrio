import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import { SITE_METADATA } from '@/constants/content'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '600', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_METADATA.url),
  title: {
    default: SITE_METADATA.title,
    template: `%s | ${SITE_METADATA.name}`,
  },
  description: SITE_METADATA.description,
  keywords: [
    'consultora de imagem',
    'análise de coloração pessoal',
    'análise de cores',
    'estilo pessoal',
    'consultoria de estilo',
    'personal shopper',
    'visagismo',
    'imagem pessoal',
    'Letícia Demétrio',
  ],
  authors: [{ name: SITE_METADATA.name }],
  creator: SITE_METADATA.name,
  openGraph: {
    type: 'website',
    locale: SITE_METADATA.locale,
    url: SITE_METADATA.url,
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    siteName: SITE_METADATA.name,
    images: [
      {
        url: '/og-image.jpg', // Add a 1200×630 image to /public/og-image.jpg
        width: 1200,
        height: 630,
        alt: `${SITE_METADATA.name} – Consultora de Imagem e Estilo Pessoal`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_METADATA.title,
    description: SITE_METADATA.description,
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: SITE_METADATA.url,
  },
}

// JSON-LD structured data for Google rich results
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  '@id': SITE_METADATA.url,
  name: 'Letícia Demétrio Consultoria de Imagem',
  description: SITE_METADATA.description,
  url: SITE_METADATA.url,
  priceRange: '$$',
  serviceType: [
    'Consultoria de Imagem',
    'Análise de Coloração Pessoal',
    'Personal Shopper',
    'Visagismo',
    'Cursos de Estilo Pessoal',
  ],
  areaServed: {
    '@type': 'Country',
    name: 'Brazil',
  },
  founder: {
    '@type': 'Person',
    name: 'Letícia Demétrio',
    jobTitle: 'Consultora de Imagem e Estilo Pessoal',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${playfair.variable} scroll-smooth antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen bg-white text-dark font-body">
        {/* GTM noscript — must be first element inside body */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5RP6TW48"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {children}
        <Script
          id="gtm"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-5RP6TW48');`,
          }}
        />
      </body>
    </html>
  )
}
