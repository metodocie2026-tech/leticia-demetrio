'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

export function BackButton() {
  const router = useRouter()
  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="flex items-center gap-1.5 text-sm font-body text-subtle hover:text-primary transition-colors"
    >
      <ArrowLeft size={15} aria-hidden="true" />
      Voltar ao site
    </button>
  )
}
