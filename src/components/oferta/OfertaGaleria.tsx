import Image from 'next/image'

interface OfertaGaleriaProps {
  imagens: string[]
  titulo: string
}

export function OfertaGaleria({ imagens, titulo }: OfertaGaleriaProps) {
  if (imagens.length === 0) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
      {imagens.map((src, i) => (
        <div key={src} className="relative aspect-square rounded-xl overflow-hidden bg-surface">
          <Image
            src={src}
            alt={`${titulo} — atendimento ${i + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, 33vw"
          />
        </div>
      ))}
    </div>
  )
}
