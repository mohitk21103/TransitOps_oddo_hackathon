/** Centralized route path registry — the single source of truth for URLs. */

export const ROUTES = {
  login: '/login',
  dashboard: '/',
  vehicles: '/vehicles',
  vehicleDetail: (id = ':id') => `/vehicles/${id}`,
  drivers: '/drivers',
  driverDetail: (id = ':id') => `/drivers/${id}`,
  trips: '/trips',
  tripDetail: (id = ':id') => `/trips/${id}`,
  maintenance: '/maintenance',
  fuel: '/fuel',
  reports: '/reports',
  settings: '/settings',
} as const
