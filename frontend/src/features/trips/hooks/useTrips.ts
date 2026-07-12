import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import type { ID, QueryParams } from '@/types'
import { vehicleKeys } from '@/features/vehicles'
import { driverKeys } from '@/features/drivers'
import { tripsApi } from '../api/tripsApi'
import type { CompleteTripPayload, TripPayload } from '../types'

export const tripKeys = {
  all: ['trips'] as const,
  list: (params?: QueryParams) => [...tripKeys.all, 'list', params] as const,
  detail: (id: ID) => [...tripKeys.all, 'detail', id] as const,
}

export function useTrips(params?: QueryParams) {
  return useQuery({
    queryKey: tripKeys.list(params),
    queryFn: () => tripsApi.list(params),
  })
}

export function useTrip(id: ID) {
  return useQuery({
    queryKey: tripKeys.detail(id),
    queryFn: () => tripsApi.get(id),
    enabled: Boolean(id),
  })
}

/** Invalidate trips plus vehicles/drivers, since transitions cascade status. */
function useCascadeInvalidate() {
  const qc = useQueryClient()
  return () => {
    qc.invalidateQueries({ queryKey: tripKeys.all })
    qc.invalidateQueries({ queryKey: vehicleKeys.all })
    qc.invalidateQueries({ queryKey: driverKeys.all })
  }
}

export function useCreateTrip() {
  const invalidate = useCascadeInvalidate()
  return useMutation({
    mutationFn: (payload: TripPayload) => tripsApi.create(payload),
    onSuccess: invalidate,
  })
}

export function useDispatchTrip() {
  const invalidate = useCascadeInvalidate()
  return useMutation({
    mutationFn: (id: ID) => tripsApi.dispatch(id),
    onSuccess: invalidate,
  })
}

export function useCompleteTrip() {
  const invalidate = useCascadeInvalidate()
  return useMutation({
    mutationFn: ({ id, payload }: { id: ID; payload: CompleteTripPayload }) =>
      tripsApi.complete(id, payload),
    onSuccess: invalidate,
  })
}

export function useCancelTrip() {
  const invalidate = useCascadeInvalidate()
  return useMutation({
    mutationFn: (id: ID) => tripsApi.cancel(id),
    onSuccess: invalidate,
  })
}
