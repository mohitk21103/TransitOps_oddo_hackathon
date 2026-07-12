package com.transitops.trip;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.util.UUID;

/** Payload for creating a Draft trip. */
public record TripRequest(
        @NotBlank String source,
        @NotBlank String destination,
        @NotNull UUID vehicleId,
        @NotNull UUID driverId,
        @NotNull @PositiveOrZero BigDecimal cargoWeight,
        @NotNull @PositiveOrZero BigDecimal plannedDistance,
        BigDecimal revenue
) {
}
