import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from '@/routes/paths'
import { authApi } from '../api/authApi'
import type { Credentials } from '../types'

/** Exposes auth state and login/logout actions to components. */
export function useAuth() {
  const navigate = useNavigate()
  const { user, isAuthenticated, setSession, clear, hasRole } = useAuthStore()

  const loginMutation = useMutation({
    mutationFn: (credentials: Credentials) => authApi.login(credentials),
    onSuccess: (session) => {
      setSession(session)
      navigate(ROUTES.dashboard, { replace: true })
    },
  })

  const logout = async () => {
    try {
      await authApi.logout()
    } finally {
      clear()
      navigate(ROUTES.login, { replace: true })
    }
  }

  return {
    user,
    isAuthenticated,
    hasRole,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout,
  }
}
