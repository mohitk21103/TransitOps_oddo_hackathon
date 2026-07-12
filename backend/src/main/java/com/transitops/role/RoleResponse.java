package com.transitops.role;


import java.util.UUID;

public record RoleResponse(UUID id, String name, String description) {

    public static RoleResponse from(Role role) {
        return new RoleResponse(role.getId(), role.getName(), role.getDescription());
    }
}
