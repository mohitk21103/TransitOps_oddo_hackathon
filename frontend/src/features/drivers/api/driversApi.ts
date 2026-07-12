import { apiClient, createCrudApi, ENDPOINTS } from '@/lib/api'
import type { ApiResponse } from '@/types'
import type { Driver, DriverPayload } from '../types'

const crud = createCrudApi<Driver, DriverPayload>(ENDPOINTS.drivers.root)

export const driversApi = {
  ...crud,

  /** Drivers eligible for assignment (Available, valid & unexpired license). */
  async listAssignable(): Promise<Driver[]> {
    const { data } = await apiClient.get<ApiResponse<Driver[]>>(
      ENDPOINTS.drivers.assignable,
    )
    return data.data
  },
}
