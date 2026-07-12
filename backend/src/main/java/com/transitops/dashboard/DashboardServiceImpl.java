package com.transitops.dashboard;

import com.transitops.driver.DriverRepository;
import com.transitops.driver.DriverStatus;
import com.transitops.trip.TripRepository;
import com.transitops.trip.TripStatus;
import com.transitops.vehicle.VehicleRepository;
import com.transitops.vehicle.VehicleStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final VehicleRepository vehicleRepository;
    private final DriverRepository driverRepository;
    private final TripRepository tripRepository;

    public DashboardServiceImpl(VehicleRepository vehicleRepository,
                                DriverRepository driverRepository,
                                TripRepository tripRepository) {
        this.vehicleRepository = vehicleRepository;
        this.driverRepository = driverRepository;
        this.tripRepository = tripRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardKpis kpis() {
        long onTrip = vehicleRepository.countByStatus(VehicleStatus.ON_TRIP);
        long available = vehicleRepository.countByStatus(VehicleStatus.AVAILABLE);
        long inShop = vehicleRepository.countByStatus(VehicleStatus.IN_SHOP);
        long retired = vehicleRepository.countByStatus(VehicleStatus.RETIRED);
        long operational = vehicleRepository.count() - retired;

        long driversOnDuty = driverRepository.countByStatus(DriverStatus.AVAILABLE)
                + driverRepository.countByStatus(DriverStatus.ON_TRIP);

        double utilization = operational > 0
                ? Math.round((onTrip * 10000.0) / operational) / 100.0 : 0.0;

        return new DashboardKpis(
                onTrip,
                available,
                inShop,
                tripRepository.countByStatus(TripStatus.DISPATCHED),
                tripRepository.countByStatus(TripStatus.DRAFT),
                driversOnDuty,
                utilization);
    }
}
