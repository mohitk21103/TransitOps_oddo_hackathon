-- =====================================================================
-- V1 — shared database functions
-- =====================================================================

-- Keeps updated_at current on every UPDATE (attached per-table below).
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
