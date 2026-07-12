package com.transitops.driver;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface DriverRepository extends JpaRepository<Driver, UUID> {

    boolean existsByLicenseNumberIgnoreCase(String licenseNumber);

    List<Driver> findByStatus(DriverStatus status);

    long countByStatus(DriverStatus status);
}
