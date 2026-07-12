package com.transitops.vehicle.dto;
import com.transitops.vehicle.Vehicle;
import com.transitops.vehicle.VehicleType;
import com.transitops.vehicle.VehicleStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record VehicleResponse(
        UUID id,
        String registrationNumber,
        String name,
        VehicleType type,
        BigDecimal maxLoadCapacity,
        BigDecimal odometer,
        BigDecimal acquisitionCost,
        VehicleStatus status,
        String region,
        Instant createdAt,
        Instant updatedAt
) {
    public static VehicleResponse from(Vehicle v) {
        return new VehicleResponse(
                v.getId(), v.getRegistrationNumber(), v.getName(), v.getType(),
                v.getMaxLoadCapacityKg(), v.getOdometerKm(), v.getAcquisitionCost(),
                v.getStatus(), v.getRegion(), v.getCreatedAt(), v.getUpdatedAt());
    }
}
