'use client'

import { useState } from 'react'
import { Package, CheckCircle, AlertCircle, Plus, Trash2, ChevronDown } from 'lucide-react'
import { cn } from '@/utils/cn'
import { ICON_NAMES } from '@/constants/icons'
import { OfertaRepeatableListEditor } from '@/components/admin/OfertaRepeatableListEditor'
import type { Oferta, OfertaStep, OfertaFaqItem } from '@/types'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'
type DeleteState = 'idle' | 'deleting' | 'error'

interface OfertaItem extends Oferta {
  stableKey: string
  isNew: boolean
}

const inputClass =
  'w-full border border-primary/15 rounded-xl px-3 py-2 text-sm font-body text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 bg-surface'
const labelClass = 'text-xs font-body font-semibold text-muted uppercase tracking-widest block mb-1'

function stepsToRows(steps: OfertaStep[]): Record<string, string>[] {
  return steps.map((s) => ({ titulo: s.titulo, descricao: s.descricao }))
}
function rowsToSteps(rows: Record<string, string>[]): OfertaStep[] {
  return rows.map((r) => ({ titulo: r.titulo ?? '', descricao: r.descricao ?? '' }))
}
function faqToRows(faq: OfertaFaqItem[]): Record<string, string>[] {
  return faq.map((f) => ({ pergunta: f.pergunta, resposta: f.resposta }))
}
function rowsToFaq(rows: Record<string, string>[]): OfertaFaqItem[] {
  return rows.map((r) => ({ pergunta: r.pergunta ?? '', resposta: r.resposta ?? '' }))
}
function galeriaToRows(galeria: string[]): Record<string, string>[] {
  return galeria.map((path) => ({ path }))
}
function rowsToGaleria(rows: Record<string, string>[]): string[] {
  // Não filtra vazios aqui — isso é chamado a cada tecla digitada, e filtrar
  // removeria a linha recém-adicionada antes de dar tempo de escrever nela.
  // Linhas em branco são limpas só na hora de salvar (ver save()).
  return rows.map((r) => r.path ?? '')
}
function sobreToRows(sobre: string[]): Record<string, string>[] {
  return sobre.map((paragrafo) => ({ paragrafo }))
}
function rowsToSobre(rows: Record<string, string>[]): string[] {
  return rows.map((r) => r.paragrafo ?? '')
}

function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

interface CardProps {
  oferta: OfertaItem
  onSaved: (stableKey: string, realId: number) => void
  onDelete: (stableKey: string) => void
}

function OfertaAdminCard({ oferta, onSaved, onDelete }: CardProps) {
  const [titulo, setTitulo] = useState(oferta.titulo)
  const [tipo, setTipo] = useState(oferta.tipo)
  const [descricaoCurta, setDescricaoCurta] = useState(oferta.descricaoCurta)
  const [modalidade, setModalidade] = useState(oferta.modalidade)
  const [slug, setSlug] = useState(oferta.slug)
  const [icone, setIcone] = useState(oferta.icone)
  const [destaque, setDestaque] = useState(oferta.destaque)
  const [ativo, setAtivo] = useState(oferta.ativo)
  const [ordem, setOrdem] = useState(oferta.ordem)
  const [ctaTipo, setCtaTipo] = useState(oferta.ctaTipo)
  const [ctaUrl, setCtaUrl] = useState(oferta.ctaUrl)
  const [ctaMensagem, setCtaMensagem] = useState(oferta.ctaMensagem)
  const [ctaLabel, setCtaLabel] = useState(oferta.ctaLabel)
  const [sobre, setSobre] = useState(oferta.sobre)
  const [comoFunciona, setComoFunciona] = useState(oferta.comoFunciona)
  const [galeria, setGaleria] = useState(oferta.galeria)
  const [faq, setFaq] = useState(oferta.faq)
  const [seoTitulo, setSeoTitulo] = useState(oferta.seoTitulo)
  const [seoDescricao, setSeoDescricao] = useState(oferta.seoDescricao)
  const [investimentoNota, setInvestimentoNota] = useState(oferta.investimentoNota)

  const [detailsOpen, setDetailsOpen] = useState(false)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [deleteState, setDeleteState] = useState<DeleteState>('idle')

  async function save() {
    setSaveState('saving')
    try {
      const payload = {
        ...(oferta.isNew ? {} : { id: oferta.id }),
        tipo,
        modalidade,
        slug: slug || slugify(titulo),
        titulo,
        descricao_curta: descricaoCurta,
        icone,
        destaque,
        ordem,
        cta_tipo: ctaTipo,
        cta_url: ctaUrl,
        cta_mensagem: ctaMensagem,
        cta_label: ctaLabel,
        sobre: sobre.filter(Boolean),
        como_funciona: comoFunciona.filter((s) => s.titulo || s.descricao),
        galeria: galeria.filter(Boolean),
        faq: faq.filter((f) => f.pergunta || f.resposta),
        seo_titulo: seoTitulo,
        seo_descricao: seoDescricao,
        investimento_nota: investimentoNota,
        ativo,
      }
      const res = await fetch('/api/admin/ofertas', {
        method: oferta.isNew ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      if (oferta.isNew) {
        const data: { id: number } = await res.json()
        onSaved(oferta.stableKey, data.id)
      }
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
    setTimeout(() => setSaveState('idle'), 3000)
  }

  async function handleDelete() {
    if (oferta.isNew) {
      onDelete(oferta.stableKey)
      return
    }
    setDeleteState('deleting')
    try {
      const res = await fetch(`/api/admin/ofertas?id=${oferta.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      onDelete(oferta.stableKey)
    } catch {
      setDeleteState('error')
      setTimeout(() => setDeleteState('idle'), 3000)
    }
  }

  return (
    <div className={cn('bg-white rounded-2xl shadow-sm border overflow-hidden', ativo ? 'border-primary/30' : 'border-primary/10')}>
      <div className={cn('px-5 py-3 flex items-center justify-between gap-3', ativo ? 'bg-primary/5' : 'bg-surface')}>
        <div className="flex items-center gap-2 min-w-0">
          <Package size={14} className={ativo ? 'text-primary' : 'text-muted'} aria-hidden="true" />
          <span className="font-body font-semibold text-sm text-dark truncate">{titulo || 'Nova oferta'}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-body font-semibold px-2.5 py-1 rounded-full bg-muted/15 text-muted">
            {tipo === 'servico' ? 'Serviço' : 'Produto/Curso'}
          </span>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleteState === 'deleting'}
            aria-label="Excluir oferta"
            className="text-muted hover:text-red-500 p-1 rounded transition-colors disabled:opacity-50"
          >
            {deleteState === 'error' ? (
              <AlertCircle size={14} className="text-red-500" aria-hidden="true" />
            ) : (
              <Trash2 size={14} aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-3">
        <div>
          <label className={labelClass}>Título</label>
          <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Consultoria de Imagem" className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Descrição (aparece no card)</label>
          <textarea
            value={descricaoCurta}
            onChange={(e) => setDescricaoCurta(e.target.value)}
            rows={2}
            placeholder="Uma jornada de autoconhecimento para desenvolver um estilo autêntico..."
            className={cn(inputClass, 'resize-none')}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Tipo</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value as Oferta['tipo'])} className={inputClass}>
              <option value="servico">Serviço</option>
              <option value="produto_curso">Produto/Curso</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Modalidade</label>
            <select value={modalidade} onChange={(e) => setModalidade(e.target.value as Oferta['modalidade'])} className={inputClass}>
              <option value="online">Online</option>
              <option value="presencial">Presencial</option>
              <option value="ambos">Presencial & Online</option>
              <option value="digital">Digital (ebook, curso gravado)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 items-end">
          <label className="flex items-center gap-2 text-sm font-body text-dark">
            <input type="checkbox" checked={destaque} onChange={(e) => setDestaque(e.target.checked)} className="rounded" />
            Destaque
          </label>
          <label className="flex items-center gap-2 text-sm font-body text-dark">
            <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} className="rounded" />
            Ativo
          </label>
          <div>
            <label className={labelClass}>Ordem</label>
            <input
              type="number"
              value={ordem}
              onChange={(e) => setOrdem(Number(e.target.value))}
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => setDetailsOpen((o) => !o)}
          className="flex items-center gap-1.5 text-xs font-body font-semibold text-primary hover:text-accent transition-colors self-start"
        >
          <ChevronDown size={14} className={cn('transition-transform', detailsOpen && 'rotate-180')} aria-hidden="true" />
          {detailsOpen ? 'Ocultar detalhes' : 'Editar detalhes'}
        </button>

        {detailsOpen && (
          <div className="flex flex-col gap-4 pt-2 border-t border-neutral">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Slug (URL da página)</label>
                <input
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                  placeholder={slugify(titulo) || 'minha-oferta'}
                  className={cn(inputClass, 'font-mono')}
                />
              </div>
              <div>
                <label className={labelClass}>Ícone</label>
                <select value={icone} onChange={(e) => setIcone(e.target.value)} className={inputClass}>
                  <option value="">Nenhum</option>
                  {ICON_NAMES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Investimento (opcional — ex: &quot;A partir de R$450&quot;)</label>
              <input value={investimentoNota} onChange={(e) => setInvestimentoNota(e.target.value)} className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Tipo de ação (CTA)</label>
                <select value={ctaTipo} onChange={(e) => setCtaTipo(e.target.value as Oferta['ctaTipo'])} className={inputClass}>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="link">Link de venda externo</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Texto do botão (opcional)</label>
                <input value={ctaLabel} onChange={(e) => setCtaLabel(e.target.value)} placeholder="Comprar agora" className={inputClass} />
              </div>
            </div>

            {ctaTipo === 'link' ? (
              <div>
                <label className={labelClass}>Link de venda</label>
                <input value={ctaUrl} onChange={(e) => setCtaUrl(e.target.value)} placeholder="https://..." className={inputClass} />
              </div>
            ) : (
              <div>
                <label className={labelClass}>Mensagem do WhatsApp (opcional)</label>
                <textarea
                  value={ctaMensagem}
                  onChange={(e) => setCtaMensagem(e.target.value)}
                  rows={2}
                  placeholder={`Olá! Tenho interesse em "${titulo}".`}
                  className={cn(inputClass, 'resize-none')}
                />
              </div>
            )}

            <OfertaRepeatableListEditor
              label="Sobre (parágrafos de apresentação)"
              items={sobreToRows(sobre)}
              fields={[{ key: 'paragrafo', label: 'Parágrafo', multiline: true }]}
              onChange={(rows) => setSobre(rowsToSobre(rows))}
              emptyText="Nenhum parágrafo cadastrado."
            />

            <OfertaRepeatableListEditor
              label="Como funciona"
              items={stepsToRows(comoFunciona)}
              fields={[
                { key: 'titulo', label: 'Título do passo', placeholder: 'Ex: Diagnóstico inicial' },
                { key: 'descricao', label: 'Descrição do passo', multiline: true },
              ]}
              onChange={(rows) => setComoFunciona(rowsToSteps(rows))}
              emptyText="Nenhum passo cadastrado."
            />

            <OfertaRepeatableListEditor
              label="Galeria (atendimentos já realizados)"
              items={galeriaToRows(galeria)}
              fields={[{ key: 'path', label: 'Caminho da imagem', placeholder: '/images/ofertas/slug/1.jpg' }]}
              onChange={(rows) => setGaleria(rowsToGaleria(rows))}
              emptyText="Nenhuma imagem cadastrada."
            />

            <OfertaRepeatableListEditor
              label="Perguntas frequentes"
              items={faqToRows(faq)}
              fields={[
                { key: 'pergunta', label: 'Pergunta' },
                { key: 'resposta', label: 'Resposta', multiline: true },
              ]}
              onChange={(rows) => setFaq(rowsToFaq(rows))}
              emptyText="Nenhuma pergunta cadastrada."
            />

            <div>
              <label className={labelClass}>SEO — título da página</label>
              <input
                value={seoTitulo}
                onChange={(e) => setSeoTitulo(e.target.value)}
                placeholder={titulo}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>SEO — descrição da página</label>
              <textarea
                value={seoDescricao}
                onChange={(e) => setSeoDescricao(e.target.value)}
                rows={2}
                className={cn(inputClass, 'resize-none')}
              />
            </div>
          </div>
        )}

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
            {saveState === 'saving' ? 'Salvando...' : oferta.isNew ? 'Criar oferta' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export function OfertasPanel({ ofertas: initialOfertas }: { ofertas: Oferta[] }) {
  const [ofertas, setOfertas] = useState<OfertaItem[]>(() =>
    initialOfertas.map((o) => ({ ...o, stableKey: `oferta-${o.id}`, isNew: false })),
  )

  function addOferta(tipo: Oferta['tipo']) {
    const key = `new-${Date.now()}`
    setOfertas((prev) => [
      ...prev,
      {
        id: 0,
        stableKey: key,
        isNew: true,
        tipo,
        modalidade: tipo === 'produto_curso' ? 'digital' : 'ambos',
        slug: '',
        titulo: '',
        descricaoCurta: '',
        icone: '',
        destaque: false,
        ordem: prev.filter((o) => o.tipo === tipo).length + 1,
        ctaTipo: 'whatsapp',
        ctaUrl: '',
        ctaMensagem: '',
        ctaLabel: '',
        sobre: [],
        comoFunciona: [],
        galeria: [],
        faq: [],
        seoTitulo: '',
        seoDescricao: '',
        investimentoNota: '',
        ativo: true,
      },
    ])
  }

  function onSaved(stableKey: string, realId: number) {
    setOfertas((prev) => prev.map((o) => (o.stableKey === stableKey ? { ...o, id: realId, isNew: false } : o)))
  }

  function onDelete(stableKey: string) {
    setOfertas((prev) => prev.filter((o) => o.stableKey !== stableKey))
  }

  const servicos = ofertas.filter((o) => o.tipo === 'servico')
  const produtos = ofertas.filter((o) => o.tipo === 'produto_curso')

  return (
    <div className="flex flex-col gap-10">
      <section aria-labelledby="servicos-panel-titulo">
        <div className="flex items-center justify-between mb-3">
          <h2 id="servicos-panel-titulo" className="font-heading font-bold text-dark text-lg">
            Serviços ({servicos.length})
          </h2>
          <button
            type="button"
            onClick={() => addOferta('servico')}
            className="flex items-center gap-1.5 bg-primary text-white text-xs font-body font-semibold px-4 py-2 rounded-xl hover:bg-accent transition-colors"
          >
            <Plus size={13} aria-hidden="true" />
            Novo serviço
          </button>
        </div>
        {servicos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-primary/10 px-6 py-10 text-center">
            <p className="text-muted font-body text-sm">Nenhum serviço cadastrado ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {servicos.map((oferta) => (
              <OfertaAdminCard key={oferta.stableKey} oferta={oferta} onSaved={onSaved} onDelete={onDelete} />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="produtos-panel-titulo">
        <div className="flex items-center justify-between mb-3">
          <h2 id="produtos-panel-titulo" className="font-heading font-bold text-dark text-lg">
            Produtos & Cursos ({produtos.length})
          </h2>
          <button
            type="button"
            onClick={() => addOferta('produto_curso')}
            className="flex items-center gap-1.5 bg-primary text-white text-xs font-body font-semibold px-4 py-2 rounded-xl hover:bg-accent transition-colors"
          >
            <Plus size={13} aria-hidden="true" />
            Novo produto/curso
          </button>
        </div>
        {produtos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-primary/10 px-6 py-10 text-center">
            <p className="text-muted font-body text-sm">Nenhum produto ou curso cadastrado ainda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {produtos.map((oferta) => (
              <OfertaAdminCard key={oferta.stableKey} oferta={oferta} onSaved={onSaved} onDelete={onDelete} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
