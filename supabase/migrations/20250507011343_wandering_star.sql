/*
  # Fix Foreign Key Relationships

  1. Changes
    - Drop and recreate foreign key relationships for prompts table
    - Ensure proper relationships between prompts and related tables
    
  2. Security
    - Maintain existing RLS policies
    - No data loss - only metadata changes
*/

-- Recreate foreign key relationships
DO $$ 
BEGIN
  -- Drop existing foreign keys if they exist
  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'prompts_niche_id_fkey'
  ) THEN
    ALTER TABLE prompts DROP CONSTRAINT prompts_niche_id_fkey;
  END IF;

  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'prompts_area_id_fkey'
  ) THEN
    ALTER TABLE prompts DROP CONSTRAINT prompts_area_id_fkey;
  END IF;

  IF EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'prompts_type_id_fkey'
  ) THEN
    ALTER TABLE prompts DROP CONSTRAINT prompts_type_id_fkey;
  END IF;

  -- Recreate foreign key relationships
  ALTER TABLE prompts
    ADD CONSTRAINT prompts_niche_id_fkey 
    FOREIGN KEY (niche_id) 
    REFERENCES niches(id) 
    ON DELETE SET NULL;

  ALTER TABLE prompts
    ADD CONSTRAINT prompts_area_id_fkey 
    FOREIGN KEY (area_id) 
    REFERENCES areas(id) 
    ON DELETE SET NULL;

  ALTER TABLE prompts
    ADD CONSTRAINT prompts_type_id_fkey 
    FOREIGN KEY (type_id) 
    REFERENCES prompt_types(id) 
    ON DELETE SET NULL;
END $$;