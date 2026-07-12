import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from '@/routes/paths'
import type { Role } from '../types'

interface ProtectedRouteProps {
  children: ReactNode
  /** When provided, the user must hold one of these roles. */
  roles?: Role[]
}

/** Route guard: enforces authentication and optional role-based access. */
export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const location = useLocation()
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.login} state={{ from: location }} replace />
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to={ROUTES.dashboard} replace />
  }

  return <>{children}</>
}
