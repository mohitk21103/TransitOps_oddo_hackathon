package com.transitops.auth.dto;

/**
 * Login response the SPA consumes: a bearer token + the user profile.
 */
public record AuthResponse(String token, AuthUser user) {
}
