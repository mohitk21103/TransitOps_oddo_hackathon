package com.transitops.maintenance;
import com.transitops.common.AuditableEntity;
import com.transitops.vehicle.Vehicle;

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
import java.time.LocalDate;

/** A maintenance record. An active (OPEN/IN_PROGRESS) record puts the vehicle IN_SHOP. */
@Entity
@Table(name = "maintenance_logs")
public class MaintenanceLog extends AuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vehicle_id", nullable = false)
    private Vehicle vehicle;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private MaintenanceType type;

    @Column(nullable = false, length = 300)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private MaintenanceStatus status = MaintenanceStatus.OPEN;

    @Column(nullable = false)
    private BigDecimal cost = BigDecimal.ZERO;

    @Column(name = "odometer_km")
    private BigDecimal odometerKm;

    @Column(name = "scheduled_for")
    private LocalDate scheduledFor;

    @Column(name = "opened_at", nullable = false)
    private Instant openedAt = Instant.now();

    @Column(name = "closed_at")
    private Instant closedAt;

    protected MaintenanceLog() {
    }

    public boolean isActive() {
        return status == MaintenanceStatus.OPEN || status == MaintenanceStatus.IN_PROGRESS;
    }

    public Vehicle getVehicle() {
        return vehicle;
    }

    public void setVehicle(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public MaintenanceType getType() {
        return type;
    }

    public void setType(MaintenanceType type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public MaintenanceStatus getStatus() {
        return status;
    }

    public void setStatus(MaintenanceStatus status) {
        this.status = status;
    }

    public BigDecimal getCost() {
        return cost;
    }

    public void setCost(BigDecimal cost) {
        this.cost = cost;
    }

    public BigDecimal getOdometerKm() {
        return odometerKm;
    }

    public void setOdometerKm(BigDecimal odometerKm) {
        this.odometerKm = odometerKm;
    }

    public LocalDate getScheduledFor() {
        return scheduledFor;
    }

    public void setScheduledFor(LocalDate scheduledFor) {
        this.scheduledFor = scheduledFor;
    }

    public Instant getOpenedAt() {
        return openedAt;
    }

    public void setOpenedAt(Instant openedAt) {
        this.openedAt = openedAt;
    }

    public Instant getClosedAt() {
        return closedAt;
    }

    public void setClosedAt(Instant closedAt) {
        this.closedAt = closedAt;
    }
}
