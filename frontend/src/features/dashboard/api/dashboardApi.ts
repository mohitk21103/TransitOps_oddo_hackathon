import { apiClient, ENDPOINTS } from '@/lib/api'
import type { ApiResponse } from '@/types'
import type { DashboardFilters, DashboardKpis } from '../types'

export const dashboardApi = {
  async getKpis(filters?: DashboardFilters): Promise<DashboardKpis> {
    const { data } = await apiClient.get<ApiResponse<DashboardKpis>>(
      ENDPOINTS.dashboard.kpis,
      { params: filters },
    )
    return data.data
  },
}
