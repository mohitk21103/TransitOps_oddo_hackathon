-- =====================================================================
-- V7 — extend domain fields
-- Adds vehicle region, aligns vehicle types, adds maintenance title and a
-- direct fuel cost column to support the operations UI.
-- =====================================================================

-- Vehicles: add region; vehicle types are TRUCK/VAN/CAR/BUS/BIKE
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS region VARCHAR(80);
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_type_check;
ALTER TABLE vehicles ADD CONSTRAINT vehicles_type_check
    CHECK (type IN ('TRUCK','VAN','CAR','BUS','BIKE'));

-- Maintenance: frontend sends a free-text title; type is now optional
ALTER TABLE maintenance_logs ADD COLUMN IF NOT EXISTS title VARCHAR(160);
ALTER TABLE maintenance_logs ALTER COLUMN type DROP NOT NULL;
ALTER TABLE maintenance_logs ALTER COLUMN description DROP NOT NULL;

-- Fuel: frontend logs a single total cost (not price-per-litre)
ALTER TABLE fuel_logs ADD COLUMN IF NOT EXISTS cost NUMERIC(14,2);
ALTER TABLE fuel_logs ALTER COLUMN fuel_type DROP NOT NULL;
ALTER TABLE fuel_logs ALTER COLUMN cost_per_liter DROP NOT NULL;
