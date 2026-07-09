import { NextRequest, NextResponse } from 'next/server'
import type { ContactFormData } from '@/types'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  try {
    const body: ContactFormData = await req.json()

    if (!body.name || !body.email || !body.phone || !body.message) {
      return NextResponse.json(
        { error: 'Campos obrigatórios ausentes.' },
        { status: 400 },
      )
    }

    const { error } = await supabase.from('contacts').insert({
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
    })

    if (error) throw error

    return NextResponse.json({ success: true }, { status: 200 })
  } catch {
    return NextResponse.json(
      { error: 'Erro interno do servidor.' },
      { status: 500 },
    )
  }
}
