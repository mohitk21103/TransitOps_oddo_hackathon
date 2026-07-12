package com.transitops.common;

import java.time.Instant;
import java.util.Map;

/**
 * THE single response envelope for every API — success and error alike.
 * The frontend always parses this exact shape:
 * <pre>
 * {
 *   "success":   boolean,
 *   "data":      T | null,          // payload on success
 *   "message":   string | null,     // human-readable note / error text
 *   "details":   { field: msg } | null,  // field / rule errors (null on success)
 *   "timestamp": ISO-8601
 * }
 * </pre>
 */
public record ApiResponse<T>(
        boolean success,
        T data,
        String message,
        Map<String, String> details,
        Instant timestamp
) {

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, null, null, Instant.now());
    }

    public static <T> ApiResponse<T> ok(T data, String message) {
        return new ApiResponse<>(true, data, message, null, Instant.now());
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, null, message, null, Instant.now());
    }

    public static <T> ApiResponse<T> error(String message, Map<String, String> details) {
        return new ApiResponse<>(false, null, message, details, Instant.now());
    }
}
