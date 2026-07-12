package com.transitops.maintenance.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.util.UUID;

public record MaintenanceRequest(
        @NotNull UUID vehicleId,
        @NotBlank String title,
        String description,
        @NotNull @PositiveOrZero BigDecimal cost
) {
}
