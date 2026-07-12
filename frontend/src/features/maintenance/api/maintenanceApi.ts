import { apiClient, createCrudApi, ENDPOINTS } from '@/lib/api'
import type { ApiResponse, ID } from '@/types'
import type { MaintenanceLog, MaintenancePayload } from '../types'

const crud = createCrudApi<MaintenanceLog, MaintenancePayload>(
  ENDPOINTS.maintenance.root,
)

export const maintenanceApi = {
  ...crud,

  /** Closing a record restores the vehicle to Available (unless retired). */
  async close(id: ID): Promise<MaintenanceLog> {
    const { data } = await apiClient.post<ApiResponse<MaintenanceLog>>(
      ENDPOINTS.maintenance.close(id),
    )
    return data.data
  },
}
