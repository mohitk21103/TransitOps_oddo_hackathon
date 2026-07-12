-- =====================================================================
-- V5 — Costs (fuel_logs, expenses)
-- =====================================================================

CREATE TABLE IF NOT EXISTS fuel_logs (
    id             UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id     UUID          NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
    driver_id      UUID          REFERENCES drivers(id) ON DELETE SET NULL,
    trip_id        UUID          REFERENCES trips(id)   ON DELETE SET NULL,
    fuel_type      VARCHAR(16)   NOT NULL CHECK (fuel_type IN ('PETROL','DIESEL','CNG','LPG','ELECTRIC','HYBRID')),
    liters         NUMERIC(10,2) NOT NULL CHECK (liters > 0),
    cost_per_liter NUMERIC(10,2) NOT NULL CHECK (cost_per_liter >= 0),
    total_cost     NUMERIC(14,2) GENERATED ALWAYS AS (liters * cost_per_liter) STORED,
    odometer_km    NUMERIC(12,2),
    logged_at      TIMESTAMPTZ   NOT NULL DEFAULT now(),
    created_at     TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ   NOT NULL DEFAULT now(),
    version        INTEGER       NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_fuel_vehicle_time ON fuel_logs(vehicle_id, logged_at);

DROP TRIGGER IF EXISTS trg_fuel_updated ON fuel_logs;
CREATE TRIGGER trg_fuel_updated BEFORE UPDATE ON fuel_logs
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS expenses (
    id                 UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    category           VARCHAR(16)   NOT NULL
                                     CHECK (category IN ('TOLL','PARKING','FINE','PERMIT','FUEL','MAINTENANCE','INSURANCE','OTHER')),
    amount             NUMERIC(14,2) NOT NULL CHECK (amount >= 0),
    description        VARCHAR(300),
    vehicle_id         UUID REFERENCES vehicles(id)         ON DELETE SET NULL,
    trip_id            UUID REFERENCES trips(id)            ON DELETE SET NULL,
    driver_id          UUID REFERENCES drivers(id)          ON DELETE SET NULL,
    maintenance_log_id UUID REFERENCES maintenance_logs(id) ON DELETE SET NULL,
    incurred_at        DATE          NOT NULL DEFAULT CURRENT_DATE,
    is_approved        BOOLEAN       NOT NULL DEFAULT FALSE,
    created_at         TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at         TIMESTAMPTZ   NOT NULL DEFAULT now(),
    version            INTEGER       NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_expenses_vehicle ON expenses(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_expenses_trip    ON expenses(trip_id);

DROP TRIGGER IF EXISTS trg_expenses_updated ON expenses;
CREATE TRIGGER trg_expenses_updated BEFORE UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
