package com.transitops.maintenance;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface MaintenanceRepository extends JpaRepository<MaintenanceLog, UUID> {
}
