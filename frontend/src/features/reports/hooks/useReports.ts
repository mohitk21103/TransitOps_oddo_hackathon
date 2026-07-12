import { useQuery } from '@tanstack/react-query'
import { reportsApi } from '../api/reportsApi'

export const reportKeys = {
  all: ['reports'] as const,
  fleet: () => [...reportKeys.all, 'fleet'] as const,
}

export function useFleetReport() {
  return useQuery({
    queryKey: reportKeys.fleet(),
    queryFn: () => reportsApi.getFleetReport(),
  })
}
