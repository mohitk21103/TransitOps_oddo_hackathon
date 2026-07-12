package com.transitops.dashboard;

import com.transitops.trip.Trip;
import com.transitops.trip.TripStatus;

import java.util.UUID;

/** Compact trip row for the dashboard's recent-trips table. */
public record RecentTripResponse(
        UUID id,
        String referenceCode,
        String vehicle,
        String driver,
        TripStatus status
) {
    public static RecentTripResponse from(Trip trip) {
        return new RecentTripResponse(
                trip.getId(),
                trip.getReferenceCode(),
                trip.getVehicle().getRegistrationNumber(),
                trip.getDriver().getFullName(),
                trip.getStatus());
    }
}
