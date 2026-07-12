package com.transitops.vehicle;
import com.transitops.common.AuditableEntity;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDate;

/** Fleet vehicle. Unique registration number; only AVAILABLE vehicles dispatch. */
@Entity
@Table(name = "vehicles")
public class Vehicle extends AuditableEntity {

    @Column(name = "registration_number", nullable = false, unique = true, length = 32)
    private String registrationNumber;

    @Column(nullable = false, length = 120)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private VehicleType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private VehicleStatus status = VehicleStatus.AVAILABLE;

    @Column(name = "max_load_capacity_kg", nullable = false)
    private BigDecimal maxLoadCapacityKg;

    @Column(name = "odometer_km", nullable = false)
    private BigDecimal odometerKm = BigDecimal.ZERO;

    @Column(name = "acquisition_cost", nullable = false)
    private BigDecimal acquisitionCost = BigDecimal.ZERO;

    @Column(name = "acquired_at")
    private LocalDate acquiredAt;

    protected Vehicle() {
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public VehicleType getType() {
        return type;
    }

    public void setType(VehicleType type) {
        this.type = type;
    }

    public VehicleStatus getStatus() {
        return status;
    }

    public void setStatus(VehicleStatus status) {
        this.status = status;
    }

    public BigDecimal getMaxLoadCapacityKg() {
        return maxLoadCapacityKg;
    }

    public void setMaxLoadCapacityKg(BigDecimal maxLoadCapacityKg) {
        this.maxLoadCapacityKg = maxLoadCapacityKg;
    }

    public BigDecimal getOdometerKm() {
        return odometerKm;
    }

    public void setOdometerKm(BigDecimal odometerKm) {
        this.odometerKm = odometerKm;
    }

    public BigDecimal getAcquisitionCost() {
        return acquisitionCost;
    }

    public void setAcquisitionCost(BigDecimal acquisitionCost) {
        this.acquisitionCost = acquisitionCost;
    }

    public LocalDate getAcquiredAt() {
        return acquiredAt;
    }

    public void setAcquiredAt(LocalDate acquiredAt) {
        this.acquiredAt = acquiredAt;
    }
}
