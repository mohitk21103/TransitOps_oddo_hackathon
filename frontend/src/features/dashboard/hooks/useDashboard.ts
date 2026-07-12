import { useQuery } from '@tanstack/react-query'
import { dashboardApi } from '../api/dashboardApi'
import type { DashboardFilters } from '../types'

export const dashboardKeys = {
  all: ['dashboard'] as const,
  kpis: (filters?: DashboardFilters) =>
    [...dashboardKeys.all, 'kpis', filters] as const,
}

export function useDashboardKpis(filters?: DashboardFilters) {
  return useQuery({
    queryKey: dashboardKeys.kpis(filters),
    queryFn: () => dashboardApi.getKpis(filters),
  })
}
