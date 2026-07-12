package com.transitops.fuel;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FuelRepository extends JpaRepository<FuelLog, UUID> {
}
