package com.transitops.trip.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

/** Data captured when closing out a trip. */
public record CompleteTripRequest(
        @NotNull @PositiveOrZero BigDecimal endOdometer,
        @NotNull @PositiveOrZero BigDecimal fuelConsumed
) {
}
