package com.transitops.maintenance;

/** OPEN/IN_PROGRESS keep the vehicle IN_SHOP; CLOSED releases it. */
public enum MaintenanceStatus {
    OPEN,
    IN_PROGRESS,
    CLOSED
}
