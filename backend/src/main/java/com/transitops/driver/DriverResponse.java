package com.transitops.driver;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record DriverResponse(
        UUID id,
        String name,
        String licenseNumber,
        String licenseCategory,
        LocalDate licenseExpiry,
        String contactNumber,
        BigDecimal safetyScore,
        DriverStatus status,
        Instant createdAt,
        Instant updatedAt
) {
    public static DriverResponse from(Driver d) {
        return new DriverResponse(
                d.getId(), d.getFullName(), d.getLicenseNumber(), d.getLicenseCategory(),
                d.getLicenseExpiry(), d.getContactNumber(), d.getSafetyScore(),
                d.getStatus(), d.getCreatedAt(), d.getUpdatedAt());
    }
}
