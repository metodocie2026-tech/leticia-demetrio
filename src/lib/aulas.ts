import { unstable_cache } from 'next/cache'
import { supabase } from './supabase'
import type { AulaVideo } from '@/constants/aulas'

type AulaRow = {
  id: number
  dia: string
  titulo: string
  youtube_id: string
  duracao: string
  descricao: string
  release_at: string | null
}

export const getAulas = unstable_cache(
  async (): Promise<AulaVideo[]> => {
    const { data } = await supabase
      .from('aulas')
      .select('*')
      .order('id', { ascending: true })

    if (!data) return []

    return (data as AulaRow[]).map((row) => ({
      id: `dia-${row.id}`,
      dia: row.dia,
      titulo: row.titulo,
      descricao: row.descricao,
      youtubeId: row.youtube_id,
      duracao: row.duracao,
      releaseAt: row.release_at,
    }))
  },
  ['aulas'],
  { tags: ['aulas'], revalidate: 60 },
)
