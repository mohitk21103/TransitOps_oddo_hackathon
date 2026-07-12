package com.transitops.driver;
import com.transitops.driver.dto.*;

import com.transitops.common.PageResponse;
import com.transitops.common.ResourceNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class DriverServiceImpl implements DriverService {

    private final DriverRepository repository;

    public DriverServiceImpl(DriverRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<DriverResponse> list(int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return PageResponse.of(repository.findAll(pageable), DriverResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public DriverResponse get(UUID id) {
        return DriverResponse.from(find(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<DriverResponse> listAssignable() {
        LocalDate today = LocalDate.now();
        return repository.findByStatus(DriverStatus.AVAILABLE).stream()
                .filter(d -> d.hasValidLicense(today))
                .map(DriverResponse::from)
                .toList();
    }

    @Override
    public DriverResponse create(DriverRequest req) {
        if (repository.existsByLicenseNumberIgnoreCase(req.licenseNumber().trim())) {
            throw new DataIntegrityViolationException("Licence number already exists: " + req.licenseNumber());
        }
        Driver d = new Driver();
        d.setFullName(req.name().trim());
        d.setLicenseNumber(req.licenseNumber().trim());
        d.setLicenseCategory(req.licenseCategory());
        d.setLicenseExpiry(req.licenseExpiry());
        d.setContactNumber(req.contactNumber());
        d.setSafetyScore(req.safetyScore() != null ? req.safetyScore() : BigDecimal.valueOf(100));
        d.setStatus(req.status() != null ? req.status() : DriverStatus.AVAILABLE);
        return DriverResponse.from(repository.save(d));
    }

    @Override
    public DriverResponse update(UUID id, DriverRequest req) {
        Driver d = find(id);
        if (req.name() != null && !req.name().isBlank()) d.setFullName(req.name().trim());
        if (req.licenseNumber() != null && !req.licenseNumber().isBlank()) d.setLicenseNumber(req.licenseNumber().trim());
        if (req.licenseCategory() != null) d.setLicenseCategory(req.licenseCategory());
        if (req.licenseExpiry() != null) d.setLicenseExpiry(req.licenseExpiry());
        if (req.contactNumber() != null) d.setContactNumber(req.contactNumber());
        if (req.safetyScore() != null) d.setSafetyScore(req.safetyScore());
        if (req.status() != null) d.setStatus(req.status());
        return DriverResponse.from(repository.save(d));
    }

    @Override
    public void delete(UUID id) {
        repository.delete(find(id));
    }

    private Driver find(UUID id) {
        return repository.findById(id).orElseThrow(() -> ResourceNotFoundException.of("Driver", id));
    }
}
