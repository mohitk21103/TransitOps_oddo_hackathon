import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from '@/routes/paths'
import type { Role } from '../types'

interface ProtectedRouteProps {
  children: ReactNode
  /** When provided, the user must hold at least one of these roles. */
  roles?: Role[]
}

/** Route guard: enforces authentication and optional role-based access. */
export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthenticated, hasAnyRole } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />
  }

  if (roles && !hasAnyRole(...roles)) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  return <>{children}</>
}
