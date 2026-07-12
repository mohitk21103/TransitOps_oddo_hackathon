import type { ID, ISODateString, Timestamps } from '@/types'

export const TripStatus = {
  Draft: 'DRAFT',
  Dispatched: 'DISPATCHED',
  Completed: 'COMPLETED',
  Cancelled: 'CANCELLED',
} as const

export type TripStatus = (typeof TripStatus)[keyof typeof TripStatus]

export const TRIP_STATUS_LABELS: Record<TripStatus, string> = {
  [TripStatus.Draft]: 'Draft',
  [TripStatus.Dispatched]: 'Dispatched',
  [TripStatus.Completed]: 'Completed',
  [TripStatus.Cancelled]: 'Cancelled',
}

export interface Trip extends Timestamps {
  id: ID
  source: string
  destination: string
  vehicleId: ID
  driverId: ID
  cargoWeight: number
  plannedDistance: number
  status: TripStatus
  startOdometer?: number
  endOdometer?: number
  fuelConsumed?: number
  revenue?: number
  dispatchedAt?: ISODateString
  completedAt?: ISODateString
}

/** Fields captured when creating a Draft trip. */
export type TripPayload = Pick<
  Trip,
  | 'source'
  | 'destination'
  | 'vehicleId'
  | 'driverId'
  | 'cargoWeight'
  | 'plannedDistance'
> & {
  revenue?: number
}

/** Data required to close out a trip. */
export interface CompleteTripPayload {
  endOdometer: number
  fuelConsumed: number
}
