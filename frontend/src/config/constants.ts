/** Application-wide constants and defaults. */

export const APP = {
  name: 'TransitOps',
  tagline: 'Smart Transport Operations Platform',
} as const

export const STORAGE_KEYS = {
  authToken: 'transitops.auth.token',
  theme: 'transitops.theme',
} as const

export const QUERY_STALE_TIME = 30_000 // 30s

export const PAGE_SIZE = 10

/** Warn about licenses expiring within this many days. */
export const LICENSE_EXPIRY_WARNING_DAYS = 30
