import { apiClient } from './client'
import type { ApiResponse, ID, Paginated, QueryParams } from '@/types'

/**
 * Factory that builds a standard REST CRUD client for a resource, so each
 * feature only writes the endpoints unique to it.
 *
 * @param base - collection path from the endpoint registry, e.g. `"/vehicles"`.
 */
export function createCrudApi<TEntity, TPayload>(base: string) {
  return {
    async list(params?: QueryParams): Promise<Paginated<TEntity>> {
      const { data } = await apiClient.get<ApiResponse<Paginated<TEntity>>>(base, {
        params,
      })
      return data.data
    },

    async get(id: ID): Promise<TEntity> {
      const { data } = await apiClient.get<ApiResponse<TEntity>>(`${base}/${id}`)
      return data.data
    },

    async create(payload: TPayload): Promise<TEntity> {
      const { data } = await apiClient.post<ApiResponse<TEntity>>(base, payload)
      return data.data
    },

    async update(id: ID, payload: Partial<TPayload>): Promise<TEntity> {
      const { data } = await apiClient.patch<ApiResponse<TEntity>>(
        `${base}/${id}`,
        payload,
      )
      return data.data
    },

    async remove(id: ID): Promise<void> {
      await apiClient.delete(`${base}/${id}`)
    },
  }
}
