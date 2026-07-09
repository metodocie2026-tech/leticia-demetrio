import { unstable_cache } from 'next/cache'
import { supabase } from './supabase'

export type Settings = {
  site_ativo: boolean
  evento_semana_ativo: boolean
  aulas_ativo: boolean
  matriculas_ativo: boolean
  lista_espera_ativo: boolean
  whatsapp_number: string
  whatsapp_group_url: string
  survey_url: string
  matriculas_video_url: string
  matriculas_cta_url: string
}

const DEFAULT_SETTINGS: Settings = {
  site_ativo: true,
  evento_semana_ativo: false,
  aulas_ativo: false,
  matriculas_ativo: false,
  lista_espera_ativo: false,
  whatsapp_number: '',
  whatsapp_group_url: '',
  survey_url: '',
  matriculas_video_url: '',
  matriculas_cta_url: '',
}

// Cached for up to 60s. Cleared immediately when admin saves via revalidateTag('settings').
export const getSettings = unstable_cache(
  async (): Promise<Settings> => {
    const { data, error } = await supabase
      .from('settings')
      .select('site_ativo, evento_semana_ativo, aulas_ativo, matriculas_ativo, lista_espera_ativo, whatsapp_number, whatsapp_group_url, survey_url, matriculas_video_url, matriculas_cta_url')
      .eq('id', 1)
      .single()

    if (error || !data) return DEFAULT_SETTINGS
    return data as Settings
  },
  ['settings'],
  { tags: ['settings'], revalidate: 60 },
)
