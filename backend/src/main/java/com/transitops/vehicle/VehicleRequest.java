package com.transitops.vehicle;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

/**
 * Create/update payload for a vehicle. Validation applies on create (@Valid);
 * update reuses the same shape and applies only the non-null fields (partial).
 */
public record VehicleRequest(
        @NotBlank String registrationNumber,
        @NotBlank String name,
        @NotNull VehicleType type,
        @NotNull @Positive BigDecimal maxLoadCapacity,
        @PositiveOrZero BigDecimal odometer,
        @PositiveOrZero BigDecimal acquisitionCost,
        VehicleStatus status,
        String region
) {
}
