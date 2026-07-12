import { apiClient, createCrudApi, ENDPOINTS } from '@/lib/api'
import type { ApiResponse, ID } from '@/types'
import type { CompleteTripPayload, Trip, TripPayload } from '../types'

const crud = createCrudApi<Trip, TripPayload>(ENDPOINTS.trips.root)

/**
 * Trip lifecycle transitions are modeled as explicit server actions so the
 * backend can enforce business rules and cascade vehicle/driver status.
 */
export const tripsApi = {
  ...crud,

  async dispatch(id: ID): Promise<Trip> {
    const { data } = await apiClient.post<ApiResponse<Trip>>(
      ENDPOINTS.trips.dispatch(id),
    )
    return data.data
  },

  async complete(id: ID, payload: CompleteTripPayload): Promise<Trip> {
    const { data } = await apiClient.post<ApiResponse<Trip>>(
      ENDPOINTS.trips.complete(id),
      payload,
    )
    return data.data
  },

  async cancel(id: ID): Promise<Trip> {
    const { data } = await apiClient.post<ApiResponse<Trip>>(
      ENDPOINTS.trips.cancel(id),
    )
    return data.data
  },
}
