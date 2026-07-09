import type { NavLink } from '@/types'

export const NAV_LINKS: NavLink[] = [
  { label: 'Sobre', href: '#sobre' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Métodos', href: '#metodos' },
  { label: 'Depoimentos', href: '#depoimentos' },
  { label: 'Contato', href: '#contato' },
]

export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '5511999999999'

export const WHATSAPP_DEFAULT_MESSAGE =
  'Olá Letícia! Vi seu site e gostaria de saber mais sobre seus serviços de consultoria de imagem.'

export const WHATSAPP_GROUP_URL =
  process.env.NEXT_PUBLIC_WHATSAPP_GROUP_URL ?? '#'

// Replace with the real Instagram profile URL
export const INSTAGRAM_URL = 'https://instagram.com/leticiademetrio'
