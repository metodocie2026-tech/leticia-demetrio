'use client'

import { useState } from 'react'
import { CalendarCheck, PlayCircle, Globe, Link2, MessageCircle, Check, AlertCircle, ShoppingBag, Clock, Phone } from 'lucide-react'
import { cn } from '@/utils/cn'
import type { Settings } from '@/lib/settings'

type BoolKey = 'site_ativo' | 'evento_semana_ativo' | 'aulas_ativo' | 'matriculas_ativo' | 'lista_espera_ativo'
type StrKey = 'whatsapp_number' | 'whatsapp_group_url' | 'survey_url' | 'matriculas_video_url' | 'matriculas_cta_url'

const TOGGLES: {
  key: BoolKey
  label: string
  description: string
  route: string
  icon: React.ReactNode
}[] = [
  {
    key: 'site_ativo',
    label: 'Site Principal',
    description: 'Ativado, exibe o site normal em /. Desativado, redireciona para a página do evento.',
    route: '/',
    icon: <Globe size={16} aria-hidden="true" />,
  },
  {
    key: 'evento_semana_ativo',
    label: 'Página do Evento',
    description: 'Ativa /semana-elegancia-na-pratica. Desativado, redireciona para o site principal.',
    route: '/semana-elegancia-na-pratica',
    icon: <CalendarCheck size={16} aria-hidden="true" />,
  },
  {
    key: 'aulas_ativo',
    label: 'Replays das Aulas',
    description: 'Ativa /aulas. Desativado, redireciona para o site principal.',
    route: '/aulas',
    icon: <PlayCircle size={16} aria-hidden="true" />,
  },
  {
    key: 'matriculas_ativo',
    label: 'Matrículas Abertas',
    description: 'Ativa /semana-elegancia-na-pratica/matriculas-abertas. Desativado, redireciona para o site principal.',
    route: '/semana-elegancia-na-pratica/matriculas-abertas',
    icon: <ShoppingBag size={16} aria-hidden="true" />,
  },
  {
    key: 'lista_espera_ativo',
    label: 'Lista de Espera',
    description: 'Ativa /semana-elegancia-na-pratica/lista-de-espera. Desativado, redireciona para o site principal.',
    route: '/semana-elegancia-na-pratica/lista-de-espera',
    icon: <Clock size={16} aria-hidden="true" />,
  },
]

const URL_INPUTS: {
  key: StrKey
  label: string
  description: string
  placeholder: string
  icon: React.ReactNode
}[] = [
  {
    key: 'whatsapp_group_url',
    label: 'Link do grupo WhatsApp',
    description: 'URL do grupo que aparece no botão "Participar do Grupo" da página de confirmação.',
    placeholder: 'https://chat.whatsapp.com/...',
    icon: <MessageCircle size={16} aria-hidden="true" />,
  },
  {
    key: 'survey_url',
    label: 'Link da pesquisa (Resgatar prêmio)',
    description: 'URL do formulário que abre ao clicar em "Resgatar o seu presente".',
    placeholder: 'https://forms.gle/...',
    icon: <Link2 size={16} aria-hidden="true" />,
  },
]

async function patchSetting(payload: Partial<Settings>) {
  const res = await fetch('/api/admin/settings', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error()
}

export function SettingsPanel({ settings }: { settings: Settings }) {
  const [bools, setBools] = useState<Pick<Settings, BoolKey>>({
    site_ativo: settings.site_ativo,
    evento_semana_ativo: settings.evento_semana_ativo,
    aulas_ativo: settings.aulas_ativo,
    matriculas_ativo: settings.matriculas_ativo,
    lista_espera_ativo: settings.lista_espera_ativo,
  })
  const [toggleLoading, setToggleLoading] = useState<BoolKey | null>(null)
  const [toggleError, setToggleError] = useState<string | null>(null)

  const [urls, setUrls] = useState<Pick<Settings, StrKey>>({
    whatsapp_number: settings.whatsapp_number,
    whatsapp_group_url: settings.whatsapp_group_url,
    survey_url: settings.survey_url,
    matriculas_video_url: settings.matriculas_video_url,
    matriculas_cta_url: settings.matriculas_cta_url,
  })
  const [urlStatus, setUrlStatus] = useState<Record<StrKey, 'idle' | 'saving' | 'saved' | 'error'>>({
    whatsapp_number: 'idle',
    whatsapp_group_url: 'idle',
    survey_url: 'idle',
    matriculas_video_url: 'idle',
    matriculas_cta_url: 'idle',
  })

  async function toggle(key: BoolKey) {
    setToggleLoading(key)
    setToggleError(null)
    const newValue = !bools[key]
    try {
      await patchSetting({ [key]: newValue })
      setBools((prev) => ({ ...prev, [key]: newValue }))
    } catch {
      setToggleError('Não foi possível salvar. Tente novamente.')
    }
    setToggleLoading(null)
  }

  async function saveUrl(key: StrKey) {
    setUrlStatus((prev) => ({ ...prev, [key]: 'saving' }))
    try {
      await patchSetting({ [key]: urls[key] })
      setUrlStatus((prev) => ({ ...prev, [key]: 'saved' }))
      setTimeout(() => setUrlStatus((prev) => ({ ...prev, [key]: 'idle' })), 2500)
    } catch {
      setUrlStatus((prev) => ({ ...prev, [key]: 'error' }))
    }
  }

  return (
    <div className="space-y-8">

      {/* ── Page toggles ──────────────────────────────────────────── */}
      <section aria-labelledby="config-titulo">
        <h2 id="config-titulo" className="font-heading font-bold text-dark text-lg mb-3">
          Páginas
        </h2>

        <div className="bg-white rounded-2xl shadow-sm border border-primary/10 divide-y divide-primary/8">
          {TOGGLES.map((item) => {
            const isActive = bools[item.key]
            const isLoading = toggleLoading === item.key
            return (
              <div key={item.key} className="flex items-center justify-between gap-4 px-6 py-5">
                <div className="flex items-start gap-3 min-w-0">
                  <span className={cn('mt-0.5 shrink-0', isActive ? 'text-primary' : 'text-muted')}>
                    {item.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="font-body font-semibold text-dark text-sm">
                      {item.label}
                      <span className="ml-2 text-muted font-normal text-xs font-mono">{item.route}</span>
                    </p>
                    <p className="font-body text-xs text-muted mt-0.5 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => toggle(item.key)}
                  disabled={isLoading}
                  aria-label={`${isActive ? 'Desativar' : 'Ativar'} ${item.label}`}
                  className={cn(
                    'shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold font-body transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                    isActive
                      ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 focus-visible:ring-emerald-500'
                      : 'bg-subtle/10 text-subtle hover:bg-subtle/20 focus-visible:ring-subtle',
                    isLoading && 'opacity-50 cursor-not-allowed',
                  )}
                >
                  <span className={cn('w-1.5 h-1.5 rounded-full', isActive ? 'bg-emerald-500' : 'bg-muted')} aria-hidden="true" />
                  {isLoading ? 'Salvando…' : isActive ? 'Ativo' : 'Inativo'}
                </button>
              </div>
            )
          })}
        </div>

        {toggleError && (
          <p role="alert" className="text-xs font-body text-accent mt-2 text-right">{toggleError}</p>
        )}
      </section>

      {/* ── WhatsApp number ──────────────────────────────────────── */}
      <section aria-labelledby="whatsapp-titulo">
        <h2 id="whatsapp-titulo" className="font-heading font-bold text-dark text-lg mb-3">
          WhatsApp
        </h2>

        <div className="bg-white rounded-2xl shadow-sm border border-primary/10">
          <div className="px-6 py-5">
            <div className="flex items-start gap-3 mb-3">
              <span className="mt-0.5 shrink-0 text-primary"><Phone size={16} aria-hidden="true" /></span>
              <div>
                <p className="font-body font-semibold text-dark text-sm">Número do WhatsApp</p>
                <p className="font-body text-xs text-muted mt-0.5 leading-relaxed">
                  Número usado no botão flutuante e nos links do site. Formato internacional sem o +: <span className="font-mono">5511999999999</span>
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="tel"
                value={urls.whatsapp_number}
                onChange={(e) => setUrls((prev) => ({ ...prev, whatsapp_number: e.target.value }))}
                placeholder="5511999999999"
                className="flex-1 min-w-0 border border-primary/15 rounded-xl px-3 py-2 text-sm font-body text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface placeholder:text-muted/50"
              />
              <button
                type="button"
                onClick={() => saveUrl('whatsapp_number')}
                disabled={urlStatus.whatsapp_number === 'saving'}
                className={cn(
                  'shrink-0 px-4 py-2 rounded-xl text-xs font-semibold font-body transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 flex items-center justify-center min-w-[72px]',
                  urlStatus.whatsapp_number === 'saved'
                    ? 'bg-emerald-100 text-emerald-700'
                    : urlStatus.whatsapp_number === 'error'
                      ? 'bg-red-100 text-red-600'
                      : 'bg-primary text-white hover:brightness-110 disabled:opacity-50',
                )}
              >
                {urlStatus.whatsapp_number === 'saving' ? 'Salvando…' : urlStatus.whatsapp_number === 'saved' ? <Check size={14} /> : urlStatus.whatsapp_number === 'error' ? <AlertCircle size={14} /> : 'Salvar'}
              </button>
            </div>
            {urlStatus.whatsapp_number === 'error' && (
              <p role="alert" className="text-xs font-body text-accent mt-1.5">Erro ao salvar. Tente novamente.</p>
            )}
          </div>
        </div>
      </section>

      {/* ── Matriculas URL inputs ─────────────────────────────────── */}
      <section aria-labelledby="matriculas-links-titulo">
        <h2 id="matriculas-links-titulo" className="font-heading font-bold text-dark text-lg mb-3">
          Links da página de matrículas
        </h2>

        <div className="bg-white rounded-2xl shadow-sm border border-primary/10 divide-y divide-primary/8">
          {([
            {
              key: 'matriculas_video_url' as StrKey,
              label: 'URL do vídeo de abertura',
              description: 'Cole a URL do YouTube (ex: youtube.com/watch?v=...) que abre a página de matrículas.',
              placeholder: 'https://www.youtube.com/watch?v=...',
              icon: <PlayCircle size={16} aria-hidden="true" />,
            },
            {
              key: 'matriculas_cta_url' as StrKey,
              label: 'Link de compra (botão CTA)',
              description: 'URL externa para onde o botão "Quero garantir minha vaga" vai redirecionar.',
              placeholder: 'https://pay.hotmart.com/...',
              icon: <Link2 size={16} aria-hidden="true" />,
            },
          ] as const).map((item) => {
            const st = urlStatus[item.key]
            return (
              <div key={item.key} className="px-6 py-5">
                <div className="flex items-start gap-3 mb-3">
                  <span className="mt-0.5 shrink-0 text-primary">{item.icon}</span>
                  <div>
                    <p className="font-body font-semibold text-dark text-sm">{item.label}</p>
                    <p className="font-body text-xs text-muted mt-0.5 leading-relaxed">{item.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urls[item.key]}
                    onChange={(e) => setUrls((prev) => ({ ...prev, [item.key]: e.target.value }))}
                    placeholder={item.placeholder}
                    className="flex-1 min-w-0 border border-primary/15 rounded-xl px-3 py-2 text-sm font-body text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface placeholder:text-muted/50"
                  />
                  <button
                    type="button"
                    onClick={() => saveUrl(item.key)}
                    disabled={st === 'saving'}
                    className={cn(
                      'shrink-0 px-4 py-2 rounded-xl text-xs font-semibold font-body transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 flex items-center justify-center min-w-[72px]',
                      st === 'saved'
                        ? 'bg-emerald-100 text-emerald-700'
                        : st === 'error'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-primary text-white hover:brightness-110 disabled:opacity-50',
                    )}
                  >
                    {st === 'saving' ? 'Salvando…' : st === 'saved' ? <Check size={14} /> : st === 'error' ? <AlertCircle size={14} /> : 'Salvar'}
                  </button>
                </div>
                {st === 'error' && (
                  <p role="alert" className="text-xs font-body text-accent mt-1.5">Erro ao salvar. Tente novamente.</p>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* ── URL inputs ────────────────────────────────────────────── */}
      <section aria-labelledby="links-titulo">
        <h2 id="links-titulo" className="font-heading font-bold text-dark text-lg mb-3">
          Links da página de confirmação
        </h2>

        <div className="bg-white rounded-2xl shadow-sm border border-primary/10 divide-y divide-primary/8">
          {URL_INPUTS.map((item) => {
            const st = urlStatus[item.key]
            return (
              <div key={item.key} className="px-6 py-5">
                <div className="flex items-start gap-3 mb-3">
                  <span className="mt-0.5 shrink-0 text-primary">{item.icon}</span>
                  <div>
                    <p className="font-body font-semibold text-dark text-sm">{item.label}</p>
                    <p className="font-body text-xs text-muted mt-0.5 leading-relaxed">{item.description}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={urls[item.key]}
                    onChange={(e) => setUrls((prev) => ({ ...prev, [item.key]: e.target.value }))}
                    placeholder={item.placeholder}
                    className="flex-1 min-w-0 border border-primary/15 rounded-xl px-3 py-2 text-sm font-body text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface placeholder:text-muted/50"
                  />
                  <button
                    type="button"
                    onClick={() => saveUrl(item.key)}
                    disabled={st === 'saving'}
                    className={cn(
                      'shrink-0 px-4 py-2 rounded-xl text-xs font-semibold font-body transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 flex items-center justify-center min-w-[72px]',
                      st === 'saved'
                        ? 'bg-emerald-100 text-emerald-700'
                        : st === 'error'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-primary text-white hover:brightness-110 disabled:opacity-50',
                    )}
                  >
                    {st === 'saving' ? 'Salvando…' : st === 'saved' ? <Check size={14} /> : st === 'error' ? <AlertCircle size={14} /> : 'Salvar'}
                  </button>
                </div>

                {st === 'error' && (
                  <p role="alert" className="text-xs font-body text-accent mt-1.5">
                    Erro ao salvar. Tente novamente.
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </section>

    </div>
  )
}
