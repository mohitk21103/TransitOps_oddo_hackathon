package com.transitops.role;

/**
 * The built-in RBAC roles. Roles are persisted in the {@code roles} table (so
 * custom roles can be added at runtime), but these standard ones are seeded on
 * startup and referenced in code via this enum.
 * The Spring Security authority is {@code ROLE_<name>}.
 */
public enum RoleName {
    ADMIN("Full access, user & role management"),
    MANAGER("Fleet oversight, reports & analytics"),
    DISPATCHER("Create and dispatch trips"),
    DRIVER("Limited: own trips and logs"),
    VIEWER("Read-only dashboards");

    public static final String AUTHORITY_PREFIX = "ROLE_";

    private final String description;

    RoleName(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public String authority() {
        return AUTHORITY_PREFIX + name();
    }
}
