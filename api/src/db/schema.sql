-- ============================================================
-- ADPULSE LTD — DATABASE SCHEMA
-- Run: psql -U postgres -d adpulse_db -f schema.sql
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Contacts / Enquiries ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(120)  NOT NULL,
  email       VARCHAR(255)  NOT NULL,
  company     VARCHAR(120),
  phone       VARCHAR(30),
  service     VARCHAR(120),
  message     TEXT          NOT NULL,
  status      VARCHAR(30)   NOT NULL DEFAULT 'new',   -- new | in_review | converted | closed
  source      VARCHAR(60)   DEFAULT 'website',
  ip_address  INET,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_contacts_email  ON contacts(email);
CREATE INDEX idx_contacts_status ON contacts(status);

-- ── Newsletter Subscribers ────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscribers (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email        VARCHAR(255) NOT NULL UNIQUE,
  name         VARCHAR(120),
  status       VARCHAR(20)  NOT NULL DEFAULT 'active',  -- active | unsubscribed
  source       VARCHAR(60)  DEFAULT 'website',
  ip_address   INET,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ
);

CREATE INDEX idx_subscribers_email  ON subscribers(email);
CREATE INDEX idx_subscribers_status ON subscribers(status);

-- ── Leads (CRM pipeline) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id   UUID REFERENCES contacts(id) ON DELETE SET NULL,
  name         VARCHAR(120)  NOT NULL,
  email        VARCHAR(255)  NOT NULL,
  company      VARCHAR(120),
  phone        VARCHAR(30),
  service      VARCHAR(120),
  value        DECIMAL(12,2),                           -- estimated deal value KES
  stage        VARCHAR(40)   NOT NULL DEFAULT 'new',    -- new | qualified | proposal | negotiation | won | lost
  priority     VARCHAR(20)   NOT NULL DEFAULT 'medium', -- low | medium | high
  notes        TEXT,
  assigned_to  VARCHAR(120),
  next_action  TEXT,
  next_action_date DATE,
  created_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_stage ON leads(stage);

-- ── Admin Users ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name         VARCHAR(120) NOT NULL,
  email        VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role         VARCHAR(30)  NOT NULL DEFAULT 'staff',  -- admin | staff
  is_active    BOOLEAN      NOT NULL DEFAULT true,
  last_login   TIMESTAMPTZ,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── Activity Log ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_log (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type  VARCHAR(40)  NOT NULL,  -- contact | lead | subscriber
  entity_id    UUID,
  action       VARCHAR(80)  NOT NULL,
  actor        VARCHAR(120),
  metadata     JSONB,
  created_at   TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activity_entity ON activity_log(entity_type, entity_id);

-- ── Auto-update updated_at trigger ──────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_contacts_updated
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_leads_updated
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
