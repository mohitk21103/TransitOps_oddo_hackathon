package com.transitops.maintenance;
import com.transitops.maintenance.dto.*;

import com.transitops.common.BusinessRuleException;
import com.transitops.common.PageResponse;
import com.transitops.common.ResourceNotFoundException;
import com.transitops.vehicle.Vehicle;
import com.transitops.vehicle.VehicleRepository;
import com.transitops.vehicle.VehicleStatus;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@Transactional
public class MaintenanceServiceImpl implements MaintenanceService {

    private final MaintenanceRepository repository;
    private final VehicleRepository vehicleRepository;

    public MaintenanceServiceImpl(MaintenanceRepository repository, VehicleRepository vehicleRepository) {
        this.repository = repository;
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<MaintenanceResponse> list(int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "openedAt"));
        return PageResponse.of(repository.findAll(pageable), MaintenanceResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public MaintenanceResponse get(UUID id) {
        return MaintenanceResponse.from(find(id));
    }

    /** Rule 9: an active maintenance record moves the vehicle to In Shop. */
    @Override
    public MaintenanceResponse create(MaintenanceRequest req) {
        Vehicle vehicle = vehicleRepository.findById(req.vehicleId())
                .orElseThrow(() -> ResourceNotFoundException.of("Vehicle", req.vehicleId()));
        if (vehicle.getStatus() == VehicleStatus.RETIRED) {
            throw new BusinessRuleException("Retired vehicles cannot be sent for maintenance");
        }
        MaintenanceLog log = new MaintenanceLog();
        log.setVehicle(vehicle);
        log.setTitle(req.title().trim());
        log.setDescription(req.description());
        log.setCost(req.cost());
        log.setStatus(MaintenanceStatus.OPEN);
        log.setOpenedAt(Instant.now());

        vehicle.setStatus(VehicleStatus.IN_SHOP); // hidden from dispatch
        return MaintenanceResponse.from(repository.save(log));
    }

    @Override
    public MaintenanceResponse update(UUID id, MaintenanceRequest req) {
        MaintenanceLog log = find(id);
        if (req.title() != null && !req.title().isBlank()) log.setTitle(req.title().trim());
        if (req.description() != null) log.setDescription(req.description());
        if (req.cost() != null) log.setCost(req.cost());
        return MaintenanceResponse.from(repository.save(log));
    }

    @Override
    public void delete(UUID id) {
        repository.delete(find(id));
    }

    /** Rule 10: closing restores the vehicle to Available (unless Retired). */
    @Override
    public MaintenanceResponse close(UUID id) {
        MaintenanceLog log = find(id);
        if (log.getStatus() == MaintenanceStatus.CLOSED) {
            throw new BusinessRuleException("Maintenance record is already closed");
        }
        log.setStatus(MaintenanceStatus.CLOSED);
        log.setClosedAt(Instant.now());

        Vehicle vehicle = log.getVehicle();
        if (vehicle.getStatus() != VehicleStatus.RETIRED) {
            vehicle.setStatus(VehicleStatus.AVAILABLE);
        }
        return MaintenanceResponse.from(repository.save(log));
    }

    private MaintenanceLog find(UUID id) {
        return repository.findById(id).orElseThrow(() -> ResourceNotFoundException.of("MaintenanceLog", id));
    }
}
