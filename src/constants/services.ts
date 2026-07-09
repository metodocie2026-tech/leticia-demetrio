import type { Service, CourseMethod } from '@/types'

export const SERVICES: Service[] = [
  {
    id: 'coloracao',
    icon: 'Palette',
    title: 'Análise de Coloração Pessoal',
    description:
      'Descubra as cores que harmonizam com sua pele, cabelo e olhos. Crie uma paleta pessoal que valoriza e ilumina você em qualquer situação.',
    featured: true,
  },
  {
    id: 'consultoria',
    icon: 'Sparkles',
    title: 'Consultoria de Imagem Completa',
    description:
      'Uma jornada de autoconhecimento para desenvolver um estilo autêntico que reflete sua personalidade, valores e objetivos de vida.',
    featured: true,
  },
  {
    id: 'personal-shopper',
    icon: 'ShoppingBag',
    title: 'Personal Shopper',
    description:
      'Compras assertivas e sem desperdício. Vou com você para montar looks perfeitos para cada ocasião, respeitando seu orçamento e estilo.',
  },
  {
    id: 'visagismo',
    icon: 'Scissors',
    title: 'Visagismo',
    description:
      'Harmonia entre seu rosto, corte de cabelo e acessórios para realçar sua beleza natural de forma equilibrada e elegante.',
  },
  {
    id: 'cursos',
    icon: 'BookOpen',
    title: 'Cursos & Workshops',
    description:
      'Aprenda as ferramentas da consultoria de imagem e transforme não só seu guarda-roupa, mas sua autoestima e confiança.',
  },
  {
    id: 'mentoria',
    icon: 'Heart',
    title: 'Mentoria Individual',
    description:
      'Acompanhamento personalizado e contínuo para quem deseja uma transformação profunda e duradoura na sua imagem e autoestima.',
  },
]

export const COURSE_METHODS: CourseMethod[] = [
  {
    id: 'cores-identidade',
    title: 'Método Cores & Identidade',
    description:
      'Análise completa de coloração pessoal integrada à consultoria de imagem em um programa transformador que une técnica e essência.',
    type: 'ambos',
    featured: true,
  },
  {
    id: 'imagem-zero',
    title: 'Imagem Pessoal do Zero',
    description:
      'Para quem quer aprender a se vestir bem por conta própria. Domine os fundamentos do estilo pessoal com didática e leveza.',
    type: 'online',
    featured: true,
  },
  {
    id: 'armario-capsula',
    title: 'Workshop Armário Cápsula',
    description:
      'Crie um guarda-roupa funcional e incrível com menos peças, mais versatilidade e zero culpa nas compras.',
    type: 'presencial',
  },
  {
    id: 'programa-completo',
    title: 'Programa Imagem Completa',
    description:
      'O programa mais abrangente: coloração, estilo, personal shopping e visagismo em uma experiência imersiva e única.',
    type: 'presencial',
    featured: true,
  },
  {
    id: 'estilo-casa',
    title: 'Estilo em Casa',
    description:
      'Acesse os ensinamentos de Letícia de onde você estiver. Metodologia online com suporte e comunidade exclusiva.',
    type: 'online',
  },
]
