import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import type { ID, QueryParams } from '@/types'
import { vehicleKeys } from '@/features/vehicles'
import { maintenanceApi } from '../api/maintenanceApi'
import type { MaintenancePayload } from '../types'

export const maintenanceKeys = {
  all: ['maintenance'] as const,
  list: (params?: QueryParams) =>
    [...maintenanceKeys.all, 'list', params] as const,
}

export function useMaintenanceLogs(params?: QueryParams) {
  return useQuery({
    queryKey: maintenanceKeys.list(params),
    queryFn: () => maintenanceApi.list(params),
  })
}

function useCascadeInvalidate() {
  const qc = useQueryClient()
  return () => {
    qc.invalidateQueries({ queryKey: maintenanceKeys.all })
    qc.invalidateQueries({ queryKey: vehicleKeys.all })
  }
}

export function useCreateMaintenance() {
  const invalidate = useCascadeInvalidate()
  return useMutation({
    mutationFn: (payload: MaintenancePayload) => maintenanceApi.create(payload),
    onSuccess: invalidate,
  })
}

export function useCloseMaintenance() {
  const invalidate = useCascadeInvalidate()
  return useMutation({
    mutationFn: (id: ID) => maintenanceApi.close(id),
    onSuccess: invalidate,
  })
}
