import type { ID, Timestamps } from '@/types'

export const VehicleStatus = {
  Available: 'AVAILABLE',
  OnTrip: 'ON_TRIP',
  InShop: 'IN_SHOP',
  Retired: 'RETIRED',
} as const

export type VehicleStatus = (typeof VehicleStatus)[keyof typeof VehicleStatus]

export const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
  [VehicleStatus.Available]: 'Available',
  [VehicleStatus.OnTrip]: 'On Trip',
  [VehicleStatus.InShop]: 'In Shop',
  [VehicleStatus.Retired]: 'Retired',
}

export const VehicleType = {
  Truck: 'TRUCK',
  Van: 'VAN',
  Bus: 'BUS',
  Car: 'CAR',
  Pickup: 'PICKUP',
  Trailer: 'TRAILER',
} as const

export type VehicleType = (typeof VehicleType)[keyof typeof VehicleType]

export const VEHICLE_TYPE_LABELS: Record<VehicleType, string> = {
  [VehicleType.Truck]: 'Truck',
  [VehicleType.Van]: 'Van',
  [VehicleType.Bus]: 'Bus',
  [VehicleType.Car]: 'Car',
  [VehicleType.Pickup]: 'Pickup',
  [VehicleType.Trailer]: 'Trailer',
}

export interface Vehicle extends Timestamps {
  id: ID
  registrationNumber: string
  name: string
  type: VehicleType
  maxLoadCapacity: number
  odometer: number
  acquisitionCost: number
  status: VehicleStatus
  region?: string
}

export type VehiclePayload = Omit<
  Vehicle,
  'id' | 'status' | keyof Timestamps
> & {
  status?: VehicleStatus
}
