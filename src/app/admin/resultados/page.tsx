import type { Metadata } from 'next'
import Link from 'next/link'
import { Users, CalendarCheck, Clock, ShoppingCart } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { supabase } from '@/lib/supabase'
import { EVENTO, EVENTO_TAG } from '@/constants/evento'

export const metadata: Metadata = {
  title: 'Resultados — Letícia Demétrio Admin',
  robots: { index: false, follow: false },
}

// This page reads live Supabase data through a client whose requests Next
// can't track for caching purposes — without this, the route gets statically
// baked in at build time and never reflects new rows.
export const dynamic = 'force-dynamic'

// Todo registro criado antes da troca de evento (Semana Elegância na Prática
// → O Mapa do Estilo Próprio) não tem a tag do evento novo — ver backfill em
// docs/sql-migrations.md. Qualquer linha que não seja do evento atual cai na
// aba "Antigo", pra nunca misturar os dois relatórios.
const LEGACY_LABEL = 'Semana Elegância na Prática (antigo)'

type Row = Record<string, string>

function isNovo(row: Row) {
  return row.evento === EVENTO_TAG
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="bg-white rounded-2xl border border-primary/10 shadow-sm px-6 py-10 text-center">
      <p className="text-muted font-body text-sm">{text}</p>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  border,
}: {
  icon: React.ReactNode
  label: string
  value: number
  border: string
}) {
  return (
    <div className={`bg-white rounded-2xl p-6 border-t-4 ${border} shadow-sm`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-muted text-xs font-body uppercase tracking-widest">{label}</p>
      </div>
      <p className="font-heading text-4xl font-bold text-dark">{value}</p>
    </div>
  )
}

function TableShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
      <div className="overflow-auto max-h-[1024px]">
        <table className="w-full text-sm font-body">{children}</table>
      </div>
    </div>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left px-5 py-3.5 text-muted font-semibold text-xs uppercase tracking-widest sticky top-0 z-10 bg-surface">
      {children}
    </th>
  )
}

// Leads de matrículas e lista de espera têm o mesmo formato (nome/e-mail/whatsapp).
function SimpleLeadsTable({ rows }: { rows: Row[] }) {
  return (
    <TableShell>
      <thead>
        <tr className="border-b border-primary/10 bg-surface">
          <Th>Data</Th>
          <Th>Nome</Th>
          <Th>E-mail</Th>
          <Th>WhatsApp</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-primary/6">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-surface/50 transition-colors">
            <td className="px-5 py-3.5 text-muted whitespace-nowrap">{formatDate(row.created_at)}</td>
            <td className="px-5 py-3.5 text-dark font-medium whitespace-nowrap">{row.nome}</td>
            <td className="px-5 py-3.5 text-subtle">{row.email}</td>
            <td className="px-5 py-3.5 text-subtle whitespace-nowrap">{row.whatsapp}</td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  )
}

function InscricoesTable({ rows }: { rows: Row[] }) {
  return (
    <TableShell>
      <thead>
        <tr className="border-b border-primary/10 bg-surface">
          <Th>Data</Th>
          <Th>Nome</Th>
          <Th>E-mail</Th>
          <Th>WhatsApp</Th>
          <Th>Origem (UTM)</Th>
        </tr>
      </thead>
      <tbody className="divide-y divide-primary/6">
        {rows.map((row) => (
          <tr key={row.id} className="hover:bg-surface/50 transition-colors">
            <td className="px-5 py-3.5 text-muted whitespace-nowrap">{formatDate(row.created_at)}</td>
            <td className="px-5 py-3.5 text-dark font-medium whitespace-nowrap">{row.nome}</td>
            <td className="px-5 py-3.5 text-subtle">{row.email}</td>
            <td className="px-5 py-3.5 text-subtle whitespace-nowrap">{row.whatsapp}</td>
            <td className="px-5 py-3.5 text-subtle whitespace-nowrap">
              {row.utm_source ? (
                <span
                  title={`source: ${row.utm_source || '—'} · medium: ${row.utm_medium || '—'} · campaign: ${row.utm_campaign || '—'} · content: ${row.utm_content || '—'} · term: ${row.utm_term || '—'}`}
                  className="inline-block text-xs font-semibold text-secondary bg-secondary/10 px-2.5 py-1 rounded-full cursor-help"
                >
                  {row.utm_source}
                </span>
              ) : (
                <span className="text-xs text-muted">—</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </TableShell>
  )
}

function EventoReport({
  inscricoes,
  matriculasLeads,
  listaEspera,
}: {
  inscricoes: Row[]
  matriculasLeads: Row[]
  listaEspera: Row[]
}) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={<CalendarCheck size={16} className="text-primary" aria-hidden="true" />} label="Inscrições" value={inscricoes.length} border="border-primary" />
        <StatCard icon={<ShoppingCart size={16} className="text-secondary" aria-hidden="true" />} label="Matrículas" value={matriculasLeads.length} border="border-secondary" />
        <StatCard icon={<Clock size={16} className="text-primary/70" aria-hidden="true" />} label="Lista de Espera" value={listaEspera.length} border="border-primary/40" />
      </div>

      <section aria-labelledby="inscricoes-titulo">
        <h2 id="inscricoes-titulo" className="font-heading font-bold text-dark text-lg mb-3">
          Inscrições no evento
        </h2>
        {inscricoes.length === 0 ? <EmptyState text="Nenhuma inscrição ainda." /> : <InscricoesTable rows={inscricoes} />}
      </section>

      <section aria-labelledby="matriculas-titulo">
        <h2 id="matriculas-titulo" className="font-heading font-bold text-dark text-lg mb-3">
          Leads de matrículas
        </h2>
        {matriculasLeads.length === 0 ? <EmptyState text="Nenhum lead de matrícula ainda." /> : <SimpleLeadsTable rows={matriculasLeads} />}
      </section>

      <section aria-labelledby="lista-espera-titulo">
        <h2 id="lista-espera-titulo" className="font-heading font-bold text-dark text-lg mb-3">
          Lista de espera
        </h2>
        {listaEspera.length === 0 ? <EmptyState text="Nenhuma entrada na lista de espera ainda." /> : <SimpleLeadsTable rows={listaEspera} />}
      </section>
    </div>
  )
}

export default async function ResultadosPage({
  searchParams,
}: {
  searchParams: Promise<{ aba?: string }>
}) {
  const [{ data: inscricoes }, { data: contacts }, { data: listaEspera }, { data: matriculasLeads }, params] = await Promise.all([
    supabase.from('inscricoes').select('*').order('created_at', { ascending: false }).limit(2000),
    supabase.from('contacts').select('*').order('created_at', { ascending: false }).limit(2000),
    supabase.from('lista_espera').select('*').order('created_at', { ascending: false }).limit(2000),
    supabase.from('matriculas_leads').select('*').order('created_at', { ascending: false }).limit(2000),
    searchParams,
  ])

  const aba = params.aba === 'antigo' ? 'antigo' : 'novo'
  const totalContacts = contacts?.length ?? 0

  const buckets = {
    novo: {
      inscricoes: (inscricoes ?? []).filter(isNovo),
      matriculasLeads: (matriculasLeads ?? []).filter(isNovo),
      listaEspera: (listaEspera ?? []).filter(isNovo),
    },
    antigo: {
      inscricoes: (inscricoes ?? []).filter((r) => !isNovo(r)),
      matriculasLeads: (matriculasLeads ?? []).filter((r) => !isNovo(r)),
      listaEspera: (listaEspera ?? []).filter((r) => !isNovo(r)),
    },
  }

  const TABS: { key: 'novo' | 'antigo'; label: string }[] = [
    { key: 'novo', label: EVENTO.nome },
    { key: 'antigo', label: LEGACY_LABEL },
  ]

  return (
    <div className="min-h-screen bg-surface">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Event tabs — keep old and new event data in separate, never-mixed reports */}
        <div className="flex gap-2 border-b border-primary/10">
          {TABS.map((tab) => {
            const active = aba === tab.key
            return (
              <Link
                key={tab.key}
                href={tab.key === 'novo' ? '/admin/resultados' : '/admin/resultados?aba=antigo'}
                className={`px-4 py-2.5 text-sm font-body font-semibold rounded-t-lg border-b-2 -mb-px transition-colors ${
                  active
                    ? 'border-primary text-primary bg-white'
                    : 'border-transparent text-muted hover:text-subtle'
                }`}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>

        <EventoReport {...buckets[aba]} />

        {/* Contacts table — general site contact form, not tied to a specific event */}
        <section aria-labelledby="contatos-titulo">
          <h2 id="contatos-titulo" className="font-heading font-bold text-dark text-lg mb-3">
            Formulários de contato
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-3">
            <StatCard icon={<Users size={16} className="text-secondary" aria-hidden="true" />} label="Contatos" value={totalContacts} border="border-secondary" />
          </div>

          {totalContacts === 0 ? (
            <EmptyState text="Nenhum contato ainda." />
          ) : (
            <TableShell>
              <thead>
                <tr className="border-b border-primary/10 bg-surface">
                  <Th>Data</Th>
                  <Th>Nome</Th>
                  <Th>E-mail</Th>
                  <Th>Telefone</Th>
                  <Th>Mensagem</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-primary/6">
                {contacts!.map((row: Row) => (
                  <tr key={row.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-5 py-3.5 text-muted whitespace-nowrap">{formatDate(row.created_at)}</td>
                    <td className="px-5 py-3.5 text-dark font-medium whitespace-nowrap">{row.name}</td>
                    <td className="px-5 py-3.5 text-subtle">{row.email}</td>
                    <td className="px-5 py-3.5 text-subtle whitespace-nowrap">{row.phone}</td>
                    <td className="px-5 py-3.5 text-subtle max-w-xs">
                      <span className="line-clamp-2" title={row.message}>{row.message}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
          )}
        </section>

      </main>
    </div>
  )
}
