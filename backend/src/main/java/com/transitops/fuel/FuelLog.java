package com.transitops.fuel;
import com.transitops.common.AuditableEntity;
import com.transitops.vehicle.Vehicle;
import com.transitops.driver.Driver;
import com.transitops.trip.Trip;

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

/** A refuelling event. total_cost is DB-computed (liters * cost_per_liter). */
@Entity
@Table(name = "fuel_logs")
public class FuelLog extends AuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id")
    private Trip trip;

    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type", nullable = false, length = 16)
    private FuelType fuelType;

    @Column(nullable = false)
    private BigDecimal liters;

    @Column(name = "cost_per_liter", nullable = false)
    private BigDecimal costPerLiter;

    @Column(name = "total_cost", insertable = false, updatable = false)
    private BigDecimal totalCost;

    @Column(name = "odometer_km")
    private BigDecimal odometerKm;

    @Column(name = "logged_at", nullable = false)
    private Instant loggedAt = Instant.now();

    protected FuelLog() {
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

    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }

    public FuelType getFuelType() {
        return fuelType;
    }

    public void setFuelType(FuelType fuelType) {
        this.fuelType = fuelType;
    }

    public BigDecimal getLiters() {
        return liters;
    }

    public void setLiters(BigDecimal liters) {
        this.liters = liters;
    }

    public BigDecimal getCostPerLiter() {
        return costPerLiter;
    }

    public void setCostPerLiter(BigDecimal costPerLiter) {
        this.costPerLiter = costPerLiter;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public BigDecimal getOdometerKm() {
        return odometerKm;
    }

    public void setOdometerKm(BigDecimal odometerKm) {
        this.odometerKm = odometerKm;
    }

    public Instant getLoggedAt() {
        return loggedAt;
    }

    public void setLoggedAt(Instant loggedAt) {
        this.loggedAt = loggedAt;
    }
}
