/** Aggregated KPIs surfaced on the operations dashboard. */
export interface DashboardKpis {
  activeVehicles: number
  availableVehicles: number
  vehiclesInMaintenance: number
  activeTrips: number
  pendingTrips: number
  driversOnDuty: number
  fleetUtilization: number // percentage 0–100
}

export interface DashboardFilters {
  vehicleType?: string
  status?: string
  region?: string
}
