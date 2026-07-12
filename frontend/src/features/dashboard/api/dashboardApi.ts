import { apiClient, ENDPOINTS } from '@/lib/api'
import type { ApiResponse } from '@/types'
import type { DashboardFilters, DashboardKpis } from '../types'

/** Drop empty filter values so "All" selections are sent as no filter. */
function toParams(filters?: DashboardFilters): Record<string, string> {
  if (!filters) return {}
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => Boolean(value)),
  ) as Record<string, string>
}

export const dashboardApi = {
  async getKpis(filters?: DashboardFilters): Promise<DashboardKpis> {
    const { data } = await apiClient.get<ApiResponse<DashboardKpis>>(
      ENDPOINTS.dashboard.kpis,
      { params: toParams(filters) },
    )
    return data.data
  },
}
