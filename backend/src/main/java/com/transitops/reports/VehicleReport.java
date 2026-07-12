package com.transitops.reports;

import java.math.BigDecimal;
import java.util.UUID;

public record VehicleReport(
        UUID vehicleId,
        String registrationNumber,
        BigDecimal distance,
        BigDecimal fuelConsumed,
        BigDecimal fuelEfficiency,
        BigDecimal maintenanceCost,
        BigDecimal fuelCost,
        BigDecimal operationalCost,
        BigDecimal revenue,
        BigDecimal roi
) {
}
