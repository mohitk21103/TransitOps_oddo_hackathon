import type { ID } from '@/types'

/** RBAC roles as defined by the platform's target users. */
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
export const ROLE_OPTIONS = Object.entries(ROLE_LABELS).map(
  ([value, label]) => ({ value: value as Role, label }),
)

export interface User {
  id: ID
  name: string
  email: string
  role: Role
}

export interface Credentials {
  email: string
  password: string
  role: Role
}

export interface AuthSession {
  token: string
  user: User
}
