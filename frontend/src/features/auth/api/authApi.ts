import { apiClient, ENDPOINTS } from '@/lib/api'
import type { ApiResponse } from '@/types'
import type { AuthSession, Credentials, User } from '../types'

export const authApi = {
  async login(credentials: Credentials): Promise<AuthSession> {
    const { data } = await apiClient.post<ApiResponse<AuthSession>>(
      ENDPOINTS.auth.login,
      credentials,
    )
    return data.data
  },

  async me(): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<User>>(ENDPOINTS.auth.me)
    return data.data
  },

  async logout(): Promise<void> {
    await apiClient.post(ENDPOINTS.auth.logout)
  },
}
