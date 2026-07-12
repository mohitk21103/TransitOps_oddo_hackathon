import { apiClient, createCrudApi, ENDPOINTS } from '@/lib/api'
import type { ApiResponse, ID } from '@/types'
import type { Vehicle, VehiclePayload, VehicleStatus } from '../types'

const crud = createCrudApi<Vehicle, VehiclePayload>(ENDPOINTS.vehicles.root)

export const vehiclesApi = {
  ...crud,

  /** Vehicles eligible for dispatch (Available only — excludes In Shop/Retired). */
  async listDispatchable(): Promise<Vehicle[]> {
    const { data } = await apiClient.get<ApiResponse<Vehicle[]>>(
      ENDPOINTS.vehicles.dispatchable,
    )
    return data.data
  },

  async updateStatus(id: ID, status: VehicleStatus): Promise<Vehicle> {
    return crud.update(id, { status })
  },
}
