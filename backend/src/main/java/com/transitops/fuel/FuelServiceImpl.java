package com.transitops.fuel;
import com.transitops.fuel.dto.*;

import com.transitops.common.ListQuery;
import com.transitops.common.PageResponse;
import com.transitops.common.ResourceNotFoundException;
import com.transitops.common.SearchSpecs;
import com.transitops.vehicle.Vehicle;
import com.transitops.vehicle.VehicleRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.Set;
import java.util.UUID;

@Service
@Transactional
public class FuelServiceImpl implements FuelService {

    /** Whitelisted sortable properties; anything else falls back to the default. */
    private static final Set<String> SORT_FIELDS = Set.of(
            "fuelType", "liters", "costPerLiter", "totalCost", "cost",
            "odometerKm", "loggedAt", "createdAt", "updatedAt");

    private final FuelRepository repository;
    private final VehicleRepository vehicleRepository;

    public FuelServiceImpl(FuelRepository repository, VehicleRepository vehicleRepository) {
        this.repository = repository;
        this.vehicleRepository = vehicleRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<FuelResponse> list(ListQuery query) {
        Pageable pageable = query.toPageable(SORT_FIELDS, "loggedAt");
        Specification<FuelLog> spec = SearchSpecs.textSearch(
                query.searchTerm(), "vehicle.registrationNumber", "vehicle.name");
        return PageResponse.of(repository.findAll(spec, pageable), FuelResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public FuelResponse get(UUID id) {
        return FuelResponse.from(find(id));
    }

    @Override
    public FuelResponse create(FuelRequest req) {
        Vehicle vehicle = vehicleRepository.findById(req.vehicleId())
                .orElseThrow(() -> ResourceNotFoundException.of("Vehicle", req.vehicleId()));
        FuelLog f = new FuelLog();
        f.setVehicle(vehicle);
        f.setLiters(req.liters());
        f.setCost(req.cost());
        f.setOdometerKm(req.odometer());
        f.setLoggedAt(toInstant(req.date()));
        return FuelResponse.from(repository.save(f));
    }

    @Override
    public FuelResponse update(UUID id, FuelRequest req) {
        FuelLog f = find(id);
        if (req.liters() != null) f.setLiters(req.liters());
        if (req.cost() != null) f.setCost(req.cost());
        if (req.odometer() != null) f.setOdometerKm(req.odometer());
        if (req.date() != null) f.setLoggedAt(toInstant(req.date()));
        return FuelResponse.from(repository.save(f));
    }

    @Override
    public void delete(UUID id) {
        repository.delete(find(id));
    }

    private static Instant toInstant(LocalDate date) {
        return (date != null ? date : LocalDate.now()).atStartOfDay().toInstant(ZoneOffset.UTC);
    }

    private FuelLog find(UUID id) {
        return repository.findById(id).orElseThrow(() -> ResourceNotFoundException.of("FuelLog", id));
    }
}
