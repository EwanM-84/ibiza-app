-- ============================================================================
-- SPTC RURAL - PHOTO GALLERIES TABLE
-- ============================================================================
-- Run this in Supabase SQL Editor
-- This table stores named photo galleries for each host (one per property)
-- ============================================================================

-- Create photo_galleries table
CREATE TABLE IF NOT EXISTS public.photo_galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add gallery_id column to listing_photos if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'listing_photos' AND column_name = 'gallery_id'
  ) THEN
    ALTER TABLE public.listing_photos ADD COLUMN gallery_id UUID REFERENCES public.photo_galleries(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_photo_galleries_host_id ON public.photo_galleries(host_id);
CREATE INDEX IF NOT EXISTS idx_listing_photos_gallery_id ON public.listing_photos(gallery_id);

-- Enable RLS
ALTER TABLE public.photo_galleries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Hosts can manage own galleries" ON public.photo_galleries;
DROP POLICY IF EXISTS "Hosts can view own galleries" ON public.photo_galleries;
DROP POLICY IF EXISTS "Hosts can insert own galleries" ON public.photo_galleries;
DROP POLICY IF EXISTS "Hosts can update own galleries" ON public.photo_galleries;
DROP POLICY IF EXISTS "Hosts can delete own galleries" ON public.photo_galleries;

-- RLS Policies for photo_galleries
CREATE POLICY "Hosts can view own galleries" ON public.photo_galleries
  FOR SELECT USING (host_id = auth.uid());

CREATE POLICY "Hosts can insert own galleries" ON public.photo_galleries
  FOR INSERT WITH CHECK (host_id = auth.uid());

CREATE POLICY "Hosts can update own galleries" ON public.photo_galleries
  FOR UPDATE USING (host_id = auth.uid());

CREATE POLICY "Hosts can delete own galleries" ON public.photo_galleries
  FOR DELETE USING (host_id = auth.uid());

-- Grant permissions
GRANT ALL ON public.photo_galleries TO authenticated;

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_photo_galleries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_photo_galleries_updated_at ON public.photo_galleries;
CREATE TRIGGER update_photo_galleries_updated_at
  BEFORE UPDATE ON public.photo_galleries
  FOR EACH ROW EXECUTE FUNCTION update_photo_galleries_updated_at();

-- ============================================================================
-- Completion message
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'PHOTO GALLERIES TABLE CREATED SUCCESSFULLY';
  RAISE NOTICE '============================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Changes made:';
  RAISE NOTICE '  - Created photo_galleries table';
  RAISE NOTICE '  - Added gallery_id column to listing_photos';
  RAISE NOTICE '  - Each gallery can hold up to 15 photos';
  RAISE NOTICE '  - Hosts can create multiple galleries for different properties';
  RAISE NOTICE '';
END $$;
