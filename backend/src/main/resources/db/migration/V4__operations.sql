-- =====================================================================
-- V4 — Operations (trips, maintenance_logs) with business invariants
-- =====================================================================

CREATE TABLE IF NOT EXISTS trips (
    id                  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_code      VARCHAR(24)   NOT NULL UNIQUE,
    vehicle_id          UUID          NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    driver_id           UUID          NOT NULL REFERENCES drivers(id)  ON DELETE RESTRICT,
    source              VARCHAR(160)  NOT NULL,
    destination         VARCHAR(160)  NOT NULL,
    cargo_weight_kg     NUMERIC(10,2) NOT NULL CHECK (cargo_weight_kg >= 0),
    planned_distance_km NUMERIC(10,2) NOT NULL CHECK (planned_distance_km >= 0),
    status              VARCHAR(16)   NOT NULL DEFAULT 'DRAFT'
                                      CHECK (status IN ('DRAFT','DISPATCHED','COMPLETED','CANCELLED')),
    revenue             NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (revenue >= 0),
    start_odometer_km   NUMERIC(12,2),
    end_odometer_km     NUMERIC(12,2),
    actual_distance_km  NUMERIC(10,2) GENERATED ALWAYS AS (end_odometer_km - start_odometer_km) STORED,
    fuel_consumed_l     NUMERIC(10,2) CHECK (fuel_consumed_l IS NULL OR fuel_consumed_l >= 0),
    dispatched_at       TIMESTAMPTZ,
    completed_at        TIMESTAMPTZ,
    cancelled_at        TIMESTAMPTZ,
    created_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),
    version             INTEGER       NOT NULL DEFAULT 0,
    CONSTRAINT chk_trip_odometer CHECK (
        end_odometer_km IS NULL OR start_odometer_km IS NULL OR end_odometer_km >= start_odometer_km
    )
);
CREATE INDEX IF NOT EXISTS idx_trips_status     ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_vehicle    ON trips(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_trips_driver     ON trips(driver_id);
CREATE INDEX IF NOT EXISTS idx_trips_dispatched ON trips(dispatched_at);
-- Rule: a vehicle/driver can hold at most ONE dispatched trip at a time.
CREATE UNIQUE INDEX IF NOT EXISTS uq_active_trip_per_vehicle ON trips(vehicle_id) WHERE status = 'DISPATCHED';
CREATE UNIQUE INDEX IF NOT EXISTS uq_active_trip_per_driver  ON trips(driver_id)  WHERE status = 'DISPATCHED';

DROP TRIGGER IF EXISTS trg_trips_updated ON trips;
CREATE TRIGGER trg_trips_updated BEFORE UPDATE ON trips
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS maintenance_logs (
    id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id    UUID          NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    type          VARCHAR(24)   NOT NULL
                                CHECK (type IN ('SCHEDULED_SERVICE','REPAIR','INSPECTION','TIRE','OIL_CHANGE','OTHER')),
    description   VARCHAR(300)  NOT NULL,
    status        VARCHAR(16)   NOT NULL DEFAULT 'OPEN'
                                CHECK (status IN ('OPEN','IN_PROGRESS','CLOSED')),
    cost          NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (cost >= 0),
    odometer_km   NUMERIC(12,2),
    scheduled_for DATE,
    opened_at     TIMESTAMPTZ   NOT NULL DEFAULT now(),
    closed_at     TIMESTAMPTZ,
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ   NOT NULL DEFAULT now(),
    version       INTEGER       NOT NULL DEFAULT 0,
    CONSTRAINT chk_maint_closed CHECK (status <> 'CLOSED' OR closed_at IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS idx_maint_vehicle ON maintenance_logs(vehicle_id);
-- Rule: at most ONE active maintenance per vehicle.
CREATE UNIQUE INDEX IF NOT EXISTS uq_active_maintenance_per_vehicle
    ON maintenance_logs(vehicle_id) WHERE status IN ('OPEN','IN_PROGRESS');

DROP TRIGGER IF EXISTS trg_maint_updated ON maintenance_logs;
CREATE TRIGGER trg_maint_updated BEFORE UPDATE ON maintenance_logs
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
