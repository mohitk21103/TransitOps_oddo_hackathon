import { useEffect, useState, type ReactNode } from 'react'
import { FullPageSpinner } from '@/components/ui/Spinner'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/features/auth/api/authApi'

/**
 * On cold start, if a token exists in storage, hydrate the current user
 * before rendering routes so guards have an accurate session.
 */
export function AuthBootstrap({ children }: { children: ReactNode }) {
  const { token, user, setUser, clear } = useAuthStore()
  const [ready, setReady] = useState(!token)

  useEffect(() => {
    if (!token || user) {
      setReady(true)
      return
    }

    let active = true
    authApi
      .me()
      .then((me) => {
        if (active) setUser(me)
      })
      .catch(() => {
        if (active) clear()
      })
      .finally(() => {
        if (active) setReady(true)
      })

    return () => {
      active = false
    }
  }, [token, user, setUser, clear])

  if (!ready) return <FullPageSpinner />
  return <>{children}</>
}
