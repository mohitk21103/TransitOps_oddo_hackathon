package com.transitops.fuel.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record FuelRequest(
        @NotNull UUID vehicleId,
        @NotNull @Positive BigDecimal liters,
        @NotNull @PositiveOrZero BigDecimal cost,
        BigDecimal odometer,
        LocalDate date
) {
}
