-- ============================================================================
-- SPTC RURAL - UPDATE HOST_TYPE TO SUPPORT MULTIPLE SELECTIONS
-- ============================================================================
-- Run this in Supabase SQL Editor
-- This migration converts host_type from a single TEXT value to JSONB array
-- to support hosts selecting multiple types (accommodation + excursion, etc.)
-- ============================================================================

-- Step 1: Drop the CHECK constraint if it exists
DO $$
BEGIN
  -- Try to drop the constraint (different possible names)
  ALTER TABLE public.host_profiles DROP CONSTRAINT IF EXISTS host_profiles_host_type_check;
  ALTER TABLE public.host_profiles DROP CONSTRAINT IF EXISTS host_type_check;
EXCEPTION WHEN OTHERS THEN
  -- Ignore if constraint doesn't exist
  NULL;
END $$;

-- Step 2: Convert existing single values to JSONB arrays
-- First, add a temporary column
ALTER TABLE public.host_profiles
ADD COLUMN IF NOT EXISTS host_types_new JSONB DEFAULT '[]'::jsonb;

-- Step 3: Migrate existing data - convert single strings to arrays
UPDATE public.host_profiles
SET host_types_new =
  CASE
    WHEN host_type IS NOT NULL AND host_type != '' THEN
      to_jsonb(ARRAY[host_type])
    ELSE
      '[]'::jsonb
  END
WHERE host_types_new = '[]'::jsonb OR host_types_new IS NULL;

-- Step 4: Change the column type to JSONB if it's still TEXT
-- We'll just use host_type directly as JSONB
ALTER TABLE public.host_profiles
ALTER COLUMN host_type TYPE JSONB USING
  CASE
    WHEN host_type IS NOT NULL AND host_type != '' AND host_type NOT LIKE '[%' THEN
      to_jsonb(ARRAY[host_type])
    WHEN host_type LIKE '[%' THEN
      host_type::jsonb
    ELSE
      '[]'::jsonb
  END;

-- Step 5: Set default value
ALTER TABLE public.host_profiles
ALTER COLUMN host_type SET DEFAULT '[]'::jsonb;

-- Step 6: Remove the temporary column (not needed anymore)
ALTER TABLE public.host_profiles DROP COLUMN IF EXISTS host_types_new;

-- ============================================================================
-- Completion message
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'HOST_TYPE COLUMN UPDATED SUCCESSFULLY';
  RAISE NOTICE '============================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Changes made:';
  RAISE NOTICE '  - Removed CHECK constraint (single value restriction)';
  RAISE NOTICE '  - Converted host_type from TEXT to JSONB';
  RAISE NOTICE '  - Migrated existing values to arrays';
  RAISE NOTICE '  - Hosts can now select multiple types';
  RAISE NOTICE '';
  RAISE NOTICE 'Example values:';
  RAISE NOTICE '  - Single: ["accommodation"]';
  RAISE NOTICE '  - Multiple: ["accommodation", "excursion"]';
  RAISE NOTICE '';
END $$;
