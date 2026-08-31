'use client'

import { Plus, Trash2 } from 'lucide-react'

export interface RepeatableField {
  key: string
  label: string
  placeholder?: string
  multiline?: boolean
}

interface OfertaRepeatableListEditorProps {
  label: string
  items: Record<string, string>[]
  fields: RepeatableField[]
  onChange: (items: Record<string, string>[]) => void
  emptyText: string
}

function emptyItem(fields: RepeatableField[]): Record<string, string> {
  return Object.fromEntries(fields.map((f) => [f.key, '']))
}

export function OfertaRepeatableListEditor({
  label,
  items,
  fields,
  onChange,
  emptyText,
}: OfertaRepeatableListEditorProps) {
  function updateItem(index: number, key: string, value: string) {
    onChange(items.map((item, i) => (i === index ? { ...item, [key]: value } : item)))
  }

  function removeItem(index: number) {
    onChange(items.filter((_, i) => i !== index))
  }

  function addItem() {
    onChange([...items, emptyItem(fields)])
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-body font-semibold text-muted uppercase tracking-widest">{label}</span>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1 text-xs font-body font-semibold text-primary hover:text-accent transition-colors"
        >
          <Plus size={12} aria-hidden="true" />
          Adicionar
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-muted font-body italic">{emptyText}</p>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 items-start bg-surface rounded-xl p-3">
              <div className="flex-1 flex flex-col gap-2">
                {fields.map((field) =>
                  field.multiline ? (
                    <textarea
                      key={field.key}
                      value={item[field.key] ?? ''}
                      onChange={(e) => updateItem(index, field.key, e.target.value)}
                      placeholder={field.placeholder ?? field.label}
                      rows={2}
                      className="w-full border border-primary/15 rounded-lg px-2.5 py-1.5 text-sm font-body text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white resize-none"
                    />
                  ) : (
                    <input
                      key={field.key}
                      value={item[field.key] ?? ''}
                      onChange={(e) => updateItem(index, field.key, e.target.value)}
                      placeholder={field.placeholder ?? field.label}
                      className="w-full border border-primary/15 rounded-lg px-2.5 py-1.5 text-sm font-body text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white"
                    />
                  ),
                )}
              </div>
              <button
                type="button"
                onClick={() => removeItem(index)}
                aria-label="Remover item"
                className="shrink-0 text-muted hover:text-red-500 p-1.5 rounded transition-colors"
              >
                <Trash2 size={14} aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
