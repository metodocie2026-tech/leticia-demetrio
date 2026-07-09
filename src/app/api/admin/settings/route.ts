import { NextRequest, NextResponse } from 'next/server'
import { revalidateTag } from 'next/cache'
import { supabase } from '@/lib/supabase'
import type { Settings } from '@/lib/settings'

export async function PATCH(req: NextRequest) {
  try {
    const body: Partial<Settings> = await req.json()

    const { error } = await supabase
      .from('settings')
      .update(body)
      .eq('id', 1)

    if (error) throw error

    // Clears the cache immediately — next page load gets fresh state
    revalidateTag('settings', 'max')

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erro ao salvar configuração.' }, { status: 500 })
  }
}
