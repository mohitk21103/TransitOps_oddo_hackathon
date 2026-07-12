package com.transitops.driver;
import com.transitops.common.AuditableEntity;
import com.transitops.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDate;

/** Driver profile. Optional link to a login {@link User}. */
@Entity
@Table(name = "drivers")
public class Driver extends AuditableEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(name = "full_name", nullable = false, length = 120)
    private String fullName;

    @Column(name = "license_number", nullable = false, unique = true, length = 48)
    private String licenseNumber;

    @Column(name = "license_category", nullable = false, length = 16)
    private String licenseCategory;

    @Column(name = "license_expiry", nullable = false)
    private LocalDate licenseExpiry;

    @Column(name = "contact_number", length = 20)
    private String contactNumber;

    @Column(name = "safety_score", nullable = false)
    private BigDecimal safetyScore = BigDecimal.valueOf(100);

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private DriverStatus status = DriverStatus.AVAILABLE;

    protected Driver() {
    }

    /** True when the licence is still valid on the given date. */
    public boolean hasValidLicense(LocalDate on) {
        return licenseExpiry != null && !licenseExpiry.isBefore(on);
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getLicenseNumber() {
        return licenseNumber;
    }

    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }

    public String getLicenseCategory() {
        return licenseCategory;
    }

    public void setLicenseCategory(String licenseCategory) {
        this.licenseCategory = licenseCategory;
    }

    public LocalDate getLicenseExpiry() {
        return licenseExpiry;
    }

    public void setLicenseExpiry(LocalDate licenseExpiry) {
        this.licenseExpiry = licenseExpiry;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public BigDecimal getSafetyScore() {
        return safetyScore;
    }

    public void setSafetyScore(BigDecimal safetyScore) {
        this.safetyScore = safetyScore;
    }

    public DriverStatus getStatus() {
        return status;
    }

    public void setStatus(DriverStatus status) {
        this.status = status;
    }
}
