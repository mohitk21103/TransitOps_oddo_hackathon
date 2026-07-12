import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from '@/routes/paths'
import { authApi } from '../api/authApi'
import type { Credentials } from '../types'

/** Exposes auth state and login/logout actions to components. */
export function useAuth() {
  const navigate = useNavigate()
  const { user, isAuthenticated, setToken, setUser, clear, hasAnyRole } =
    useAuthStore()

  const loginMutation = useMutation({
    mutationFn: async (credentials: Credentials) => {
      // 1) Verify credentials and obtain the JWT.
      const { token } = await authApi.login(credentials)
      // 2) Persist the token so the interceptor authenticates the next call.
      setToken(token)
      // 3) Fetch the full authenticated profile.
      return authApi.me()
    },
    onSuccess: (profile) => {
      setUser(profile)
      navigate(ROUTES.dashboard, { replace: true })
    },
    onError: () => {
      // Roll back any half-established session (e.g. token set but /me failed).
      clear()
    },
  })

  // JWT is stateless — logging out is purely client-side.
  const logout = () => {
    clear()
    navigate(ROUTES.login, { replace: true })
  }

  return {
    user,
    isAuthenticated,
    hasAnyRole,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout,
  }
}
