import {
  Palette,
  Sparkles,
  ShoppingBag,
  Scissors,
  BookOpen,
  Heart,
  type LucideProps,
} from 'lucide-react'

export type IconComponent = React.ComponentType<LucideProps>

export const ICON_MAP: Record<string, IconComponent> = {
  Palette,
  Sparkles,
  ShoppingBag,
  Scissors,
  BookOpen,
  Heart,
}

export const ICON_NAMES = Object.keys(ICON_MAP)
