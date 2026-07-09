'use client'

import { cn } from '@/utils/cn'

export const COUNTRIES = [
  { id: '55',   flag: '🇧🇷', name: 'Brasil',    code: '55' },
  { id: '1-us', flag: '🇺🇸', name: 'EUA',       code: '1'  },
  { id: '1-ca', flag: '🇨🇦', name: 'Canadá',    code: '1'  },
  { id: '52',   flag: '🇲🇽', name: 'México',    code: '52' },
  { id: '54',   flag: '🇦🇷', name: 'Argentina', code: '54' },
  { id: '57',   flag: '🇨🇴', name: 'Colômbia',  code: '57' },
  { id: '56',   flag: '🇨🇱', name: 'Chile',     code: '56' },
  { id: '51',   flag: '🇵🇪', name: 'Peru',      code: '51' },
  { id: '598',  flag: '🇺🇾', name: 'Uruguai',   code: '598'},
  { id: '58',   flag: '🇻🇪', name: 'Venezuela', code: '58' },
  { id: '593',  flag: '🇪🇨', name: 'Equador',   code: '593'},
  { id: '591',  flag: '🇧🇴', name: 'Bolívia',   code: '591'},
  { id: '595',  flag: '🇵🇾', name: 'Paraguai',  code: '595'},
]

export function getCountryCode(id: string): string {
  return COUNTRIES.find((c) => c.id === id)?.code ?? '55'
}

interface PhoneInputProps {
  value: string
  countryId: string
  onNumberChange: (value: string) => void
  onCountryChange: (id: string) => void
  error?: string
}

export function PhoneInput({ value, countryId, onNumberChange, onCountryChange, error }: PhoneInputProps) {
  const selected = COUNTRIES.find((c) => c.id === countryId) ?? COUNTRIES[0]

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-dark font-body">
        WhatsApp<span className="text-accent ml-1" aria-hidden="true">*</span>
      </label>
      <div
        className={cn(
          'flex items-stretch rounded-xl border bg-white overflow-hidden transition-all duration-200',
          error
            ? 'border-accent ring-2 ring-accent/20'
            : 'border-muted/40 hover:border-primary-medium focus-within:ring-2 focus-within:border-transparent focus-within:ring-primary',
        )}
      >
        {/* Country selector */}
        <div className="relative shrink-0 border-r border-muted/30">
          <select
            value={countryId}
            onChange={(e) => onCountryChange(e.target.value)}
            aria-label="Código do país"
            className="appearance-none h-full bg-surface pl-3 pr-7 py-3 text-sm font-body text-dark cursor-pointer focus:outline-none"
          >
            {COUNTRIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} +{c.code}
              </option>
            ))}
          </select>
          {/* Dropdown chevron */}
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted text-xs" aria-hidden="true">
            ▾
          </span>
        </div>

        {/* Number input */}
        <input
          type="tel"
          placeholder={selected.code === '55' ? '(11) 99999-9999' : '999 999 9999'}
          value={value}
          onChange={(e) => onNumberChange(e.target.value)}
          autoComplete="tel-national"
          required
          className="flex-1 min-w-0 px-4 py-3 bg-white text-sm font-body text-dark placeholder:text-muted outline-none"
        />
      </div>
      {error && (
        <p role="alert" className="text-xs text-accent font-body">{error}</p>
      )}
    </div>
  )
}
