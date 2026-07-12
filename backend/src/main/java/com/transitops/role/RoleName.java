package com.transitops.role;

/**
 * The built-in RBAC roles. Roles are persisted in the {@code roles} table (so
 * custom roles can be added at runtime), but these standard ones are seeded on
 * startup and referenced in code via this enum.
 * The Spring Security authority is {@code ROLE_<name>}.
 */
public enum RoleName {
    FLEET_MANAGER("Oversees fleet assets, maintenance, vehicle lifecycle and efficiency"),
    DISPATCHER("Creates trips, assigns vehicles and drivers, monitors active deliveries"),
    SAFETY_OFFICER("Ensures driver compliance, licence validity and safety scores"),
    FINANCIAL_ANALYST("Reviews expenses, fuel, maintenance costs and profitability");

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
