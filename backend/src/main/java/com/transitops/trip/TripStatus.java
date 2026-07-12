package com.transitops.trip;

/** Trip lifecycle: DRAFT -> DISPATCHED -> COMPLETED | CANCELLED. */
public enum TripStatus {
    DRAFT,
    DISPATCHED,
    COMPLETED,
    CANCELLED
}
