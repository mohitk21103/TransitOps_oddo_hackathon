import type { ID } from '@/types'
import type { TripStatus } from '@/features/trips'

/** Vehicle count by lifecycle status (dashboard breakdown bars). */
export interface VehicleStatusBreakdown {
  available: number
  onTrip: number
  inShop: number
  retired: number
}

/** Compact trip row for the dashboard's recent-trips table. */
export interface RecentTrip {
  id: ID
  referenceCode: string
  vehicle: string
  driver: string
  status: TripStatus
}

/** Aggregated KPIs surfaced on the operations dashboard. */
export interface DashboardKpis {
  activeVehicles: number
  availableVehicles: number
  vehiclesInMaintenance: number
  activeTrips: number
  pendingTrips: number
  driversOnDuty: number
  fleetUtilization: number // percentage 0–100
  vehicleStatus: VehicleStatusBreakdown
  recentTrips: RecentTrip[]
}

export interface DashboardFilters {
  vehicleType?: string
  status?: string
  region?: string
}
