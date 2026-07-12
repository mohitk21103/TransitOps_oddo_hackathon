package com.transitops.dashboard;

import com.transitops.common.ApiResponse;
import com.transitops.vehicle.VehicleStatus;
import com.transitops.vehicle.VehicleType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Read-only dashboard analytics. Requires authentication (any role).
 * Optional filters: {@code vehicleType} and {@code status} scope the
 * vehicle-based KPIs; both may be omitted for a fleet-wide view.
 */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/kpis")
    public ApiResponse<DashboardStatsResponse> kpis(
            @RequestParam(required = false) VehicleType vehicleType,
            @RequestParam(required = false) VehicleStatus status) {
        return ApiResponse.ok(dashboardService.getStats(vehicleType, status));
    }
}
