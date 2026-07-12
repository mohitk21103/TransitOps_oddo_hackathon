import type { ISODateString } from '@/types'

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const numberFormatter = new Intl.NumberFormat('en-IN')

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

export function formatDate(value: ISODateString | null | undefined): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

/** Whole days from today until `value`; negative when already past. */
export function daysUntil(value: ISODateString): number {
  const target = new Date(value).getTime()
  const now = Date.now()
  return Math.ceil((target - now) / (1000 * 60 * 60 * 24))
}

export function formatDistance(km: number): string {
  return `${numberFormatter.format(km)} km`
}

export function percent(value: number, fractionDigits = 0): string {
  return `${value.toFixed(fractionDigits)}%`
}
