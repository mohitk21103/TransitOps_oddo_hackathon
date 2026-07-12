package com.transitops.reports;

import com.transitops.fuel.FuelLog;
import com.transitops.fuel.FuelRepository;
import com.transitops.maintenance.MaintenanceLog;
import com.transitops.maintenance.MaintenanceRepository;
import com.transitops.trip.Trip;
import com.transitops.trip.TripRepository;
import com.transitops.trip.TripStatus;
import com.transitops.vehicle.Vehicle;
import com.transitops.vehicle.VehicleRepository;
import com.transitops.vehicle.VehicleStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ReportServiceImpl implements ReportService {

    private final VehicleRepository vehicleRepository;
    private final TripRepository tripRepository;
    private final MaintenanceRepository maintenanceRepository;
    private final FuelRepository fuelRepository;

    public ReportServiceImpl(VehicleRepository vehicleRepository,
                             TripRepository tripRepository,
                             MaintenanceRepository maintenanceRepository,
                             FuelRepository fuelRepository) {
        this.vehicleRepository = vehicleRepository;
        this.tripRepository = tripRepository;
        this.maintenanceRepository = maintenanceRepository;
        this.fuelRepository = fuelRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public FleetReport fleetReport() {
        Map<UUID, BigDecimal> maintCost = new HashMap<>();
        for (MaintenanceLog m : maintenanceRepository.findAll()) {
            accumulate(maintCost, m.getVehicle().getId(), nz(m.getCost()));
        }
        Map<UUID, BigDecimal> fuelCost = new HashMap<>();
        for (FuelLog f : fuelRepository.findAll()) {
            accumulate(fuelCost, f.getVehicle().getId(), nz(f.getCost()));
        }

        Map<UUID, BigDecimal> distance = new HashMap<>();
        Map<UUID, BigDecimal> fuelUsed = new HashMap<>();
        Map<UUID, BigDecimal> revenue = new HashMap<>();
        for (Trip t : tripRepository.findByStatus(TripStatus.COMPLETED)) {
            UUID vid = t.getVehicle().getId();
            if (t.getStartOdometerKm() != null && t.getEndOdometerKm() != null) {
                accumulate(distance, vid, t.getEndOdometerKm().subtract(t.getStartOdometerKm()));
            }
            accumulate(fuelUsed, vid, nz(t.getFuelConsumedL()));
            accumulate(revenue, vid, nz(t.getRevenue()));
        }

        List<VehicleReport> rows = new ArrayList<>();
        BigDecimal totalOpCost = BigDecimal.ZERO;
        BigDecimal totalRevenue = BigDecimal.ZERO;

        for (Vehicle v : vehicleRepository.findAll()) {
            UUID id = v.getId();
            BigDecimal dist = maintCostOr(distance, id);
            BigDecimal fuel = maintCostOr(fuelUsed, id);
            BigDecimal mCost = maintCostOr(maintCost, id);
            BigDecimal fCost = maintCostOr(fuelCost, id);
            BigDecimal rev = maintCostOr(revenue, id);

            BigDecimal opCost = mCost.add(fCost);
            BigDecimal efficiency = fuel.signum() > 0
                    ? dist.divide(fuel, 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
            BigDecimal roi = v.getAcquisitionCost() != null && v.getAcquisitionCost().signum() > 0
                    ? rev.subtract(opCost).divide(v.getAcquisitionCost(), 4, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;

            rows.add(new VehicleReport(id, v.getRegistrationNumber(), dist, fuel, efficiency,
                    mCost, fCost, opCost, rev, roi));
            totalOpCost = totalOpCost.add(opCost);
            totalRevenue = totalRevenue.add(rev);
        }

        long onTrip = vehicleRepository.countByStatus(VehicleStatus.ON_TRIP);
        long operational = vehicleRepository.count() - vehicleRepository.countByStatus(VehicleStatus.RETIRED);
        double utilization = operational > 0 ? Math.round((onTrip * 10000.0) / operational) / 100.0 : 0.0;

        return new FleetReport(utilization, totalOpCost, totalRevenue, rows);
    }

    @Override
    @Transactional(readOnly = true)
    public String fleetReportCsv() {
        FleetReport report = fleetReport();
        StringBuilder sb = new StringBuilder();
        sb.append("Registration,Distance,FuelConsumed,FuelEfficiency,MaintenanceCost,FuelCost,OperationalCost,Revenue,ROI\n");
        for (VehicleReport r : report.vehicles()) {
            sb.append(r.registrationNumber()).append(',')
                    .append(r.distance()).append(',')
                    .append(r.fuelConsumed()).append(',')
                    .append(r.fuelEfficiency()).append(',')
                    .append(r.maintenanceCost()).append(',')
                    .append(r.fuelCost()).append(',')
                    .append(r.operationalCost()).append(',')
                    .append(r.revenue()).append(',')
                    .append(r.roi()).append('\n');
        }
        return sb.toString();
    }

    private static BigDecimal nz(BigDecimal v) {
        return v != null ? v : BigDecimal.ZERO;
    }

    private static BigDecimal maintCostOr(Map<UUID, BigDecimal> map, UUID id) {
        return map.getOrDefault(id, BigDecimal.ZERO);
    }

    private static void accumulate(Map<UUID, BigDecimal> map, UUID id, BigDecimal amount) {
        map.merge(id, amount, BigDecimal::add);
    }
}
