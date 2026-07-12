package com.transitops.common;

import java.time.Instant;
import java.util.Map;

/**
 * Consistent error body returned by {@link GlobalExceptionHandler}.
 */
public record ApiError(
        boolean success,
        int status,
        String error,
        String message,
        String path,
        Map<String, String> details,   // field-level validation errors (frontend reads `details`)
        Instant timestamp
) {
    public static ApiError of(int status, String error, String message, String path, Map<String, String> details) {
        return new ApiError(false, status, error, message, path, details, Instant.now());
    }
}
