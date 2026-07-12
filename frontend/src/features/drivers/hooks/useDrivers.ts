import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import type { ID, QueryParams } from '@/types'
import { driversApi } from '../api/driversApi'
import type { DriverPayload } from '../types'

export const driverKeys = {
  all: ['drivers'] as const,
  list: (params?: QueryParams) => [...driverKeys.all, 'list', params] as const,
  assignable: () => [...driverKeys.all, 'assignable'] as const,
  detail: (id: ID) => [...driverKeys.all, 'detail', id] as const,
}

export function useDrivers(params?: QueryParams) {
  return useQuery({
    queryKey: driverKeys.list(params),
    queryFn: () => driversApi.list(params),
  })
}

export function useAssignableDrivers() {
  return useQuery({
    queryKey: driverKeys.assignable(),
    queryFn: () => driversApi.listAssignable(),
  })
}

export function useDriver(id: ID) {
  return useQuery({
    queryKey: driverKeys.detail(id),
    queryFn: () => driversApi.get(id),
    enabled: Boolean(id),
  })
}

export function useCreateDriver() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: DriverPayload) => driversApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: driverKeys.all }),
  })
}

export function useUpdateDriver() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: ID; payload: Partial<DriverPayload> }) =>
      driversApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: driverKeys.all }),
  })
}

export function useDeleteDriver() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: ID) => driversApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: driverKeys.all }),
  })
}
