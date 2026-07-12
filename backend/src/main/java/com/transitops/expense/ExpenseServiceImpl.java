package com.transitops.expense;

import com.transitops.common.PageResponse;
import com.transitops.common.ResourceNotFoundException;
import com.transitops.trip.TripRepository;
import com.transitops.vehicle.VehicleRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.UUID;

@Service
@Transactional
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository repository;
    private final VehicleRepository vehicleRepository;
    private final TripRepository tripRepository;

    public ExpenseServiceImpl(ExpenseRepository repository,
                              VehicleRepository vehicleRepository,
                              TripRepository tripRepository) {
        this.repository = repository;
        this.vehicleRepository = vehicleRepository;
        this.tripRepository = tripRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<ExpenseResponse> list(int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "incurredAt"));
        return PageResponse.of(repository.findAll(pageable), ExpenseResponse::from);
    }

    @Override
    @Transactional(readOnly = true)
    public ExpenseResponse get(UUID id) {
        return ExpenseResponse.from(find(id));
    }

    @Override
    public ExpenseResponse create(ExpenseRequest req) {
        Expense e = new Expense();
        e.setCategory(req.category());
        e.setAmount(req.amount());
        e.setDescription(req.note());
        e.setIncurredAt(req.date() != null ? req.date() : LocalDate.now());
        if (req.vehicleId() != null) {
            e.setVehicle(vehicleRepository.findById(req.vehicleId())
                    .orElseThrow(() -> ResourceNotFoundException.of("Vehicle", req.vehicleId())));
        }
        if (req.tripId() != null) {
            e.setTrip(tripRepository.findById(req.tripId())
                    .orElseThrow(() -> ResourceNotFoundException.of("Trip", req.tripId())));
        }
        return ExpenseResponse.from(repository.save(e));
    }

    @Override
    public ExpenseResponse update(UUID id, ExpenseRequest req) {
        Expense e = find(id);
        if (req.category() != null) e.setCategory(req.category());
        if (req.amount() != null) e.setAmount(req.amount());
        if (req.note() != null) e.setDescription(req.note());
        if (req.date() != null) e.setIncurredAt(req.date());
        if (req.vehicleId() != null) {
            e.setVehicle(vehicleRepository.findById(req.vehicleId())
                    .orElseThrow(() -> ResourceNotFoundException.of("Vehicle", req.vehicleId())));
        }
        if (req.tripId() != null) {
            e.setTrip(tripRepository.findById(req.tripId())
                    .orElseThrow(() -> ResourceNotFoundException.of("Trip", req.tripId())));
        }
        return ExpenseResponse.from(repository.save(e));
    }

    @Override
    public void delete(UUID id) {
        repository.delete(find(id));
    }

    private Expense find(UUID id) {
        return repository.findById(id).orElseThrow(() -> ResourceNotFoundException.of("Expense", id));
    }
}
