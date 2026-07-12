package com.transitops.driver;

/** Driver availability. Only AVAILABLE drivers with a valid licence can be dispatched. */
public enum DriverStatus {
    AVAILABLE,
    ON_TRIP,
    OFF_DUTY,
    SUSPENDED
}
