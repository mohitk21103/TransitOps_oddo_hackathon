package com.transitops.vehicle;

import com.transitops.common.PageResponse;
import com.transitops.common.ResourceNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository repository;

    public VehicleServiceImpl(VehicleRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<VehicleResponse> list(int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return PageResponse.of(repository.findAll(pageable), VehicleResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public VehicleResponse get(UUID id) {
        return VehicleResponse.from(find(id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<VehicleResponse> listDispatchable() {
        // Rule: only Available vehicles are dispatchable (excludes On Trip / In Shop / Retired).
        return repository.findByStatus(VehicleStatus.AVAILABLE).stream().map(VehicleResponse::from).toList();
    }

    @Override
    public VehicleResponse create(VehicleRequest req) {
        // Rule: registration number must be unique.
        if (repository.existsByRegistrationNumberIgnoreCase(req.registrationNumber().trim())) {
            throw new DataIntegrityViolationException("Registration number already exists: " + req.registrationNumber());
        }
        Vehicle v = new Vehicle();
        v.setRegistrationNumber(req.registrationNumber().trim());
        v.setName(req.name().trim());
        v.setType(req.type());
        v.setMaxLoadCapacityKg(req.maxLoadCapacity());
        v.setOdometerKm(req.odometer() != null ? req.odometer() : BigDecimal.ZERO);
        v.setAcquisitionCost(req.acquisitionCost() != null ? req.acquisitionCost() : BigDecimal.ZERO);
        v.setStatus(req.status() != null ? req.status() : VehicleStatus.AVAILABLE);
        v.setRegion(req.region());
        return VehicleResponse.from(repository.save(v));
    }

    @Override
    public VehicleResponse update(UUID id, VehicleRequest req) {
        Vehicle v = find(id);
        if (req.registrationNumber() != null && !req.registrationNumber().isBlank()) {
            v.setRegistrationNumber(req.registrationNumber().trim());
        }
        if (req.name() != null && !req.name().isBlank()) v.setName(req.name().trim());
        if (req.type() != null) v.setType(req.type());
        if (req.maxLoadCapacity() != null) v.setMaxLoadCapacityKg(req.maxLoadCapacity());
        if (req.odometer() != null) v.setOdometerKm(req.odometer());
        if (req.acquisitionCost() != null) v.setAcquisitionCost(req.acquisitionCost());
        if (req.status() != null) v.setStatus(req.status());
        if (req.region() != null) v.setRegion(req.region());
        return VehicleResponse.from(repository.save(v));
    }

    @Override
    public void delete(UUID id) {
        repository.delete(find(id));
    }

    private Vehicle find(UUID id) {
        return repository.findById(id).orElseThrow(() -> ResourceNotFoundException.of("Vehicle", id));
    }
}
