-- ============================================================================
-- SPTC RURAL - LISTINGS TABLE
-- ============================================================================
-- Run this in Supabase SQL Editor to create/update the listings table
-- This table stores accommodation listings created by verified hosts
-- ============================================================================

-- Drop existing table if it exists with wrong structure
DROP TABLE IF EXISTS public.listings CASCADE;

-- Create listings table linked to host_profiles
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host_profile_id UUID REFERENCES public.host_profiles(id) ON DELETE CASCADE NOT NULL,

  -- Basic Information
  title TEXT NOT NULL,
  description TEXT,

  -- Property Details
  property_type TEXT CHECK (property_type IN ('house', 'apartment', 'cabin', 'farm', 'room', 'villa', 'cottage', 'other')),
  bedrooms INTEGER DEFAULT 1,
  bathrooms INTEGER DEFAULT 1,
  max_guests INTEGER DEFAULT 2,

  -- Location
  location TEXT NOT NULL,
  address TEXT,
  city TEXT,
  region TEXT,
  country TEXT DEFAULT 'Colombia',
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),

  -- Pricing
  price_per_night DECIMAL(10, 2) NOT NULL,
  cleaning_fee DECIMAL(10, 2) DEFAULT 0,
  currency TEXT DEFAULT 'USD',

  -- Amenities (stored as JSON array)
  amenities JSONB DEFAULT '[]'::jsonb,

  -- Images (stored as JSON array of URLs)
  images JSONB DEFAULT '[]'::jsonb,

  -- Availability
  available BOOLEAN DEFAULT TRUE,
  instant_book BOOLEAN DEFAULT FALSE,

  -- Ratings (calculated from reviews)
  rating DECIMAL(2, 1) DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,

  -- Community Impact
  community_contribution_percentage INTEGER DEFAULT 10,

  -- Status
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'active', 'inactive', 'suspended')
  ),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_listings_host_profile_id ON public.listings(host_profile_id);
CREATE INDEX idx_listings_status ON public.listings(status);
CREATE INDEX idx_listings_available ON public.listings(available);
CREATE INDEX idx_listings_city ON public.listings(city);
CREATE INDEX idx_listings_region ON public.listings(region);
CREATE INDEX idx_listings_price ON public.listings(price_per_night);

-- Enable Row Level Security
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can read active listings" ON public.listings;
DROP POLICY IF EXISTS "Hosts can manage own listings" ON public.listings;
DROP POLICY IF EXISTS "Hosts can insert own listings" ON public.listings;
DROP POLICY IF EXISTS "Hosts can update own listings" ON public.listings;
DROP POLICY IF EXISTS "Hosts can delete own listings" ON public.listings;

-- RLS Policies

-- Anyone can read active and available listings (for homepage)
CREATE POLICY "Anyone can read active listings" ON public.listings
  FOR SELECT USING (status = 'active' AND available = true);

-- Hosts can read their own listings (any status)
CREATE POLICY "Hosts can read own listings" ON public.listings
  FOR SELECT USING (
    host_profile_id IN (
      SELECT id FROM public.host_profiles WHERE user_id = auth.uid()
    )
  );

-- Hosts can insert their own listings
CREATE POLICY "Hosts can insert own listings" ON public.listings
  FOR INSERT WITH CHECK (
    host_profile_id IN (
      SELECT id FROM public.host_profiles
      WHERE user_id = auth.uid()
      AND verification_status = 'approved'
    )
  );

-- Hosts can update their own listings
CREATE POLICY "Hosts can update own listings" ON public.listings
  FOR UPDATE USING (
    host_profile_id IN (
      SELECT id FROM public.host_profiles WHERE user_id = auth.uid()
    )
  );

-- Hosts can delete their own listings
CREATE POLICY "Hosts can delete own listings" ON public.listings
  FOR DELETE USING (
    host_profile_id IN (
      SELECT id FROM public.host_profiles WHERE user_id = auth.uid()
    )
  );

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_listings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_listings_updated_at ON public.listings;
CREATE TRIGGER update_listings_updated_at
  BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION update_listings_updated_at();

-- Grant permissions
GRANT ALL ON public.listings TO authenticated;
GRANT SELECT ON public.listings TO anon;

-- ============================================================================
-- Completion message
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'LISTINGS TABLE CREATED SUCCESSFULLY';
  RAISE NOTICE '============================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Table: public.listings';
  RAISE NOTICE 'Linked to: host_profiles (via host_profile_id)';
  RAISE NOTICE '';
  RAISE NOTICE 'Features:';
  RAISE NOTICE '  - Property details (type, bedrooms, guests)';
  RAISE NOTICE '  - Location with GPS coordinates';
  RAISE NOTICE '  - Pricing (per night + cleaning fee)';
  RAISE NOTICE '  - Amenities as JSON array';
  RAISE NOTICE '  - Images as JSON array';
  RAISE NOTICE '  - Rating and review count';
  RAISE NOTICE '  - Community contribution percentage';
  RAISE NOTICE '';
  RAISE NOTICE 'RLS Policies:';
  RAISE NOTICE '  - Anyone can view active listings';
  RAISE NOTICE '  - Approved hosts can create listings';
  RAISE NOTICE '  - Hosts can manage their own listings';
  RAISE NOTICE '';
END $$;
