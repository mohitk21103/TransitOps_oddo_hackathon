import type { ReactNode } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { QueryProvider } from './QueryProvider'
import { AuthBootstrap } from './AuthBootstrap'

/** Composes all app-wide providers in the correct order. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <BrowserRouter>
        <AuthBootstrap>{children}</AuthBootstrap>
      </BrowserRouter>
    </QueryProvider>
  )
}
