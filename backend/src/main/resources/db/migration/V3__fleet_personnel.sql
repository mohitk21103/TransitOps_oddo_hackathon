-- =====================================================================
-- V3 — Fleet (vehicles) & Personnel (drivers)
-- Enum-like columns use VARCHAR + CHECK for portability & simple mapping.
-- =====================================================================

CREATE TABLE IF NOT EXISTS vehicles (
    id                   UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_number  VARCHAR(32)   NOT NULL UNIQUE,
    name                 VARCHAR(120)  NOT NULL,
    type                 VARCHAR(16)   NOT NULL CHECK (type IN ('TRUCK','VAN','BUS','CAR','PICKUP','TRAILER')),
    status               VARCHAR(16)   NOT NULL DEFAULT 'AVAILABLE'
                                       CHECK (status IN ('AVAILABLE','ON_TRIP','IN_SHOP','RETIRED')),
    max_load_capacity_kg NUMERIC(10,2) NOT NULL CHECK (max_load_capacity_kg > 0),
    odometer_km          NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (odometer_km >= 0),
    acquisition_cost     NUMERIC(14,2) NOT NULL DEFAULT 0 CHECK (acquisition_cost >= 0),
    acquired_at          DATE,
    created_at           TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ   NOT NULL DEFAULT now(),
    version              INTEGER       NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON vehicles(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_type   ON vehicles(type);

DROP TRIGGER IF EXISTS trg_vehicles_updated ON vehicles;
CREATE TRIGGER trg_vehicles_updated BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS drivers (
    id               UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID          UNIQUE REFERENCES users(id) ON DELETE SET NULL,
    full_name        VARCHAR(120)  NOT NULL,
    license_number   VARCHAR(48)   NOT NULL UNIQUE,
    license_category VARCHAR(16)   NOT NULL,
    license_expiry   DATE          NOT NULL,
    contact_number   VARCHAR(20),
    safety_score     NUMERIC(5,2)  NOT NULL DEFAULT 100 CHECK (safety_score BETWEEN 0 AND 100),
    status           VARCHAR(16)   NOT NULL DEFAULT 'AVAILABLE'
                                   CHECK (status IN ('AVAILABLE','ON_TRIP','OFF_DUTY','SUSPENDED')),
    created_at       TIMESTAMPTZ   NOT NULL DEFAULT now(),
    updated_at       TIMESTAMPTZ   NOT NULL DEFAULT now(),
    version          INTEGER       NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_drivers_status         ON drivers(status);
CREATE INDEX IF NOT EXISTS idx_drivers_license_expiry ON drivers(license_expiry);

DROP TRIGGER IF EXISTS trg_drivers_updated ON drivers;
CREATE TRIGGER trg_drivers_updated BEFORE UPDATE ON drivers
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();
