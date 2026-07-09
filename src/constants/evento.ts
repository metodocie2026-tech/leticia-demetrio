// ─────────────────────────────────────────────────────────────────────────────
// EVENT CONTENT — edit everything here; pages and components read from this file
// ─────────────────────────────────────────────────────────────────────────────

export const EVENTO = {
  // ── Identity ───────────────────────────────────────────────────────────────
  nome: 'Semana Elegância na Prática',
  tagline: 'Aprenda a se vestir de forma elegante e prática para qualquer ocasião em até 30 dias.',
  data: '27, 29 e 30 de julho de 2026',
  horario: 'YouTube · Às 08h',
  gratuito: true,

  // ── Metadata ───────────────────────────────────────────────────────────────
  seo: {
    titulo: 'Semana Elegância na Prática — Gratuito | Letícia Demétrio',
    descricao:
      '3 aulas gratuitas para aprender a se vestir com elegância, segurança e intenção no dia a dia. Inscreva-se agora!',
  },

  // ── Presentation page ──────────────────────────────────────────────────────
  apresentacao: {
    hero: {
      badge: '3 aulas gratuitas · YouTube · 27, 29 e 30/07 às 08h',
      titulo: 'Aprenda a se vestir de forma elegante e prática para qualquer ocasião em até 30 dias.',
      subtitulo: 'O problema não é o seu guarda-roupa. É a falta de clareza na hora de se vestir.',
      cta: 'Quero minha vaga gratuita',
    },

    paraQuem: {
      titulo: 'Se você sente que sempre falta alguma coisa na hora de se vestir…',
      itens: [
        'Tem um guarda-roupa cheio, mas ainda sente que não tem o que vestir',
        'Compra roupas… mas nunca se sente realmente bem com o resultado',
        'Monta looks e sempre pensa: "tá faltando alguma coisa…"',
        'Repete as mesmas combinações por insegurança ou falta de ideia',
        'Se arruma… mas não se sente elegante de verdade',
        'Olha no espelho e sente que sua imagem não representa quem você é',
      ],
    },

    problema: {
      texto: 'O problema não é você. E nem o seu guarda-roupa. O que está faltando é direção na hora de se vestir — e ninguém nunca te mostrou esse caminho.',
      conclusao: 'Porque não é sobre tentar mais… é sobre saber o que fazer.',
      destaque: 'E é isso que você vai aprender na Semana Elegância na Prática.',
    },

    agenda: {
      titulo: 'O que você vai aprender na Semana Elegância na Prática',
      subtitulo: 'Três aulas gratuitas para você aprender a se vestir com elegância, segurança e intenção na prática e no seu dia a dia.',
      aulas: [
        {
          numero: 'Aula 1',
          titulo: 'Por que você ainda não consegue se vestir bem todos os dias',
          descricao:
            'Descubra por que você sente que tem roupa, mas ainda trava na hora de montar looks e como começar a enxergar sua imagem com mais clareza.',
          plataforma: 'YouTube · 27/07 às 08h · link exclusivo para inscritas',
          destaque: false,
        },
        {
          numero: 'Aula 2',
          titulo: 'Como montar looks elegantes que realmente funcionam no seu dia a dia',
          descricao:
            'Aprenda a combinar peças, cores e detalhes de forma simples para transformar produções básicas em looks com mais intenção e presença.',
          plataforma: 'YouTube · 29/07 às 08h · link exclusivo para inscritas',
          destaque: false,
        },
        {
          numero: 'Aula 3',
          titulo: 'O passo a passo para se vestir bem todos os dias com elegância e segurança',
          descricao:
            'Como construir uma imagem mais elegante, autêntica e segura sem depender de tendências ou de um guarda-roupa novo.',
          plataforma: 'YouTube · 30/07 às 08h · link exclusivo para inscritas',
          destaque: false,
        },
      ],
    },

    acesso: {
      titulo: 'Tudo o que você vai ter acesso',
      itens: [
        {
          emoji: '✨',
          titulo: 'Clareza para se vestir com mais segurança!',
          descricao:
            'Você vai parar de se arrumar com dúvida e finalmente se sentir bem com o que vê no espelho.',
        },
        {
          emoji: '🎓',
          titulo: '3 aulas práticas e gratuitas',
          descricao:
            'Aprenda exatamente o que fazer na hora de se vestir, com orientações simples que você já consegue aplicar no mesmo dia.',
        },
        {
          emoji: '📋',
          titulo: 'Materiais exclusivos',
          descricao:
            'Para você consultar sempre que precisar e não voltar a se sentir perdida na hora de se vestir.',
        },
        {
          emoji: '💬',
          titulo: 'Grupo exclusivo no WhatsApp',
          descricao:
            'Para receber os avisos, links das aulas e se sentir acompanhada durante toda a jornada, sem se sentir sozinha nesse processo.',
        },
        {
          emoji: '👗',
          titulo: 'Conteúdo aplicável no dia a dia',
          descricao:
            'Nada de teoria difícil, tudo pensado para funcionar na sua rotina, com o que você já tem no seu guarda-roupa.',
        },
      ],
      fechamento: {
        linha1: 'Você não precisa de mais roupas.',
        linha2: 'Você precisa saber o que fazer com elas.',
      },
    },

    sobre: {
      titulo: 'Prazer, eu sou Letícia Demétrio',
      paragrafos: [
        'Sou consultora de imagem e criadora do Método C.I.E. E durante muito tempo, eu também achei que não tinha estilo. Eu me vestia, mas não me reconhecia. Copiava referências, seguia tendências e ainda assim sentia que algo não encaixava.',
        'Tudo começou a mudar quando eu entendi que estilo não é sobre moda. É sobre clareza, identidade e intenção.',
        'Na Semana Elegância na Prática, eu vou te mostrar como aplicar isso na vida real, de forma leve, prática e possível.',
        'Se hoje você sente que sua imagem não representa quem você é, essa aula é para você.',
      ],
    },

    ctaFinal: {
      titulo: 'De forma simples, prática e possível para a sua realidade.',
      subtitulo: 'A inscrição é gratuita e leva menos de um minuto.',
      cta: 'Garantir minha vaga agora',
    },
  },

  // ── Registration page ──────────────────────────────────────────────────────
  inscricao: {
    seo: {
      titulo: 'Inscrição — Semana Elegância na Prática | Letícia Demétrio',
    },
    titulo: 'Garanta sua vaga gratuita',
    subtitulo: 'Preencha os dados abaixo e pronto — você está dentro!',
    cta: 'Confirmar minha inscrição',
    enviando: 'Confirmando...',
    rodape: 'De acordo com as Leis 12.965/2014 e 13.709/2018, ao submeter este formulário autorizo Leticia Oliveira Demétrio a enviar notificações e concordo com sua Política de Privacidade.',
  },

  // ── Thank you page ─────────────────────────────────────────────────────────
  obrigada: {
    seo: {
      titulo: 'Inscrição quase confirmada! — Semana Elegância na Prática | Letícia Demétrio',
    },
    // URL da pesquisa/formulário para resgatar o presente (Mapa da Silhueta)
    surveyUrl: '#', // ← substitua pelo link real do formulário
  },
}

// ── Form field config ──────────────────────────────────────────────────────
export interface InscricaoData {
  nome: string
  email: string
  whatsapp: string
}
