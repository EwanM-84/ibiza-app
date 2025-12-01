-- ============================================================================
-- SPTC RURAL - ADD ADDRESS COLUMNS TO LISTINGS
-- ============================================================================
-- Run this in Supabase SQL Editor
-- This adds detailed address columns for proper location handling
-- ============================================================================

-- Add new address columns to listings table
ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS street_address TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT;

-- Update existing listings to populate address from location if empty
UPDATE public.listings
SET address = location
WHERE address IS NULL AND location IS NOT NULL;

-- ============================================================================
-- Completion message
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'ADDRESS COLUMNS ADDED SUCCESSFULLY';
  RAISE NOTICE '============================================';
  RAISE NOTICE '';
  RAISE NOTICE 'New columns added to listings:';
  RAISE NOTICE '  - street_address: Street name and number';
  RAISE NOTICE '  - postal_code: ZIP/postal code';
  RAISE NOTICE '';
  RAISE NOTICE 'Existing columns for address:';
  RAISE NOTICE '  - address: Full formatted address';
  RAISE NOTICE '  - city: City/town name';
  RAISE NOTICE '  - region: State/region/province';
  RAISE NOTICE '  - country: Country name';
  RAISE NOTICE '  - latitude: GPS latitude';
  RAISE NOTICE '  - longitude: GPS longitude';
  RAISE NOTICE '';
END $$;
