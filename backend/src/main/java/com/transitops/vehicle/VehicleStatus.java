package com.transitops.vehicle;

/** Vehicle lifecycle state. Only AVAILABLE vehicles are eligible for dispatch. */
public enum VehicleStatus {
    AVAILABLE,
    ON_TRIP,
    IN_SHOP,
    RETIRED
}
