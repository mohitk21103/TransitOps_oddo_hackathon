package com.transitops.dashboard;

import com.transitops.vehicle.VehicleStatus;
import com.transitops.vehicle.VehicleType;

/**
 * Dashboard analytics read-model. Implemented by {@link DashboardServiceImpl}.
 */
public interface DashboardService {

    /**
     * Aggregated KPIs plus the recent-trips list, optionally scoped by the
     * Vehicle Type / Status / Region filters (pass {@code null} for a
     * fleet-wide view).
     */
    DashboardStatsResponse getStats(VehicleType type, VehicleStatus status, String region);
}
