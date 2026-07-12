package com.transitops.expense;
import com.transitops.common.AuditableEntity;
import com.transitops.vehicle.Vehicle;
import com.transitops.trip.Trip;
import com.transitops.driver.Driver;
import com.transitops.maintenance.MaintenanceLog;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDate;

/** An operational expense (toll, fine, permit, insurance, ...) optionally tied to a vehicle/trip. */
@Entity
@Table(name = "expenses")
public class Expense extends AuditableEntity {

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private ExpenseCategory category;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(length = 300)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vehicle_id")
    private Vehicle vehicle;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trip_id")
    private Trip trip;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id")
    private Driver driver;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maintenance_log_id")
    private MaintenanceLog maintenanceLog;

    @Column(name = "incurred_at", nullable = false)
    private LocalDate incurredAt = LocalDate.now();

    @Column(name = "is_approved", nullable = false)
    private boolean approved = false;

    protected Expense() {
    }

    public ExpenseCategory getCategory() {
        return category;
    }

    public void setCategory(ExpenseCategory category) {
        this.category = category;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public Trip getTrip() {
        return trip;
    }

    public void setTrip(Trip trip) {
        this.trip = trip;
    }

    public Driver getDriver() {
        return driver;
    }

    public void setDriver(Driver driver) {
        this.driver = driver;
    }

    public MaintenanceLog getMaintenanceLog() {
        return maintenanceLog;
    }

    public void setMaintenanceLog(MaintenanceLog maintenanceLog) {
        this.maintenanceLog = maintenanceLog;
    }

    public LocalDate getIncurredAt() {
        return incurredAt;
    }

    public void setIncurredAt(LocalDate incurredAt) {
        this.incurredAt = incurredAt;
    }

    public boolean isApproved() {
        return approved;
    }

    public void setApproved(boolean approved) {
        this.approved = approved;
    }
}
