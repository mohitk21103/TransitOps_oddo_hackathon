import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import type { ID, QueryParams } from '@/types'
import { vehiclesApi } from '../api/vehiclesApi'
import type { VehiclePayload } from '../types'

export const vehicleKeys = {
  all: ['vehicles'] as const,
  list: (params?: QueryParams) => [...vehicleKeys.all, 'list', params] as const,
  dispatchable: () => [...vehicleKeys.all, 'dispatchable'] as const,
  detail: (id: ID) => [...vehicleKeys.all, 'detail', id] as const,
}

export function useVehicles(params?: QueryParams) {
  return useQuery({
    queryKey: vehicleKeys.list(params),
    queryFn: () => vehiclesApi.list(params),
  })
}

export function useDispatchableVehicles() {
  return useQuery({
    queryKey: vehicleKeys.dispatchable(),
    queryFn: () => vehiclesApi.listDispatchable(),
  })
}

export function useVehicle(id: ID) {
  return useQuery({
    queryKey: vehicleKeys.detail(id),
    queryFn: () => vehiclesApi.get(id),
    enabled: Boolean(id),
  })
}

export function useCreateVehicle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: VehiclePayload) => vehiclesApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: vehicleKeys.all }),
  })
}

export function useUpdateVehicle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: ID; payload: Partial<VehiclePayload> }) =>
      vehiclesApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: vehicleKeys.all }),
  })
}

export function useDeleteVehicle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: ID) => vehiclesApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: vehicleKeys.all }),
  })
}
