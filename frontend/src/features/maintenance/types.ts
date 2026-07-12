import type { ID, ISODateString, Timestamps } from '@/types'

export const MaintenanceStatus = {
  Open: 'OPEN',
  Closed: 'CLOSED',
} as const

export type MaintenanceStatus =
  (typeof MaintenanceStatus)[keyof typeof MaintenanceStatus]

export const MAINTENANCE_STATUS_LABELS: Record<MaintenanceStatus, string> = {
  [MaintenanceStatus.Open]: 'Open',
  [MaintenanceStatus.Closed]: 'Closed',
}

export interface MaintenanceLog extends Timestamps {
  id: ID
  vehicleId: ID
  title: string
  description?: string
  cost: number
  status: MaintenanceStatus
  openedAt: ISODateString
  closedAt?: ISODateString
}

export type MaintenancePayload = Pick<
  MaintenanceLog,
  'vehicleId' | 'title' | 'description' | 'cost'
>
