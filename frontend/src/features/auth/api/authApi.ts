import { apiClient, ENDPOINTS } from '@/lib/api'
import type { ApiResponse } from '@/types'
import type {
  AuthResponse,
  Credentials,
  Role,
  User,
  UserProfileDto,
} from '../types'

/** Map the backend user profile DTO onto the frontend `User` model. */
function toUser(dto: UserProfileDto): User {
  return {
    id: dto.id,
    email: dto.email,
    name: dto.name,
    active: true,
    roles: dto.role ? [dto.role as Role] : [],
  }
}

export const authApi = {
  async login(credentials: Credentials): Promise<AuthResponse> {
    const { data } = await apiClient.post<ApiResponse<AuthResponse>>(
      ENDPOINTS.auth.login,
      credentials,
    )
    return data.data
  },

  async me(): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<UserProfileDto>>(
      ENDPOINTS.auth.me,
    )
    return toUser(data.data)
  },
}
