-- ============================================================================
-- SPTC RURAL - ADD PROPERTY_TYPES COLUMN TO LISTINGS
-- ============================================================================
-- Run this in Supabase SQL Editor
-- This adds property_types array column for multi-select property types
-- ============================================================================

-- Add new property_types column to listings table (array of text)
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS property_types TEXT[];

-- Migrate existing property_type values to the new array column
UPDATE public.listings
SET property_types = ARRAY[property_type]
WHERE property_types IS NULL AND property_type IS NOT NULL;

-- ============================================================================
-- Completion message
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'PROPERTY_TYPES COLUMN ADDED SUCCESSFULLY';
  RAISE NOTICE '============================================';
  RAISE NOTICE '';
  RAISE NOTICE 'New column added to listings:';
  RAISE NOTICE '  - property_types: Array of property type strings';
  RAISE NOTICE '';
  RAISE NOTICE 'Existing property_type values have been migrated';
  RAISE NOTICE 'to the new property_types array column.';
  RAISE NOTICE '';
END $$;
