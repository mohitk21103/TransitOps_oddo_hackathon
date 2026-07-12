import type { ID } from '@/types'

/** RBAC roles as defined by the platform's target users. */
export const Role = {
  FleetManager: 'FLEET_MANAGER',
  Driver: 'DRIVER',
  SafetyOfficer: 'SAFETY_OFFICER',
  FinancialAnalyst: 'FINANCIAL_ANALYST',
} as const

export type Role = (typeof Role)[keyof typeof Role]

export const ROLE_LABELS: Record<Role, string> = {
  [Role.FleetManager]: 'Fleet Manager',
  [Role.Driver]: 'Driver',
  [Role.SafetyOfficer]: 'Safety Officer',
  [Role.FinancialAnalyst]: 'Financial Analyst',
}

export interface User {
  id: ID
  name: string
  email: string
  role: Role
}

export interface Credentials {
  email: string
  password: string
}

export interface AuthSession {
  token: string
  user: User
}
