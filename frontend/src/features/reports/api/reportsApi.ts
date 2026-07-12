import { apiClient, ENDPOINTS } from '@/lib/api'
import type { ApiResponse } from '@/types'
import type { FleetReport } from '../types'

export const reportsApi = {
  async getFleetReport(): Promise<FleetReport> {
    const { data } = await apiClient.get<ApiResponse<FleetReport>>(
      ENDPOINTS.reports.fleet,
    )
    return data.data
  },
}
