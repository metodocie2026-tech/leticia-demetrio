import type { Metadata } from 'next'
import { Users, CalendarCheck, Clock, ShoppingCart } from 'lucide-react'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { supabase } from '@/lib/supabase'

export const metadata: Metadata = {
  title: 'Resultados — Letícia Demétrio Admin',
  robots: { index: false, follow: false },
}

// This page reads live Supabase data through a client whose requests Next
// can't track for caching purposes — without this, the route gets statically
// baked in at build time and never reflects new rows.
export const dynamic = 'force-dynamic'

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

export default async function ResultadosPage() {
  const [{ data: inscricoes }, { data: contacts }, { data: listaEspera }, { data: matriculasLeads }] = await Promise.all([
    supabase.from('inscricoes').select('*').order('created_at', { ascending: false }).limit(500),
    supabase.from('contacts').select('*').order('created_at', { ascending: false }).limit(500),
    supabase.from('lista_espera').select('*').order('created_at', { ascending: false }).limit(500),
    supabase.from('matriculas_leads').select('*').order('created_at', { ascending: false }).limit(500),
  ])

  const totalInscricoes = inscricoes?.length ?? 0
  const totalContacts = contacts?.length ?? 0
  const totalListaEspera = listaEspera?.length ?? 0
  const totalMatriculasLeads = matriculasLeads?.length ?? 0

  return (
    <div className="min-h-screen bg-surface">
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-6 border-t-4 border-primary shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <CalendarCheck size={16} className="text-primary" aria-hidden="true" />
              <p className="text-muted text-xs font-body uppercase tracking-widest">Inscrições</p>
            </div>
            <p className="font-heading text-4xl font-bold text-dark">{totalInscricoes}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border-t-4 border-secondary shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-secondary" aria-hidden="true" />
              <p className="text-muted text-xs font-body uppercase tracking-widest">Contatos</p>
            </div>
            <p className="font-heading text-4xl font-bold text-dark">{totalContacts}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border-t-4 border-primary/40 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Clock size={16} className="text-primary/70" aria-hidden="true" />
              <p className="text-muted text-xs font-body uppercase tracking-widest">Lista de Espera</p>
            </div>
            <p className="font-heading text-4xl font-bold text-dark">{totalListaEspera}</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border-t-4 border-secondary shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingCart size={16} className="text-secondary" aria-hidden="true" />
              <p className="text-muted text-xs font-body uppercase tracking-widest">Matrículas</p>
            </div>
            <p className="font-heading text-4xl font-bold text-dark">{totalMatriculasLeads}</p>
          </div>
        </div>

        {/* Inscricoes table */}
        <section aria-labelledby="inscricoes-titulo">
          <h2 id="inscricoes-titulo" className="font-heading font-bold text-dark text-lg mb-3">
            Inscrições no evento
          </h2>

          {totalInscricoes === 0 ? (
            <EmptyState text="Nenhuma inscrição ainda." />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
              <div className="overflow-auto max-h-[1024px]">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b border-primary/10 bg-surface">
                      <th className="text-left px-5 py-3.5 text-muted font-semibold text-xs uppercase tracking-widest sticky top-0 z-10 bg-surface">Data</th>
                      <th className="text-left px-5 py-3.5 text-muted font-semibold text-xs uppercase tracking-widest sticky top-0 z-10 bg-surface">Nome</th>
                      <th className="text-left px-5 py-3.5 text-muted font-semibold text-xs uppercase tracking-widest sticky top-0 z-10 bg-surface">E-mail</th>
                      <th className="text-left px-5 py-3.5 text-muted font-semibold text-xs uppercase tracking-widest sticky top-0 z-10 bg-surface">WhatsApp</th>
                      <th className="text-left px-5 py-3.5 text-muted font-semibold text-xs uppercase tracking-widest sticky top-0 z-10 bg-surface">Evento</th>
                      <th className="text-left px-5 py-3.5 text-muted font-semibold text-xs uppercase tracking-widest sticky top-0 z-10 bg-surface">Origem (UTM)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/6">
                    {inscricoes!.map((row: Record<string, string>) => (
                      <tr key={row.id} className="hover:bg-surface/50 transition-colors">
                        <td className="px-5 py-3.5 text-muted whitespace-nowrap">{formatDate(row.created_at)}</td>
                        <td className="px-5 py-3.5 text-dark font-medium whitespace-nowrap">{row.nome}</td>
                        <td className="px-5 py-3.5 text-subtle">{row.email}</td>
                        <td className="px-5 py-3.5 text-subtle whitespace-nowrap">{row.whatsapp}</td>
                        <td className="px-5 py-3.5">
                          <span className="inline-block text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                            {row.evento}
                          </span>
                        </td>
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
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Matriculas leads table */}
        <section aria-labelledby="matriculas-titulo">
          <h2 id="matriculas-titulo" className="font-heading font-bold text-dark text-lg mb-3">
            Leads de matrículas
          </h2>

          {totalMatriculasLeads === 0 ? (
            <EmptyState text="Nenhum lead de matrícula ainda." />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
              <div className="overflow-auto max-h-[1024px]">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b border-primary/10 bg-surface">
                      <th className="text-left px-5 py-3.5 text-muted font-semibold text-xs uppercase tracking-widest sticky top-0 z-10 bg-surface">Data</th>
                      <th className="text-left px-5 py-3.5 text-muted font-semibold text-xs uppercase tracking-widest sticky top-0 z-10 bg-surface">Nome</th>
                      <th className="text-left px-5 py-3.5 text-muted font-semibold text-xs uppercase tracking-widest sticky top-0 z-10 bg-surface">E-mail</th>
                      <th className="text-left px-5 py-3.5 text-muted font-semibold text-xs uppercase tracking-widest sticky top-0 z-10 bg-surface">WhatsApp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/6">
                    {matriculasLeads!.map((row: Record<string, string>) => (
                      <tr key={row.id} className="hover:bg-surface/50 transition-colors">
                        <td className="px-5 py-3.5 text-muted whitespace-nowrap">{formatDate(row.created_at)}</td>
                        <td className="px-5 py-3.5 text-dark font-medium whitespace-nowrap">{row.nome}</td>
                        <td className="px-5 py-3.5 text-subtle">{row.email}</td>
                        <td className="px-5 py-3.5 text-subtle whitespace-nowrap">{row.whatsapp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Lista de espera table */}
        <section aria-labelledby="lista-espera-titulo">
          <h2 id="lista-espera-titulo" className="font-heading font-bold text-dark text-lg mb-3">
            Lista de espera
          </h2>

          {totalListaEspera === 0 ? (
            <EmptyState text="Nenhuma entrada na lista de espera ainda." />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
              <div className="overflow-auto max-h-[1024px]">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b border-primary/10 bg-surface">
                      <th className="text-left px-5 py-3.5 text-muted font-semibold text-xs uppercase tracking-widest sticky top-0 z-10 bg-surface">Data</th>
                      <th className="text-left px-5 py-3.5 text-muted font-semibold text-xs uppercase tracking-widest sticky top-0 z-10 bg-surface">Nome</th>
                      <th className="text-left px-5 py-3.5 text-muted font-semibold text-xs uppercase tracking-widest sticky top-0 z-10 bg-surface">E-mail</th>
                      <th className="text-left px-5 py-3.5 text-muted font-semibold text-xs uppercase tracking-widest sticky top-0 z-10 bg-surface">WhatsApp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/6">
                    {listaEspera!.map((row: Record<string, string>) => (
                      <tr key={row.id} className="hover:bg-surface/50 transition-colors">
                        <td className="px-5 py-3.5 text-muted whitespace-nowrap">{formatDate(row.created_at)}</td>
                        <td className="px-5 py-3.5 text-dark font-medium whitespace-nowrap">{row.nome}</td>
                        <td className="px-5 py-3.5 text-subtle">{row.email}</td>
                        <td className="px-5 py-3.5 text-subtle whitespace-nowrap">{row.whatsapp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        {/* Contacts table */}
        <section aria-labelledby="contatos-titulo">
          <h2 id="contatos-titulo" className="font-heading font-bold text-dark text-lg mb-3">
            Formulários de contato
          </h2>

          {totalContacts === 0 ? (
            <EmptyState text="Nenhum contato ainda." />
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-primary/10 overflow-hidden">
              <div className="overflow-auto max-h-[1024px]">
                <table className="w-full text-sm font-body">
                  <thead>
                    <tr className="border-b border-primary/10 bg-surface">
                      <th className="text-left px-5 py-3.5 text-muted font-semibold text-xs uppercase tracking-widest sticky top-0 z-10 bg-surface">Data</th>
                      <th className="text-left px-5 py-3.5 text-muted font-semibold text-xs uppercase tracking-widest sticky top-0 z-10 bg-surface">Nome</th>
                      <th className="text-left px-5 py-3.5 text-muted font-semibold text-xs uppercase tracking-widest sticky top-0 z-10 bg-surface">E-mail</th>
                      <th className="text-left px-5 py-3.5 text-muted font-semibold text-xs uppercase tracking-widest sticky top-0 z-10 bg-surface">Telefone</th>
                      <th className="text-left px-5 py-3.5 text-muted font-semibold text-xs uppercase tracking-widest sticky top-0 z-10 bg-surface">Mensagem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/6">
                    {contacts!.map((row: Record<string, string>) => (
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
                </table>
              </div>
            </div>
          )}
        </section>

      </main>
    </div>
  )
}
