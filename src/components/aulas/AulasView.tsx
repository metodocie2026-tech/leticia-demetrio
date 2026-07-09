'use client'

import { useState, useRef } from 'react'
import YouTube, { type YouTubeEvent } from 'react-youtube'
import { Play, Lock, Clock } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { AulaVideo } from '@/constants/aulas'

type YTPlayerRef = {
  loadVideoById: (videoId: string) => void
}

type VideoState = 'available' | 'scheduled' | 'locked'

function getVideoState(video: AulaVideo): VideoState {
  if (!video.youtubeId) return 'locked'
  if (video.releaseAt && new Date(video.releaseAt) > new Date()) return 'scheduled'
  return 'available'
}

export function AulasView({ videos, initialDay = 1 }: { videos: AulaVideo[]; initialDay?: number }) {
  const firstAvailable = videos.findIndex((v) => getVideoState(v) === 'available')
  const hasAny = firstAvailable !== -1

  const requestedIndex = initialDay - 1
  const requestedState = videos[requestedIndex] ? getVideoState(videos[requestedIndex]) : 'locked'
  const startIndex = requestedState === 'available'
    ? requestedIndex
    : hasAny
      ? firstAvailable
      : 0

  const [selectedIndex, setSelectedIndex] = useState(startIndex)
  const [initialVideoId] = useState(videos[startIndex]?.youtubeId ?? '')
  const playerRef = useRef<YTPlayerRef | null>(null)

  const selected = videos[selectedIndex]

  function onReady(e: YouTubeEvent) {
    playerRef.current = e.target as unknown as YTPlayerRef
  }

  function selectVideo(index: number) {
    const video = videos[index]
    if (getVideoState(video) !== 'available') return
    setSelectedIndex(index)
    playerRef.current?.loadVideoById(video.youtubeId)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px]">

      {/* ── Player column ───────────────────────────────────────── */}
      <section
        className="p-4 sm:p-6 lg:p-8 lg:pb-16"
        aria-label={`Assistindo: ${selected?.titulo ?? 'nenhum vídeo selecionado'}`}
      >
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-2xl ring-1 ring-white/10">
          {hasAny ? (
            <YouTube
              videoId={initialVideoId}
              onReady={onReady}
              className="absolute inset-0 w-full h-full"
              iframeClassName="w-full h-full"
              opts={{
                width: '100%',
                height: '100%',
                playerVars: { modestbranding: 1, rel: 0, color: 'white' },
              }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                <Play size={24} className="text-white/15" aria-hidden="true" />
              </div>
              <p className="text-white/25 font-body text-sm text-center px-6">
                Os replays estarão disponíveis durante a semana
              </p>
            </div>
          )}
        </div>

        <div className="mt-5 max-w-3xl">
          <div className="flex items-center flex-wrap gap-3 mb-3">
            <span className="text-xs font-semibold tracking-widest uppercase text-primary font-body bg-primary/10 border border-primary/20 px-3 py-1 rounded-full">
              {selected?.dia}
            </span>

            {selected?.duracao && (
              <span className="flex items-center gap-1.5 text-xs font-body text-white/35">
                <Clock size={11} aria-hidden="true" />
                {selected.duracao}
              </span>
            )}

            {selected && getVideoState(selected) !== 'available' && (
              <span className="flex items-center gap-1.5 text-xs font-body text-white/30">
                <Lock size={11} aria-hidden="true" />
                Em breve
              </span>
            )}
          </div>

          <h2 className="font-heading text-xl sm:text-2xl font-bold text-white leading-tight">
            {selected?.titulo}
          </h2>

          {selected?.descricao && (
            <p className="text-white/50 font-body text-sm leading-relaxed mt-2">
              {selected.descricao}
            </p>
          )}
        </div>
      </section>

      {/* ── Playlist column ─────────────────────────────────────── */}
      <aside
        className="border-t border-white/8 lg:border-t-0 lg:border-l lg:border-white/8 lg:sticky lg:top-[65px] lg:h-[calc(100dvh-65px)] lg:overflow-y-auto"
        aria-label="Playlist da semana"
      >
        <div className="px-5 py-4 border-b border-white/8 sticky top-0 bg-dark/95 backdrop-blur-sm z-10">
          <p className="font-heading font-bold text-white text-sm leading-tight">
            Semana Elegância na Prática
          </p>
          <p className="text-white/35 text-xs font-body mt-0.5">
            {videos.length} aulas
          </p>
        </div>

        <ul className="divide-y divide-white/5" role="list">
          {videos.map((video, i) => {
            const state = getVideoState(video)
            const isActive = i === selectedIndex
            const isLocked = state === 'locked'
            const isScheduled = state === 'scheduled'
            const isNotClickable = state !== 'available'

            return (
              <li key={video.id}>
                <button
                  type="button"
                  onClick={() => selectVideo(i)}
                  disabled={isNotClickable}
                  aria-current={isActive ? 'true' : undefined}
                  aria-label={
                    isLocked
                      ? `${video.dia}: ${video.titulo} — bloqueado`
                      : isScheduled
                        ? `${video.dia}: ${video.titulo} — em breve`
                        : isActive
                          ? `${video.dia}: ${video.titulo} — reproduzindo`
                          : `${video.dia}: ${video.titulo}`
                  }
                  className={cn(
                    'w-full flex gap-3 p-4 text-left transition-colors duration-150',
                    'border-l-[3px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset',
                    isActive
                      ? 'bg-primary/10 border-primary'
                      : 'hover:bg-white/5 border-transparent',
                    isNotClickable && 'cursor-not-allowed',
                  )}
                >
                  {/* Thumbnail */}
                  <div className="relative shrink-0 w-[72px] sm:w-[88px] aspect-video rounded-lg overflow-hidden bg-white/5">
                    {video.youtubeId ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`}
                        alt=""
                        aria-hidden="true"
                        className={cn(
                          'w-full h-full object-cover transition-opacity',
                          isScheduled && 'grayscale',
                          isActive
                            ? 'opacity-70'
                            : isLocked
                              ? 'opacity-30'
                              : isScheduled
                                ? 'opacity-50'
                                : 'opacity-80',
                        )}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Lock size={13} className="text-white/20" aria-hidden="true" />
                      </div>
                    )}

                    {/* Playing overlay */}
                    {isActive && !isNotClickable && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full bg-primary/80 flex items-center justify-center shadow-lg">
                          <Play size={12} className="text-white fill-white ml-0.5" aria-hidden="true" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className="flex flex-col justify-center min-w-0 gap-0.5 flex-1">
                    <span
                      className={cn(
                        'text-[10px] font-semibold tracking-widest uppercase font-body',
                        isActive ? 'text-primary' : 'text-white/35',
                      )}
                    >
                      {video.dia}
                    </span>

                    <p
                      className={cn(
                        'font-body text-sm font-medium leading-snug line-clamp-2',
                        isActive ? 'text-white' : isNotClickable ? 'text-white/30' : 'text-white/65',
                      )}
                    >
                      {video.titulo}
                    </p>

                    {video.duracao && !isNotClickable && (
                      <span className="flex items-center gap-1 text-[10px] font-body text-white/25 mt-0.5">
                        <Clock size={9} aria-hidden="true" />
                        {video.duracao}
                      </span>
                    )}

                    {(isLocked || isScheduled) && (
                      <span className="text-[10px] font-body text-white/20 mt-0.5">Em breve</span>
                    )}
                  </div>
                </button>
              </li>
            )
          })}
        </ul>
      </aside>
    </div>
  )
}
