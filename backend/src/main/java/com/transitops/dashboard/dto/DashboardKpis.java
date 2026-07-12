package com.transitops.dashboard.dto;

/** KPI figures for the operations dashboard (matches the frontend contract). */
public record DashboardKpis(
        long activeVehicles,
        long availableVehicles,
        long vehiclesInMaintenance,
        long activeTrips,
        long pendingTrips,
        long driversOnDuty,
        double fleetUtilization
) {
}
