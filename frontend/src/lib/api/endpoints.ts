import type { ID } from '@/types'

/**
 * Single source of truth for every backend endpoint path.
 * Paths are relative to `env.apiBaseUrl`. Nothing else in the codebase should
 * hardcode a URL string — features reference this registry instead.
 */
export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    me: '/auth/me',
    logout: '/auth/logout',
  },
  vehicles: {
    root: '/vehicles',
    dispatchable: '/vehicles/dispatchable',
  },
  drivers: {
    root: '/drivers',
    assignable: '/drivers/assignable',
  },
  trips: {
    root: '/trips',
    dispatch: (id: ID) => `/trips/${id}/dispatch`,
    complete: (id: ID) => `/trips/${id}/complete`,
    cancel: (id: ID) => `/trips/${id}/cancel`,
  },
  maintenance: {
    root: '/maintenance',
    close: (id: ID) => `/maintenance/${id}/close`,
  },
  fuelLogs: {
    root: '/fuel-logs',
  },
  expenses: {
    root: '/expenses',
  },
  dashboard: {
    kpis: '/dashboard/kpis',
  },
  reports: {
    fleet: '/reports/fleet',
  },
} as const
