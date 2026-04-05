-- Add active_pet_id column to children table
ALTER TABLE children ADD COLUMN IF NOT EXISTS active_pet_id INTEGER REFERENCES owned_pets(id);
