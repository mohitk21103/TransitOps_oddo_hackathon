package com.transitops.vehicle;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface VehicleRepository extends JpaRepository<Vehicle, UUID> {

    long countByStatus(VehicleStatus status);

    /**
     * Vehicle counts grouped by status, scoped by optional filters.
     * A null filter means "any" — so the same query powers the unfiltered
     * dashboard and any Vehicle Type / Status filter combination.
     * Returns rows of {@code [VehicleStatus, count]}.
     */
    @Query("""
            SELECT v.status, COUNT(v)
            FROM Vehicle v
            WHERE (:type IS NULL OR v.type = :type)
              AND (:status IS NULL OR v.status = :status)
            GROUP BY v.status
            """)
    List<Object[]> countGroupedByStatus(@Param("type") VehicleType type,
                                        @Param("status") VehicleStatus status);
    boolean existsByRegistrationNumberIgnoreCase(String registrationNumber);

    Optional<Vehicle> findByRegistrationNumberIgnoreCase(String registrationNumber);

    List<Vehicle> findByStatus(VehicleStatus status);

    long countByStatus(VehicleStatus status);
}
