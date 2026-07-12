package com.transitops.maintenance.dto;
import com.transitops.maintenance.MaintenanceLog;
import com.transitops.maintenance.MaintenanceStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record MaintenanceResponse(
        UUID id,
        UUID vehicleId,
        String title,
        String description,
        BigDecimal cost,
        MaintenanceStatus status,
        Instant openedAt,
        Instant closedAt,
        Instant createdAt,
        Instant updatedAt
) {
    public static MaintenanceResponse from(MaintenanceLog m) {
        return new MaintenanceResponse(
                m.getId(), m.getVehicle().getId(), m.getTitle(), m.getDescription(),
                m.getCost(), m.getStatus(), m.getOpenedAt(), m.getClosedAt(),
                m.getCreatedAt(), m.getUpdatedAt());
    }
}
