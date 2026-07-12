package com.transitops.trip;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface TripRepository extends JpaRepository<Trip, UUID> {

    long countByStatus(TripStatus status);

    List<Trip> findByStatus(TripStatus status);

    /**
     * Most recently created trips with vehicle and driver eagerly fetched
     * (avoids N+1 when building the dashboard's recent-trips table).
     */
    @Query("""
            SELECT t FROM Trip t
            JOIN FETCH t.vehicle
            JOIN FETCH t.driver
            ORDER BY t.createdAt DESC
            """)
    List<Trip> findRecent(Pageable pageable);
}
