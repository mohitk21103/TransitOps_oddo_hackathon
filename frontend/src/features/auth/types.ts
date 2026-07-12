import type { ID } from '@/types'

/**
 * RBAC roles — these mirror the backend `RoleName` enum exactly (the values are
 * the raw role names returned by `/auth/me`). A user may hold several roles at
 * once (backend returns a `roles` array).
 */
export const Role = {
  FleetManager: 'FLEET_MANAGER',
  Dispatcher: 'DISPATCHER',
  SafetyOfficer: 'SAFETY_OFFICER',
  FinancialAnalyst: 'FINANCIAL_ANALYST',
} as const

export type Role = (typeof Role)[keyof typeof Role]

export const ROLE_LABELS: Record<Role, string> = {
  [Role.FleetManager]: 'Fleet Manager',
  [Role.Dispatcher]: 'Dispatcher',
  [Role.SafetyOfficer]: 'Safety Officer',
  [Role.FinancialAnalyst]: 'Financial Analyst',
}

/** Ordered role list for selectors. */
export const ROLE_OPTIONS = (Object.keys(ROLE_LABELS) as Role[]).map((value) => ({
  value,
  label: ROLE_LABELS[value],
}))

export interface User {
  id: ID
  email: string
  name: string
  active: boolean
  roles: Role[]
}

export interface Credentials {
  email: string
  password: string
}

/** Raw payload from `POST /api/auth/login`. */
export interface AuthResponse {
  token: string
  tokenType: string
  email: string
  roles: Role[]
  expiresInMs: number
}

/** Raw payload from `GET /api/auth/me` (backend `UserResponse`). */
export interface UserProfileDto {
  id: string
  name: string
  email: string
  role: string
}

export interface AuthSession {
  token: string
  user: User
}
