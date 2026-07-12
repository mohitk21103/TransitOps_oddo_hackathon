package com.transitops.driver.dto;
import com.transitops.driver.DriverStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record DriverRequest(
        @NotBlank String name,
        @NotBlank String licenseNumber,
        @NotBlank String licenseCategory,
        @NotNull LocalDate licenseExpiry,
        String contactNumber,
        BigDecimal safetyScore,
        DriverStatus status
) {
}
