package com.transitops.dashboard;

import com.transitops.dashboard.DashboardStatsResponse.VehicleStatusBreakdown;
import com.transitops.driver.DriverRepository;
import com.transitops.driver.DriverStatus;
import com.transitops.trip.TripRepository;
import com.transitops.trip.TripStatus;
import com.transitops.vehicle.VehicleRepository;
import com.transitops.vehicle.VehicleStatus;
import com.transitops.vehicle.VehicleType;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumMap;
import java.util.List;
import java.util.Map;

/**
 * Computes dashboard KPIs from live table counts, optionally scoped by the
 * Vehicle Type / Status filters. Trip and driver KPIs are fleet-wide. Also
 * surfaces the most recent trips for the dashboard's recent-trips table.
 *
 * Definitions:
 *   activeVehicles        = fleet not retired (AVAILABLE + ON_TRIP + IN_SHOP)
 *   availableVehicles     = AVAILABLE
 *   vehiclesInMaintenance = IN_SHOP
 *   activeTrips           = DISPATCHED
 *   pendingTrips          = DRAFT
 *   driversOnDuty         = AVAILABLE + ON_TRIP (not off-duty / suspended)
 *   fleetUtilization %    = 100 * ON_TRIP / operational fleet
 */
@Service
public class DashboardServiceImpl implements DashboardService {

    private static final int RECENT_TRIPS_LIMIT = 5;

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
    public DashboardStatsResponse getStats(VehicleType type, VehicleStatus status) {
        Map<VehicleStatus, Long> counts = vehicleCounts(type, status);

        long available = counts.getOrDefault(VehicleStatus.AVAILABLE, 0L);
        long onTrip = counts.getOrDefault(VehicleStatus.ON_TRIP, 0L);
        long inShop = counts.getOrDefault(VehicleStatus.IN_SHOP, 0L);
        long retired = counts.getOrDefault(VehicleStatus.RETIRED, 0L);

        long operationalFleet = available + onTrip + inShop;
        double utilization = operationalFleet == 0
                ? 0.0
                : Math.round(100.0 * onTrip / operationalFleet * 10.0) / 10.0;

        long activeTrips = tripRepository.countByStatus(TripStatus.DISPATCHED);
        long pendingTrips = tripRepository.countByStatus(TripStatus.DRAFT);

        long driversOnDuty = driverRepository.countByStatusIn(
                List.of(DriverStatus.AVAILABLE, DriverStatus.ON_TRIP));

        List<RecentTripResponse> recentTrips = tripRepository
                .findRecent(PageRequest.of(0, RECENT_TRIPS_LIMIT))
                .stream()
                .map(RecentTripResponse::from)
                .toList();

        return new DashboardStatsResponse(
                operationalFleet,
                available,
                inShop,
                activeTrips,
                pendingTrips,
                driversOnDuty,
                utilization,
                new VehicleStatusBreakdown(available, onTrip, inShop, retired),
                recentTrips);
    }

    private Map<VehicleStatus, Long> vehicleCounts(VehicleType type, VehicleStatus status) {
        Map<VehicleStatus, Long> counts = new EnumMap<>(VehicleStatus.class);
        for (Object[] row : vehicleRepository.countGroupedByStatus(type, status)) {
            counts.put((VehicleStatus) row[0], (Long) row[1]);
        }
        return counts;
    }
}
