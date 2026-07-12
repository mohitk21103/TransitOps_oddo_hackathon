package com.transitops.trip;
import com.transitops.common.AuditableEntity;
import com.transitops.vehicle.Vehicle;
import com.transitops.driver.Driver;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;

/** A dispatch trip. Lifecycle DRAFT -> DISPATCHED -> COMPLETED | CANCELLED. */
@Entity
@Table(name = "trips")
public class Trip extends AuditableEntity {

    @Column(name = "reference_code", nullable = false, unique = true, length = 24)
    private String referenceCode;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "driver_id", nullable = false)
    private Driver driver;

    @Column(nullable = false, length = 160)
    private String source;

    @Column(nullable = false, length = 160)
    private String destination;

    @Column(name = "cargo_weight_kg", nullable = false)
    private BigDecimal cargoWeightKg;

    @Column(name = "planned_distance_km", nullable = false)
    private BigDecimal plannedDistanceKm;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private TripStatus status = TripStatus.DRAFT;

    @Column(nullable = false)
    private BigDecimal revenue = BigDecimal.ZERO;

    @Column(name = "start_odometer_km")
    private BigDecimal startOdometerKm;

    @Column(name = "end_odometer_km")
    private BigDecimal endOdometerKm;

    /** DB-computed (end - start); read-only. */
    @Column(name = "actual_distance_km", insertable = false, updatable = false)
    private BigDecimal actualDistanceKm;

    @Column(name = "fuel_consumed_l")
    private BigDecimal fuelConsumedL;

    @Column(name = "dispatched_at")
    private Instant dispatchedAt;

    @Column(name = "completed_at")
    private Instant completedAt;

    @Column(name = "cancelled_at")
    private Instant cancelledAt;

    protected Trip() {
    }

    public String getReferenceCode() {
        return referenceCode;
    }

    public void setReferenceCode(String referenceCode) {
        this.referenceCode = referenceCode;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public Driver getDriver() {
        return driver;
    }

    public void setDriver(Driver driver) {
        this.driver = driver;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public BigDecimal getCargoWeightKg() {
        return cargoWeightKg;
    }

    public void setCargoWeightKg(BigDecimal cargoWeightKg) {
        this.cargoWeightKg = cargoWeightKg;
    }

    public BigDecimal getPlannedDistanceKm() {
        return plannedDistanceKm;
    }

    public void setPlannedDistanceKm(BigDecimal plannedDistanceKm) {
        this.plannedDistanceKm = plannedDistanceKm;
    }

    public TripStatus getStatus() {
        return status;
    }

    public void setStatus(TripStatus status) {
        this.status = status;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }

    public BigDecimal getStartOdometerKm() {
        return startOdometerKm;
    }

    public void setStartOdometerKm(BigDecimal startOdometerKm) {
        this.startOdometerKm = startOdometerKm;
    }

    public BigDecimal getEndOdometerKm() {
        return endOdometerKm;
    }

    public void setEndOdometerKm(BigDecimal endOdometerKm) {
        this.endOdometerKm = endOdometerKm;
    }

    public BigDecimal getActualDistanceKm() {
        return actualDistanceKm;
    }

    public BigDecimal getFuelConsumedL() {
        return fuelConsumedL;
    }

    public void setFuelConsumedL(BigDecimal fuelConsumedL) {
        this.fuelConsumedL = fuelConsumedL;
    }

    public Instant getDispatchedAt() {
        return dispatchedAt;
    }

    public void setDispatchedAt(Instant dispatchedAt) {
        this.dispatchedAt = dispatchedAt;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Instant completedAt) {
        this.completedAt = completedAt;
    }

    public Instant getCancelledAt() {
        return cancelledAt;
    }

    public void setCancelledAt(Instant cancelledAt) {
        this.cancelledAt = cancelledAt;
    }
}
