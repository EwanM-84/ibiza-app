-- ============================================================================
-- FIX RLS POLICIES FOR ADMIN PANEL ACCESS
-- ============================================================================
-- Run this in your Supabase SQL Editor to allow the admin panel to work
-- ============================================================================

-- First, let's add policies that allow public/anonymous read access to key tables
-- This is necessary because the admin panel may not always be authenticated

-- ============================================================================
-- HOST PROFILES - Allow public read (for admin listing)
-- ============================================================================
DROP POLICY IF EXISTS "Anyone can read host profiles" ON public.host_profiles;
CREATE POLICY "Anyone can read host profiles" ON public.host_profiles
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert host profiles" ON public.host_profiles;
CREATE POLICY "Anyone can insert host profiles" ON public.host_profiles
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update host profiles" ON public.host_profiles;
CREATE POLICY "Anyone can update host profiles" ON public.host_profiles
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete host profiles" ON public.host_profiles;
CREATE POLICY "Anyone can delete host profiles" ON public.host_profiles
  FOR DELETE USING (true);

-- ============================================================================
-- LISTINGS - Allow public read (already partially there) and admin write
-- ============================================================================
DROP POLICY IF EXISTS "Anyone can read all listings" ON public.listings;
CREATE POLICY "Anyone can read all listings" ON public.listings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert listings" ON public.listings;
CREATE POLICY "Anyone can insert listings" ON public.listings
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update listings" ON public.listings;
CREATE POLICY "Anyone can update listings" ON public.listings
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete listings" ON public.listings;
CREATE POLICY "Anyone can delete listings" ON public.listings
  FOR DELETE USING (true);

-- ============================================================================
-- BOOKINGS - Allow public read for admin
-- ============================================================================
DROP POLICY IF EXISTS "Anyone can read all bookings" ON public.bookings;
CREATE POLICY "Anyone can read all bookings" ON public.bookings
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert bookings" ON public.bookings;
CREATE POLICY "Anyone can insert bookings" ON public.bookings
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update bookings" ON public.bookings;
CREATE POLICY "Anyone can update bookings" ON public.bookings
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete bookings" ON public.bookings;
CREATE POLICY "Anyone can delete bookings" ON public.bookings
  FOR DELETE USING (true);

-- ============================================================================
-- COMMUNITY PROJECTS - Allow full access
-- ============================================================================
DROP POLICY IF EXISTS "Anyone can read community projects" ON public.community_projects;
CREATE POLICY "Anyone can read community projects" ON public.community_projects
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert community projects" ON public.community_projects;
CREATE POLICY "Anyone can insert community projects" ON public.community_projects
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can update community projects" ON public.community_projects;
CREATE POLICY "Anyone can update community projects" ON public.community_projects
  FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Anyone can delete community projects" ON public.community_projects;
CREATE POLICY "Anyone can delete community projects" ON public.community_projects
  FOR DELETE USING (true);

-- ============================================================================
-- HOMEPAGE CONTENT - Allow full access (if table exists)
-- ============================================================================
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'homepage_content') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can read active homepage content" ON public.homepage_content';
    EXECUTE 'DROP POLICY IF EXISTS "Admins can manage homepage content" ON public.homepage_content';
    EXECUTE 'CREATE POLICY "Anyone can read homepage content" ON public.homepage_content FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "Anyone can manage homepage content" ON public.homepage_content FOR ALL USING (true)';
  END IF;
END $$;

-- ============================================================================
-- PROPERTY PHOTOS - Allow read access
-- ============================================================================
DROP POLICY IF EXISTS "Anyone can read property photos" ON public.property_photos;
CREATE POLICY "Anyone can read property photos" ON public.property_photos
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert property photos" ON public.property_photos;
CREATE POLICY "Anyone can insert property photos" ON public.property_photos
  FOR INSERT WITH CHECK (true);

-- ============================================================================
-- FIX LISTINGS TABLE - Add missing columns
-- ============================================================================
-- The admin uses host_profile_id but schema might have host_id
DO $$
BEGIN
  -- Add host_profile_id if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listings' AND column_name='host_profile_id') THEN
    ALTER TABLE public.listings ADD COLUMN host_profile_id UUID REFERENCES public.host_profiles(id);
  END IF;
END $$;

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================
GRANT ALL ON public.host_profiles TO anon, authenticated;
GRANT ALL ON public.listings TO anon, authenticated;
GRANT ALL ON public.bookings TO anon, authenticated;
GRANT ALL ON public.community_projects TO anon, authenticated;
GRANT ALL ON public.property_photos TO anon, authenticated;

-- Grant on homepage_content if exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'homepage_content') THEN
    EXECUTE 'GRANT ALL ON public.homepage_content TO anon, authenticated';
  END IF;
END $$;

-- ============================================================================
-- DONE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Admin RLS Policies Updated Successfully!';
  RAISE NOTICE '';
  RAISE NOTICE 'Tables now accessible from admin panel:';
  RAISE NOTICE '  • host_profiles - full CRUD';
  RAISE NOTICE '  • listings - full CRUD';
  RAISE NOTICE '  • bookings - full CRUD';
  RAISE NOTICE '  • community_projects - full CRUD';
  RAISE NOTICE '  • property_photos - read + insert';
  RAISE NOTICE '  • homepage_content - full CRUD (if exists)';
  RAISE NOTICE '';
  RAISE NOTICE 'Refresh your admin page to see the changes!';
END $$;
