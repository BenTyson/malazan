-- Phase 3: Upgrade Triggers
-- Add scan limit tracking columns to profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS monthly_scan_count INTEGER DEFAULT 0;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS scan_count_reset_at TIMESTAMPTZ DEFAULT NOW();

-- Add expiration and password columns to qr_codes
ALTER TABLE qr_codes ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE qr_codes ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Index for efficient expiration queries
CREATE INDEX IF NOT EXISTS idx_qr_codes_expires ON qr_codes(expires_at) WHERE expires_at IS NOT NULL;

-- Function to increment user's monthly scan count
CREATE OR REPLACE FUNCTION increment_user_scan_count()
RETURNS TRIGGER AS $$
DECLARE
  qr_owner_id UUID;
BEGIN
  -- Get the owner of the QR code
  SELECT user_id INTO qr_owner_id FROM qr_codes WHERE id = NEW.qr_code_id;

  IF qr_owner_id IS NOT NULL THEN
    -- Check if we need to reset the monthly count (new month)
    UPDATE profiles
    SET
      monthly_scan_count = CASE
        WHEN scan_count_reset_at < date_trunc('month', NOW())
        THEN 1  -- Reset to 1 (this scan)
        ELSE monthly_scan_count + 1
      END,
      scan_count_reset_at = CASE
        WHEN scan_count_reset_at < date_trunc('month', NOW())
        THEN NOW()
        ELSE scan_count_reset_at
      END
    WHERE id = qr_owner_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if exists and recreate
DROP TRIGGER IF EXISTS on_scan_increment_user_count ON scans;
CREATE TRIGGER on_scan_increment_user_count
  AFTER INSERT ON scans
  FOR EACH ROW EXECUTE FUNCTION increment_user_scan_count();
