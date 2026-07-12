import type { ID, ISODateString, Timestamps } from '@/types'

export interface FuelLog extends Timestamps {
  id: ID
  vehicleId: ID
  liters: number
  cost: number
  odometer?: number
  date: ISODateString
}

export type FuelLogPayload = Pick<
  FuelLog,
  'vehicleId' | 'liters' | 'cost' | 'odometer' | 'date'
>

export const ExpenseCategory = {
  Toll: 'TOLL',
  Maintenance: 'MAINTENANCE',
  Fuel: 'FUEL',
  Other: 'OTHER',
} as const

export type ExpenseCategory =
  (typeof ExpenseCategory)[keyof typeof ExpenseCategory]

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.Toll]: 'Toll',
  [ExpenseCategory.Maintenance]: 'Maintenance',
  [ExpenseCategory.Fuel]: 'Fuel',
  [ExpenseCategory.Other]: 'Other',
}

export interface Expense extends Timestamps {
  id: ID
  vehicleId?: ID
  tripId?: ID
  category: ExpenseCategory
  amount: number
  note?: string
  date: ISODateString
}

export type ExpensePayload = Pick<
  Expense,
  'vehicleId' | 'tripId' | 'category' | 'amount' | 'note' | 'date'
>
