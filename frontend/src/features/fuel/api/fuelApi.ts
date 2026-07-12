import { createCrudApi, ENDPOINTS } from '@/lib/api'
import type {
  Expense,
  ExpensePayload,
  FuelLog,
  FuelLogPayload,
} from '../types'

export const fuelApi = createCrudApi<FuelLog, FuelLogPayload>(
  ENDPOINTS.fuelLogs.root,
)

export const expensesApi = createCrudApi<Expense, ExpensePayload>(
  ENDPOINTS.expenses.root,
)
