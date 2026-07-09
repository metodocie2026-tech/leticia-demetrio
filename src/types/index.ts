export interface NavLink {
  label: string
  href: string
}

export interface Service {
  id: string
  icon: string
  title: string
  description: string
  featured?: boolean
}

export interface CourseMethod {
  id: string
  title: string
  description: string
  type: 'presencial' | 'online' | 'ambos'
  featured?: boolean
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
