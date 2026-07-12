package com.transitops.trip;
import com.transitops.trip.dto.*;

import com.transitops.common.BusinessRuleException;
import com.transitops.common.ListQuery;
import com.transitops.common.PageResponse;
import com.transitops.common.ResourceNotFoundException;
import com.transitops.common.SearchSpecs;
import com.transitops.driver.Driver;
import com.transitops.driver.DriverRepository;
import com.transitops.driver.DriverStatus;
import com.transitops.vehicle.Vehicle;
import com.transitops.vehicle.VehicleRepository;
import com.transitops.vehicle.VehicleStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@Transactional
public class TripServiceImpl implements TripService {

    /** Whitelisted sortable properties; anything else falls back to the default. */
    private static final Set<String> SORT_FIELDS = Set.of(
            "referenceCode", "source", "destination", "cargoWeightKg",
            "plannedDistanceKm", "status", "revenue", "createdAt", "updatedAt");

    private final TripRepository tripRepository;
    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;

    public TripServiceImpl(TripRepository tripRepository,
                           VehicleRepository vehicleRepository,
                           DriverRepository driverRepository) {
        this.tripRepository = tripRepository;
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<TripResponse> list(ListQuery query) {
        Pageable pageable = query.toPageable(SORT_FIELDS, "createdAt");
        Specification<Trip> spec = SearchSpecs.textSearch(
                query.searchTerm(), "referenceCode", "source", "destination",
                "vehicle.registrationNumber", "driver.fullName");
        return PageResponse.of(tripRepository.findAll(spec, pageable), TripResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public TripResponse get(UUID id) {
        return TripResponse.from(find(id));
    }

    @Override
    public TripResponse create(TripRequest req) {
        Vehicle vehicle = vehicleRepository.findById(req.vehicleId())
                .orElseThrow(() -> ResourceNotFoundException.of("Vehicle", req.vehicleId()));
        Driver driver = driverRepository.findById(req.driverId())
                .orElseThrow(() -> ResourceNotFoundException.of("Driver", req.driverId()));

        Trip trip = new Trip();
        trip.setReferenceCode("TRP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        trip.setVehicle(vehicle);
        trip.setDriver(driver);
        trip.setSource(req.source().trim());
        trip.setDestination(req.destination().trim());
        trip.setCargoWeightKg(req.cargoWeight());
        trip.setPlannedDistanceKm(req.plannedDistance());
        trip.setRevenue(req.revenue() != null ? req.revenue() : BigDecimal.ZERO);
        trip.setStatus(TripStatus.DRAFT);
        return TripResponse.from(tripRepository.save(trip));
    }

    @Override
    public TripResponse update(UUID id, TripRequest req) {
        Trip trip = find(id);
        if (trip.getStatus() != TripStatus.DRAFT) {
            throw new BusinessRuleException("Only draft trips can be edited");
        }
        if (req.source() != null && !req.source().isBlank()) trip.setSource(req.source().trim());
        if (req.destination() != null && !req.destination().isBlank()) trip.setDestination(req.destination().trim());
        if (req.cargoWeight() != null) trip.setCargoWeightKg(req.cargoWeight());
        if (req.plannedDistance() != null) trip.setPlannedDistanceKm(req.plannedDistance());
        if (req.revenue() != null) trip.setRevenue(req.revenue());
        if (req.vehicleId() != null) {
            trip.setVehicle(vehicleRepository.findById(req.vehicleId())
                    .orElseThrow(() -> ResourceNotFoundException.of("Vehicle", req.vehicleId())));
        }
        if (req.driverId() != null) {
            trip.setDriver(driverRepository.findById(req.driverId())
                    .orElseThrow(() -> ResourceNotFoundException.of("Driver", req.driverId())));
        }
        return TripResponse.from(tripRepository.save(trip));
    }

    @Override
    public void delete(UUID id) {
        Trip trip = find(id);
        if (trip.getStatus() == TripStatus.DISPATCHED) {
            throw new BusinessRuleException("Cannot delete a dispatched trip; cancel it first");
        }
        tripRepository.delete(trip);
    }

    /**
     * Dispatch — enforces rules 2-6:
     *  (2) Retired/In-Shop vehicles not dispatchable
     *  (3) Expired-licence or Suspended drivers cannot be assigned
     *  (4) Vehicle/driver already On Trip cannot be reassigned
     *  (5) Cargo weight ≤ vehicle capacity
     *  (6) On success both vehicle and driver become On Trip.
     */
    @Override
    public TripResponse dispatch(UUID id) {
        Trip trip = find(id);
        if (trip.getStatus() != TripStatus.DRAFT) {
            throw new BusinessRuleException("Only draft trips can be dispatched");
        }
        Vehicle vehicle = trip.getVehicle();
        Driver driver = trip.getDriver();

        List<String> errors = new ArrayList<>();
        if (vehicle.getStatus() == VehicleStatus.RETIRED || vehicle.getStatus() == VehicleStatus.IN_SHOP) {
            errors.add("Vehicle " + vehicle.getRegistrationNumber() + " is " + vehicle.getStatus() + " — not dispatchable");
        }
        if (vehicle.getStatus() == VehicleStatus.ON_TRIP) {
            errors.add("Vehicle " + vehicle.getRegistrationNumber() + " is already on another trip");
        }
        if (driver.getStatus() == DriverStatus.SUSPENDED) {
            errors.add("Driver " + driver.getFullName() + " is suspended");
        }
        if (driver.getStatus() == DriverStatus.ON_TRIP) {
            errors.add("Driver " + driver.getFullName() + " is already on another trip");
        }
        if (!driver.hasValidLicense(LocalDate.now())) {
            errors.add("Driver " + driver.getFullName() + " has an expired licence (" + driver.getLicenseExpiry() + ")");
        }
        if (trip.getCargoWeightKg().compareTo(vehicle.getMaxLoadCapacityKg()) > 0) {
            BigDecimal over = trip.getCargoWeightKg().subtract(vehicle.getMaxLoadCapacityKg());
            errors.add("Cargo weight exceeds vehicle capacity by " + over + " kg");
        }
        if (!errors.isEmpty()) {
            throw new BusinessRuleException(errors);
        }

        vehicle.setStatus(VehicleStatus.ON_TRIP);
        driver.setStatus(DriverStatus.ON_TRIP);
        trip.setStartOdometerKm(vehicle.getOdometerKm());
        trip.setStatus(TripStatus.DISPATCHED);
        trip.setDispatchedAt(Instant.now());
        return TripResponse.from(tripRepository.save(trip));
    }

    /** Complete (rule 7) — records finals, frees vehicle+driver, updates odometer. */
    @Override
    public TripResponse complete(UUID id, CompleteTripRequest req) {
        Trip trip = find(id);
        if (trip.getStatus() != TripStatus.DISPATCHED) {
            throw new BusinessRuleException("Only dispatched trips can be completed");
        }
        if (trip.getStartOdometerKm() != null && req.endOdometer().compareTo(trip.getStartOdometerKm()) < 0) {
            throw new BusinessRuleException("Final odometer cannot be less than the start odometer");
        }
        trip.setEndOdometerKm(req.endOdometer());
        trip.setFuelConsumedL(req.fuelConsumed());
        trip.setStatus(TripStatus.COMPLETED);
        trip.setCompletedAt(Instant.now());

        Vehicle vehicle = trip.getVehicle();
        vehicle.setOdometerKm(req.endOdometer());
        vehicle.setStatus(VehicleStatus.AVAILABLE);
        trip.getDriver().setStatus(DriverStatus.AVAILABLE);
        return TripResponse.from(tripRepository.save(trip));
    }

    /** Cancel (rule 8) — restores vehicle+driver if the trip was dispatched. */
    @Override
    public TripResponse cancel(UUID id) {
        Trip trip = find(id);
        if (trip.getStatus() == TripStatus.COMPLETED || trip.getStatus() == TripStatus.CANCELLED) {
            throw new BusinessRuleException("Trip is already " + trip.getStatus());
        }
        if (trip.getStatus() == TripStatus.DISPATCHED) {
            trip.getVehicle().setStatus(VehicleStatus.AVAILABLE);
            trip.getDriver().setStatus(DriverStatus.AVAILABLE);
        }
        trip.setStatus(TripStatus.CANCELLED);
        trip.setCancelledAt(Instant.now());
        return TripResponse.from(tripRepository.save(trip));
    }

    private Trip find(UUID id) {
        return tripRepository.findById(id).orElseThrow(() -> ResourceNotFoundException.of("Trip", id));
    }
}
