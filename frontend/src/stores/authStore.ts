import { create } from 'zustand'
import { STORAGE_KEYS } from '@/config/constants'
import type { AuthSession, Role, User } from '@/features/auth/types'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setSession: (session: AuthSession) => void
  setUser: (user: User) => void
  clear: () => void
  hasRole: (...roles: Role[]) => boolean
}

/**
 * Client-side auth state. The token is mirrored into localStorage so the
 * Axios interceptor can read it on cold starts and page reloads.
 */
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: localStorage.getItem(STORAGE_KEYS.authToken),
  isAuthenticated: Boolean(localStorage.getItem(STORAGE_KEYS.authToken)),

  setSession: (session) => {
    localStorage.setItem(STORAGE_KEYS.authToken, session.token)
    set({ user: session.user, token: session.token, isAuthenticated: true })
  },

  setUser: (user) => set({ user }),

  clear: () => {
    localStorage.removeItem(STORAGE_KEYS.authToken)
    set({ user: null, token: null, isAuthenticated: false })
  },

  hasRole: (...roles) => {
    const { user } = get()
    return user ? roles.includes(user.role) : false
  },
}))
