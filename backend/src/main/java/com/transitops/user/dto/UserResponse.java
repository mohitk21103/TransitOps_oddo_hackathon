package com.transitops.user.dto;
import com.transitops.user.User;
import com.transitops.role.Role;

import com.transitops.role.Role;

import java.util.List;
import java.util.UUID;

public record UserResponse(
        UUID id,
        String email,
        String fullName,
        boolean active,
        List<String> roles
) {
    public static UserResponse from(User user) {
        return new UserResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.isActive(),
                user.getRoles().stream().map(Role::getName).sorted().toList());
    }
}
