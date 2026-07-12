package com.transitops.reports;

import java.math.BigDecimal;
import java.util.List;

public record FleetReport(
        double fleetUtilization,
        BigDecimal totalOperationalCost,
        BigDecimal totalRevenue,
        List<VehicleReport> vehicles
) {
}
