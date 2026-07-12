import type { ID } from '@/types'

/**
 * Per-vehicle analytics row.
 * - fuelEfficiency = distance / fuel (km per litre)
 * - operationalCost = maintenance + fuel
 * - roi = (revenue - (maintenance + fuel)) / acquisitionCost
 */
export interface VehicleReport {
  vehicleId: ID
  registrationNumber: string
  distance: number
  fuelConsumed: number
  fuelEfficiency: number
  maintenanceCost: number
  fuelCost: number
  operationalCost: number
  revenue: number
  roi: number
}

export interface FleetReport {
  fleetUtilization: number
  totalOperationalCost: number
  totalRevenue: number
  vehicles: VehicleReport[]
}
