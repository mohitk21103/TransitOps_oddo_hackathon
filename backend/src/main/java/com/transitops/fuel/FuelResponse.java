package com.transitops.fuel;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.UUID;

public record FuelResponse(
        UUID id,
        UUID vehicleId,
        BigDecimal liters,
        BigDecimal cost,
        BigDecimal odometer,
        LocalDate date,
        Instant createdAt,
        Instant updatedAt
) {
    public static FuelResponse from(FuelLog f) {
        LocalDate date = f.getLoggedAt() != null
                ? LocalDate.ofInstant(f.getLoggedAt(), ZoneOffset.UTC) : null;
        return new FuelResponse(
                f.getId(), f.getVehicle().getId(), f.getLiters(), f.getCost(),
                f.getOdometerKm(), date, f.getCreatedAt(), f.getUpdatedAt());
    }
}
