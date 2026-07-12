package com.transitops.dashboard;

import java.util.List;

/**
 * Aggregated operational KPIs for the dashboard. All figures are live counts
 * derived from the vehicle, trip and driver tables.
 */
public record DashboardStatsResponse(
        long activeVehicles,
        long availableVehicles,
        long vehiclesInMaintenance,
        long activeTrips,
        long pendingTrips,
        long driversOnDuty,
        double fleetUtilization,
        VehicleStatusBreakdown vehicleStatus,
        List<RecentTripResponse> recentTrips
) {
    /** Vehicle count by lifecycle status (powers the dashboard breakdown bars). */
    public record VehicleStatusBreakdown(
            long available,
            long onTrip,
            long inShop,
            long retired
    ) {
    }
}
