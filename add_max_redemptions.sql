-- Add max_redemptions column to rewards table
ALTER TABLE rewards ADD COLUMN IF NOT EXISTS max_redemptions INTEGER;

-- Set default value to NULL (unlimited)
ALTER TABLE rewards ALTER COLUMN max_redemptions SET DEFAULT NULL;
