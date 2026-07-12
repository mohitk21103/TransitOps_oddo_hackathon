package com.transitops.trip;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record TripResponse(
        UUID id,
        String source,
        String destination,
        UUID vehicleId,
        UUID driverId,
        BigDecimal cargoWeight,
        BigDecimal plannedDistance,
        TripStatus status,
        BigDecimal startOdometer,
        BigDecimal endOdometer,
        BigDecimal fuelConsumed,
        BigDecimal revenue,
        Instant dispatchedAt,
        Instant completedAt,
        Instant createdAt,
        Instant updatedAt
) {
    public static TripResponse from(Trip t) {
        return new TripResponse(
                t.getId(), t.getSource(), t.getDestination(),
                t.getVehicle().getId(), t.getDriver().getId(),
                t.getCargoWeightKg(), t.getPlannedDistanceKm(), t.getStatus(),
                t.getStartOdometerKm(), t.getEndOdometerKm(), t.getFuelConsumedL(), t.getRevenue(),
                t.getDispatchedAt(), t.getCompletedAt(), t.getCreatedAt(), t.getUpdatedAt());
    }
}
