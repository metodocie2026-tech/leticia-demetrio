'use client'

import { useState, useCallback } from 'react'
import type { ContactFormData, ContactFormState } from '@/types'
import { submitContact } from '@/services/contact'

const INITIAL_DATA: ContactFormData = {
  name: '',
  email: '',
  phone: '',
  message: '',
}

function validate(data: ContactFormData): Partial<ContactFormData> {
  const errors: Partial<ContactFormData> = {}

  if (!data.name.trim()) errors.name = 'Nome é obrigatório'

  if (!data.email.trim()) {
    errors.email = 'E-mail é obrigatório'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'E-mail inválido'
  }

  if (!data.phone.trim()) errors.phone = 'Telefone é obrigatório'
  if (!data.message.trim()) errors.message = 'Mensagem é obrigatória'

  return errors
}

export function useContactForm() {
  const [state, setState] = useState<ContactFormState>({
    data: INITIAL_DATA,
    status: 'idle',
    errors: {},
  })

  const updateField = useCallback((field: keyof ContactFormData, value: string) => {
    setState((prev) => ({
      ...prev,
      data: { ...prev.data, [field]: value },
      errors: { ...prev.errors, [field]: undefined },
    }))
  }, [])

  const handleSubmit = useCallback(async () => {
    const errors = validate(state.data)
    if (Object.keys(errors).length > 0) {
      setState((prev) => ({ ...prev, errors }))
      return
    }

    setState((prev) => ({ ...prev, status: 'submitting' }))

    try {
      await submitContact(state.data)
      setState({ data: INITIAL_DATA, status: 'success', errors: {} })
    } catch {
      setState((prev) => ({ ...prev, status: 'error' }))
    }
  }, [state.data])

  const resetStatus = useCallback(() => {
    setState((prev) => ({ ...prev, status: 'idle' }))
  }, [])

  return { state, updateField, handleSubmit, resetStatus }
}
