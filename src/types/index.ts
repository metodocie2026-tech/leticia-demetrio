export interface NavLink {
  label: string
  href: string
}

export type OfertaTipo = 'servico' | 'produto_curso'
// 'digital' é pra produtos/cursos (ebook, curso gravado) — sempre digital, não
// é nem presencial nem "online" no sentido de encontro ao vivo. online/presencial/
// ambos continuam existindo pra serviços, que são de fato feitos com ou sem
// presença física.
export type OfertaModalidade = 'online' | 'presencial' | 'ambos' | 'digital'
export type CtaTipo = 'whatsapp' | 'link'

export interface OfertaStep {
  titulo: string
  descricao: string
}

export interface OfertaFaqItem {
  pergunta: string
  resposta: string
}

export interface Oferta {
  id: number
  tipo: OfertaTipo
  modalidade: OfertaModalidade
  slug: string
  titulo: string
  descricaoCurta: string
  icone: string
  destaque: boolean
  ordem: number
  ctaTipo: CtaTipo
  ctaUrl: string
  ctaMensagem: string
  ctaLabel: string
  sobre: string[]
  comoFunciona: OfertaStep[]
  galeria: string[]
  faq: OfertaFaqItem[]
  seoTitulo: string
  seoDescricao: string
  investimentoNota: string
  ativo: boolean
}

export interface Testimonial {
  id: string
  quote: string
  author: string
  role?: string
}

export interface ContactFormData {
  name: string
  email: string
  phone: string
  message: string
}

export interface ContactFormState {
  data: ContactFormData
  status: 'idle' | 'submitting' | 'success' | 'error'
  errors: Partial<ContactFormData>
}
