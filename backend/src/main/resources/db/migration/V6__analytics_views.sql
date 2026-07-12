-- =====================================================================
-- V6 — Analytics read-model views (dashboard + CSV export)
-- =====================================================================

-- Operational cost per vehicle: Fuel + Maintenance + other expenses.
CREATE OR REPLACE VIEW vw_vehicle_operational_cost AS
SELECT v.id AS vehicle_id, v.registration_number,
       COALESCE(f.fuel_cost, 0)  AS fuel_cost,
       COALESCE(m.maint_cost, 0) AS maintenance_cost,
       COALESCE(e.other_cost, 0) AS other_expense_cost,
       COALESCE(f.fuel_cost,0) + COALESCE(m.maint_cost,0) + COALESCE(e.other_cost,0) AS total_operational_cost
FROM vehicles v
LEFT JOIN (SELECT vehicle_id, SUM(total_cost) fuel_cost  FROM fuel_logs        GROUP BY vehicle_id) f ON f.vehicle_id = v.id
LEFT JOIN (SELECT vehicle_id, SUM(cost)       maint_cost FROM maintenance_logs GROUP BY vehicle_id) m ON m.vehicle_id = v.id
LEFT JOIN (SELECT vehicle_id, SUM(amount)     other_cost FROM expenses
           WHERE category NOT IN ('FUEL','MAINTENANCE') GROUP BY vehicle_id) e ON e.vehicle_id = v.id;

-- Fuel efficiency (Distance / Fuel) from completed trips.
CREATE OR REPLACE VIEW vw_vehicle_fuel_efficiency AS
SELECT v.id AS vehicle_id, v.registration_number,
       SUM(t.actual_distance_km) AS total_distance_km,
       SUM(t.fuel_consumed_l)    AS total_fuel_l,
       CASE WHEN SUM(t.fuel_consumed_l) > 0
            THEN ROUND(SUM(t.actual_distance_km) / SUM(t.fuel_consumed_l), 2) END AS km_per_liter
FROM vehicles v
LEFT JOIN trips t ON t.vehicle_id = v.id AND t.status = 'COMPLETED'
GROUP BY v.id, v.registration_number;

-- Fleet utilization (%) snapshot.
CREATE OR REPLACE VIEW vw_fleet_utilization AS
SELECT COUNT(*) FILTER (WHERE status <> 'RETIRED') AS operational_fleet,
       COUNT(*) FILTER (WHERE status = 'ON_TRIP')  AS vehicles_in_use,
       ROUND(100.0 * COUNT(*) FILTER (WHERE status = 'ON_TRIP')
             / NULLIF(COUNT(*) FILTER (WHERE status <> 'RETIRED'), 0), 2) AS utilization_pct
FROM vehicles;

-- Vehicle ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost.
CREATE OR REPLACE VIEW vw_vehicle_roi AS
SELECT v.id AS vehicle_id, v.registration_number, v.acquisition_cost,
       COALESCE(r.revenue, 0)           AS revenue,
       c.fuel_cost + c.maintenance_cost AS fuel_plus_maintenance,
       CASE WHEN v.acquisition_cost > 0
            THEN ROUND((COALESCE(r.revenue,0) - (c.fuel_cost + c.maintenance_cost)) / v.acquisition_cost, 4) END AS roi
FROM vehicles v
LEFT JOIN (SELECT vehicle_id, SUM(revenue) revenue FROM trips WHERE status='COMPLETED' GROUP BY vehicle_id) r ON r.vehicle_id = v.id
LEFT JOIN vw_vehicle_operational_cost c ON c.vehicle_id = v.id;
