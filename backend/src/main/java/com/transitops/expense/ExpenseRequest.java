package com.transitops.expense;

import com.transitops.expense.ExpenseCategory;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record ExpenseRequest(
        UUID vehicleId,
        UUID tripId,
        @NotNull ExpenseCategory category,
        @NotNull @PositiveOrZero BigDecimal amount,
        String note,
        LocalDate date
) {
}
