import type { ID, ISODateString, Timestamps } from '@/types'

export const DriverStatus = {
  Available: 'AVAILABLE',
  OnTrip: 'ON_TRIP',
  OffDuty: 'OFF_DUTY',
  Suspended: 'SUSPENDED',
} as const

export type DriverStatus = (typeof DriverStatus)[keyof typeof DriverStatus]

export const DRIVER_STATUS_LABELS: Record<DriverStatus, string> = {
  [DriverStatus.Available]: 'Available',
  [DriverStatus.OnTrip]: 'On Trip',
  [DriverStatus.OffDuty]: 'Off Duty',
  [DriverStatus.Suspended]: 'Suspended',
}

export const LicenseCategory = {
  LMV: 'LMV',
  HMV: 'HMV',
  MCWG: 'MCWG',
  Transport: 'TRANSPORT',
} as const

export type LicenseCategory =
  (typeof LicenseCategory)[keyof typeof LicenseCategory]

export interface Driver extends Timestamps {
  id: ID
  name: string
  licenseNumber: string
  licenseCategory: LicenseCategory
  licenseExpiry: ISODateString
  contactNumber: string
  safetyScore: number
  status: DriverStatus
}

export type DriverPayload = Omit<Driver, 'id' | 'status' | keyof Timestamps> & {
  status?: DriverStatus
}
