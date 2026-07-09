import { redirect } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { Services } from '@/components/sections/Services'
import { Methods } from '@/components/sections/Methods'
import { Testimonials } from '@/components/sections/Testimonials'
import { Location } from '@/components/sections/Location'
import { Contact } from '@/components/sections/Contact'
import { WhatsAppFloat } from '@/components/sections/WhatsAppFloat'
import { getSettings } from '@/lib/settings'

export default async function Home() {
  const settings = await getSettings()

  // Redirect to the event page only when the site is off AND the event is on
  // (avoids a redirect loop if both are disabled)
  if (!settings.site_ativo && settings.evento_semana_ativo) {
    redirect('/semana-elegancia-na-pratica')
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Services />
        <Methods />
        <Testimonials />
        <Location />
        <Contact />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
