package com.transitops.expense;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record ExpenseResponse(
        UUID id,
        UUID vehicleId,
        UUID tripId,
        ExpenseCategory category,
        BigDecimal amount,
        String note,
        LocalDate date,
        Instant createdAt,
        Instant updatedAt
) {
    public static ExpenseResponse from(Expense e) {
        return new ExpenseResponse(
                e.getId(),
                e.getVehicle() != null ? e.getVehicle().getId() : null,
                e.getTrip() != null ? e.getTrip().getId() : null,
                e.getCategory(), e.getAmount(), e.getDescription(), e.getIncurredAt(),
                e.getCreatedAt(), e.getUpdatedAt());
    }
}
