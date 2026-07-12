package com.transitops.dto.response;

import java.util.List;

public record AuthResponse(
        String token,
        String tokenType,
        String email,
        List<String> roles,
        long expiresInMs
) {
    public static AuthResponse bearer(String token, String email, List<String> roles, long expiresInMs) {
        return new AuthResponse(token, "Bearer", email, roles, expiresInMs);
    }
}
