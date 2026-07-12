import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import type { QueryParams } from '@/types'
import { expensesApi, fuelApi } from '../api/fuelApi'
import type { ExpensePayload, FuelLogPayload } from '../types'

export const fuelKeys = {
  all: ['fuel-logs'] as const,
  list: (params?: QueryParams) => [...fuelKeys.all, 'list', params] as const,
}

export const expenseKeys = {
  all: ['expenses'] as const,
  list: (params?: QueryParams) => [...expenseKeys.all, 'list', params] as const,
}

export function useFuelLogs(params?: QueryParams) {
  return useQuery({
    queryKey: fuelKeys.list(params),
    queryFn: () => fuelApi.list(params),
  })
}

export function useCreateFuelLog() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: FuelLogPayload) => fuelApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: fuelKeys.all }),
  })
}

export function useExpenses(params?: QueryParams) {
  return useQuery({
    queryKey: expenseKeys.list(params),
    queryFn: () => expensesApi.list(params),
  })
}

export function useCreateExpense() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: ExpensePayload) => expensesApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: expenseKeys.all }),
  })
}
