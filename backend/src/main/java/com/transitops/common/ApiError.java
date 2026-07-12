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
        Map<String, String> fieldErrors,
        Instant timestamp
) {
    public static ApiError of(int status, String error, String message, String path, Map<String, String> fieldErrors) {
        return new ApiError(false, status, error, message, path, fieldErrors, Instant.now());
    }
}
