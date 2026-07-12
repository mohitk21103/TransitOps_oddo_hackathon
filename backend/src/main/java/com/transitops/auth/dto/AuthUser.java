package com.transitops.auth.dto;
import com.transitops.user.User;

import com.transitops.user.User;

import java.util.UUID;

/**
 * The authenticated user as the SPA expects it: a single primary role.
 */
public record AuthUser(UUID id, String name, String email, String role) {

    public static AuthUser from(User user) {
        String role = user.getRoles().stream().findFirst()
                .map(r -> r.getName())
                .orElse(null);
        return new AuthUser(user.getId(), user.getFullName(), user.getEmail(), role);
    }
}
