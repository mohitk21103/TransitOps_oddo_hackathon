package com.transitops.driver;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.UUID;

public interface DriverRepository extends JpaRepository<Driver, UUID> {

    long countByStatus(DriverStatus status);

    long countByStatusIn(Collection<DriverStatus> statuses);
}
