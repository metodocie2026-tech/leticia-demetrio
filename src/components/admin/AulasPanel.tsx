'use client'

import { useState } from 'react'
import { Video, CheckCircle, AlertCircle, Plus, Trash2 } from 'lucide-react'
import type { AulaVideo } from '@/constants/aulas'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'
type DeleteState = 'idle' | 'deleting' | 'error'

interface AulaItem extends AulaVideo {
  stableKey: string
  isNew: boolean
}

interface CardProps {
  video: AulaItem
  onSaved: (stableKey: string, realId: number) => void
  onDelete: (stableKey: string) => void
}

function AulaCard({ video, onSaved, onDelete }: CardProps) {
  const [dia, setDia] = useState(video.dia)
  const [titulo, setTitulo] = useState(video.titulo)
  const [youtubeId, setYoutubeId] = useState(video.youtubeId)
  const [duracao, setDuracao] = useState(video.duracao)
  const [descricao, setDescricao] = useState(video.descricao)
  const [releaseAt, setReleaseAt] = useState(video.releaseAt ? video.releaseAt.slice(0, 16) : '')
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [deleteState, setDeleteState] = useState<DeleteState>('idle')

  const numericId = video.isNew ? null : parseInt(video.id.replace('dia-', ''))

  const hasYoutubeId = Boolean(youtubeId)
  const isScheduled = hasYoutubeId && Boolean(releaseAt) && new Date(releaseAt) > new Date()
  const isAvailable = hasYoutubeId && !isScheduled

  const statusLabel = isScheduled ? 'Agendado' : isAvailable ? 'Disponível' : 'Em breve'
  const statusClass = isScheduled
    ? 'bg-yellow-50 text-yellow-700'
    : isAvailable
      ? 'bg-primary/10 text-primary'
      : 'bg-muted/15 text-muted'

  async function save() {
    setSaveState('saving')
    try {
      const payload = {
        ...(video.isNew ? {} : { id: numericId }),
        dia,
        titulo,
        youtube_id: youtubeId,
        duracao,
        descricao,
        release_at: releaseAt || null,
      }
      const res = await fetch('/api/admin/aulas', {
        method: video.isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      if (video.isNew) {
        const data: { id: number } = await res.json()
        onSaved(video.stableKey, data.id)
      }
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
    setTimeout(() => setSaveState('idle'), 3000)
  }

  async function handleDelete() {
    if (video.isNew) {
      onDelete(video.stableKey)
      return
    }
    setDeleteState('deleting')
    try {
      const res = await fetch(`/api/admin/aulas?id=${numericId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      onDelete(video.stableKey)
    } catch {
      setDeleteState('error')
      setTimeout(() => setDeleteState('idle'), 3000)
    }
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${isAvailable ? 'border-primary/30' : 'border-primary/10'}`}>
      <div className={`px-5 py-3 flex items-center justify-between ${isAvailable ? 'bg-primary/5' : 'bg-surface'}`}>
        <div className="flex items-center gap-2">
          <Video size={14} className={isAvailable ? 'text-primary' : 'text-muted'} aria-hidden="true" />
          <span className="font-body font-semibold text-sm text-dark">{dia || 'Nova aula'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-body font-semibold px-2.5 py-1 rounded-full ${statusClass}`}>
            {statusLabel}
          </span>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteState === 'deleting'}
            aria-label="Excluir aula"
            className="text-muted hover:text-red-500 p-1 rounded transition-colors disabled:opacity-50"
          >
            {deleteState === 'error'
              ? <AlertCircle size={14} className="text-red-500" aria-hidden="true" />
              : <Trash2 size={14} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-body font-semibold text-muted uppercase tracking-widest block mb-1">Dia</label>
            <input
              value={dia}
              onChange={(e) => setDia(e.target.value)}
              placeholder="Dia 1"
              className="w-full border border-primary/15 rounded-xl px-3 py-2 text-sm font-body text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface"
            />
          </div>
          <div>
            <label className="text-xs font-body font-semibold text-muted uppercase tracking-widest block mb-1">Duração</label>
            <input
              value={duracao}
              onChange={(e) => setDuracao(e.target.value)}
              placeholder="36min"
              className="w-full border border-primary/15 rounded-xl px-3 py-2 text-sm font-body text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-body font-semibold text-muted uppercase tracking-widest block mb-1">Título</label>
          <input
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Título da aula"
            className="w-full border border-primary/15 rounded-xl px-3 py-2 text-sm font-body text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-body font-semibold text-muted uppercase tracking-widest block mb-1">YouTube ID</label>
            <input
              value={youtubeId}
              onChange={(e) => setYoutubeId(e.target.value)}
              placeholder="dQw4w9WgXcQ"
              className="w-full border border-primary/15 rounded-xl px-3 py-2 text-sm font-body text-dark font-mono focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface"
            />
          </div>
          <div>
            <label className="text-xs font-body font-semibold text-muted uppercase tracking-widest block mb-1">Disponível em</label>
            <input
              type="datetime-local"
              value={releaseAt}
              onChange={(e) => setReleaseAt(e.target.value)}
              className="w-full border border-primary/15 rounded-xl px-3 py-2 text-sm font-body text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-body font-semibold text-muted uppercase tracking-widest block mb-1">Descrição</label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição curta da aula"
            rows={2}
            className="w-full border border-primary/15 rounded-xl px-3 py-2 text-sm font-body text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface resize-none"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs font-body">
            {saveState === 'saved' && (
              <span className="flex items-center gap-1.5 text-green-600">
                <CheckCircle size={13} aria-hidden="true" /> Salvo!
              </span>
            )}
            {saveState === 'error' && (
              <span className="flex items-center gap-1.5 text-red-500">
                <AlertCircle size={13} aria-hidden="true" /> Erro ao salvar
              </span>
            )}
          </span>
          <button
            type="button"
            onClick={save}
            disabled={saveState === 'saving'}
            className="bg-primary text-white text-xs font-body font-semibold px-4 py-2 rounded-xl hover:bg-accent transition-colors disabled:opacity-50"
          >
            {saveState === 'saving' ? 'Salvando...' : video.isNew ? 'Criar aula' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function AulasPanel({ videos: initialVideos }: { videos: AulaVideo[] }) {
  const [videos, setVideos] = useState<AulaItem[]>(() =>
    initialVideos.map((v) => ({ ...v, stableKey: v.id, isNew: false }))
  )

  function addVideo() {
    const key = `new-${Date.now()}`
    setVideos((prev) => [
      ...prev,
      {
        id: key,
        stableKey: key,
        dia: `Dia ${prev.length + 1}`,
        titulo: '',
        youtubeId: '',
        duracao: '',
        descricao: '',
        releaseAt: null,
        isNew: true,
      },
    ])
  }

  function onSaved(stableKey: string, realId: number) {
    setVideos((prev) =>
      prev.map((v) => v.stableKey === stableKey ? { ...v, id: `dia-${realId}`, isNew: false } : v)
    )
  }

  function onDelete(stableKey: string) {
    setVideos((prev) => prev.filter((v) => v.stableKey !== stableKey))
  }

  return (
    <section aria-labelledby="aulas-panel-titulo">
      <div className="flex items-center justify-between mb-3">
        <h2 id="aulas-panel-titulo" className="font-heading font-bold text-dark text-lg">
          Aulas ({videos.length})
        </h2>
        <button
          type="button"
          onClick={addVideo}
          className="flex items-center gap-1.5 bg-primary text-white text-xs font-body font-semibold px-4 py-2 rounded-xl hover:bg-accent transition-colors"
        >
          <Plus size={13} aria-hidden="true" />
          Nova aula
        </button>
      </div>

      {videos.length === 0 ? (
        <div className="bg-white rounded-2xl border border-primary/10 px-6 py-10 text-center">
          <p className="text-muted font-body text-sm">Nenhuma aula cadastrada ainda. Clique em &quot;Nova aula&quot; para começar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {videos.map((video) => (
            <AulaCard
              key={video.stableKey}
              video={video}
              onSaved={onSaved}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </section>
  )
}
