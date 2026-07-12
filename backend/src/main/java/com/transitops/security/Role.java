package com.transitops.security;

/**
 * Application roles for Role-Based Access Control (RBAC).
 * Spring Security authorities are these names prefixed with {@code ROLE_}.
 */
public enum Role {
    ADMIN,        // full access, user & role management
    MANAGER,      // fleet oversight, reports & analytics
    DISPATCHER,   // create/dispatch trips
    DRIVER,       // limited: own trips / logs
    VIEWER;       // read-only dashboards

    public String authority() {
        return "ROLE_" + name();
    }
}
