// ─────────────────────────────────────────────────────────────────────────────
// EVENT CONTENT — edit everything here; pages and components read from this file
// ─────────────────────────────────────────────────────────────────────────────

// Tag stored in Supabase (`inscricoes.evento`, `matriculas_leads.evento`,
// `lista_espera.evento`) to identify rows created for this event. Used by the
// admin reports to separate this event's data from the legacy one — see
// LEGACY_EVENTO_TAG in src/app/admin/resultados/page.tsx.
export const EVENTO_TAG = 'mapa-do-estilo-proprio'

export const EVENTO = {
  // ── Identity ───────────────────────────────────────────────────────────────
  nome: "O Mapa do Estilo Próprio",
  tagline:
    "Aprenda a descobrir o seu estilo e ter mais segurança e presença na sua imagem.",
  data: "14, 16 e 18 de setembro de 2026",
  horario: "YouTube · Às 08h",
  gratuito: true,

  // ── Metadata ───────────────────────────────────────────────────────────────
  seo: {
    titulo: "Descubra o seu estilo com o Mapa do Estilo Próprio - Letícia Demétrio",
    descricao:
      "No Mapa do Estilo Próprio, você vai descobrir o caminho para transformar seu estilo em looks que realmente representem você. Participe gratuitamente das 3 aulas com Letícia Demétrio.",
  },

  // ── Presentation page ──────────────────────────────────────────────────────
  apresentacao: {
    hero: {
      badge: "3 aulas gratuitas · YouTube · 14, 16 e 18/09 às 08h",
      titulo:
        "Aprenda a descobrir o seu estilo e ter mais segurança e presença na sua imagem.",
      subtitulo:
        "No Mapa do Estilo Próprio, você vai descobrir o caminho para transformar seu estilo em looks que realmente representem você.",
      cta: "Quero descobrir o meu estilo!",
    },

    paraQuem: {
      titulo: "Se você sente que sua imagem ainda não representa tudo o que você é…",
      itens: [
        "Tem roupas que gosta, mas não consegue transformá-las em looks com a sua personalidade.",
        "Se veste bem, mas sente que seus looks ainda não representam quem você é.",
        "No trabalho, sente que sua imagem não transmite a presença que gostaria.",
        "Repete as mesmas combinações por medo de sair do básico e acabar exagerando.",
        "Quer colocar mais personalidade nos looks profissionais, mas não sabe como fazer isso sem perder a seriedade.",
        "Sabe que sua imagem comunica, mas ainda não consegue usá-la a favor de quem você é e de como quer ser percebida.",
      ],
    },

    problema: {
      texto:
        "Talvez você tenha passado muito tempo tentando descobrir em qual estilo se encaixa. Mas estilo próprio não é escolher uma única definição.",
      conclusao: "Seu estilo é construído a partir do que representa você.",
      expansao:
        "Da sua personalidade, da sua rotina e da imagem que deseja transmitir para então aprender a traduzir tudo isso nos seus looks.",
      destaque: "É esse caminho que você vai descobrir no Mapa do Estilo Próprio.",
      cta: "Quero descobrir o meu estilo!",
    },

    agenda: {
      titulo: "O que você vai descobrir no Mapa do Estilo Próprio",
      subtitulo:
        "Três aulas gratuitas para você entender o que constrói o seu estilo e como ele pode transformar a forma como você se expressa através dos seus looks.",
      aulas: [
        {
          numero: "Aula 1",
          titulo: "Os 7 estilos: comece a reconhecer o que representa você",
          descricao:
            "Conheça os diferentes universos de estilo, suas principais características e os elementos que podem ajudar você a reconhecer o que faz sentido para a sua imagem.",
          plataforma: "YouTube · 14/09 às 08h · link exclusivo para inscritas",
          destaque: false,
        },
        {
          numero: "Aula 2",
          titulo: "Por que gostar de um estilo não é suficiente para construir o seu",
          descricao:
            "Entenda como sua personalidade, sua rotina e a imagem que deseja transmitir influenciam o seu estilo e a forma como seus looks são percebidos.",
          plataforma: "YouTube · 16/09 às 08h · link exclusivo para inscritas",
          destaque: false,
        },
        {
          numero: "Aula 3",
          titulo: "O caminho para transformar seu estilo em looks que representem você",
          descricao:
            "Descubra o que precisa acontecer para sair das referências soltas e construir uma imagem com mais personalidade, intenção e presença.",
          plataforma: "YouTube · 18/09 às 08h · link exclusivo para inscritas",
          destaque: false,
        },
      ],
    },

    acesso: {
      titulo: "Tudo o que você vai ter acesso",
      itens: [
        {
          titulo: "Mais clareza sobre o seu estilo",
          descricao:
            "Você vai começar a reconhecer os elementos que representam sua personalidade e entender o que realmente faz sentido para a sua imagem.",
        },
        {
          titulo: "3 aulas gratuitas sobre estilo e imagem",
          descricao:
            "Três encontros para entender o que constrói o seu estilo, como seus looks são percebidos e o que existe por trás de uma imagem com mais personalidade e presença.",
        },
        {
          titulo: "Grupo exclusivo no WhatsApp",
          descricao:
            "Receba todos os avisos, links das aulas e conteúdos do evento para acompanhar cada etapa do Mapa do Estilo Próprio.",
        },
        {
          titulo: "Um novo olhar para os seus looks",
          descricao:
            "Entenda por que algumas escolhas representam você e outras não e comece a enxergar seus looks com mais intenção, personalidade e consciência.",
        },
      ],
      fechamento: {
        linha1: "Você não precisa se vestir como todo mundo.",
        linha2: "Precisa descobrir o que realmente representa você.",
        cta: "Quero descobrir o meu estilo!",
      },
    },

    sobre: {
      titulo: "Prazer, eu sou Letícia Demétrio",
      paragrafos: [
        "Sou consultora de imagem e criadora do Método C.I.E. Ao longo dos últimos anos, já acompanhei centenas de mulheres e percebi algo que se repetia: muitas delas tinham roupas, referências e até sabiam do que gostavam, mas ainda sentiam dificuldade de reconhecer o próprio estilo e traduzir sua personalidade através dos looks.",
        "E foi entendendo isso que uma coisa ficou cada vez mais clara para mim: estilo próprio não é sobre se encaixar em uma definição. É sobre reconhecer o que representa você e a imagem que deseja transmitir.",
        "Foi a partir dessa visão que nasceu o Mapa do Estilo Próprio.",
        "Durante esses três encontros, eu vou te ajudar a enxergar o que existe por trás do seu estilo, entender por que algumas escolhas representam você e outras não, e descobrir o caminho para construir uma imagem com mais personalidade, intenção e presença.",
        "Se você sente que seus looks ainda não mostram tudo o que você é, esse evento é para você.",
      ],
    },

    ctaFinal: {
      titulo: "Seu estilo não precisa ser inventado. Ele precisa ser reconhecido.",
      subtitulo:
        "Descubra o que constrói o seu estilo e o caminho para traduzi-lo em looks que realmente representem você.",
      cta: "Quero descobrir o meu estilo!",
    },
  },

  // ── Registration page ──────────────────────────────────────────────────────
  inscricao: {
    seo: {
      titulo: "Inscrição — Mapa do Estilo Próprio | Letícia Demétrio",
    },
    titulo: "Garanta sua vaga gratuita",
    subtitulo: "Preencha os dados abaixo e pronto você está dentro!",
    cta: "Confirmar minha inscrição",
    enviando: "Confirmando...",
    rodape:
      "De acordo com as Leis 12.965/2014 e 13.709/2018, ao submeter este formulário autorizo Leticia Oliveira Demétrio a enviar notificações e concordo com sua Política de Privacidade.",
  },

  // ── Thank you page ─────────────────────────────────────────────────────────
  obrigada: {
    seo: {
      titulo: "Inscrição quase confirmada! — Mapa do Estilo Próprio | Letícia Demétrio",
    },
    // URL da pesquisa/formulário para resgatar o presente (Mapa da Silhueta)
    surveyUrl: "#", // ← substitua pelo link real do formulário
  },
};

// ── Form field config ──────────────────────────────────────────────────────
export interface InscricaoData {
  nome: string;
  email: string;
  whatsapp: string;
}
