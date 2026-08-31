import { Monitor, MapPin, Layers, Download } from 'lucide-react'
import type { OfertaModalidade } from '@/types'
import type { IconComponent } from '@/constants/icons'

export const MODALIDADE_CONFIG: Record<OfertaModalidade, { label: string; Icon: IconComponent }> = {
  presencial: { label: 'Presencial', Icon: MapPin },
  online: { label: 'Online', Icon: Monitor },
  ambos: { label: 'Presencial & Online', Icon: Layers },
  digital: { label: 'Digital', Icon: Download },
}
