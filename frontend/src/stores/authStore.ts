import { create } from 'zustand'
import { STORAGE_KEYS } from '@/config/constants'
import type { Role, User } from '@/features/auth/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setToken: (token: string) => void
  setUser: (user: User) => void
  clear: () => void
  /** True if the user holds at least one of the given roles. */
  hasAnyRole: (...roles: Role[]) => boolean
}

/**
 * Client-side auth state. The token is mirrored into localStorage so the
 * Axios interceptor can read it on cold starts and page reloads.
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem(STORAGE_KEYS.authToken),
  isAuthenticated: Boolean(localStorage.getItem(STORAGE_KEYS.authToken)),

  setToken: (token) => {
    localStorage.setItem(STORAGE_KEYS.authToken, token)
    set({ token, isAuthenticated: true })
  },

  setUser: (user) => set({ user }),

  clear: () => {
    localStorage.removeItem(STORAGE_KEYS.authToken)
    set({ user: null, token: null, isAuthenticated: false })
  },

  hasAnyRole: (...roles) => {
    const { user } = get()
    return user?.roles?.some((role) => roles.includes(role)) ?? false
  },
}))
