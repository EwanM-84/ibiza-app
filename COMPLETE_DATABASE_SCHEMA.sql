-- ============================================================================
-- SPTC RURAL - COMPLETE DATABASE SCHEMA
-- ============================================================================
-- Run this entire file in your Supabase SQL Editor to set up all tables
-- Project ID: lsmobpdykxqfvcdbdzfv
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. USERS TABLE (Authentication)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('guest', 'host', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. HOST PROFILES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.host_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,

  -- Personal Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  country TEXT DEFAULT 'Colombia',
  city TEXT,
  date_of_birth DATE,

  -- Identity Verification (MetaMap)
  id_verified BOOLEAN DEFAULT FALSE,
  id_verification_score DECIMAL(3,2),
  id_document_type TEXT,
  id_document_number TEXT,
  id_document_expiry DATE,

  -- Face Verification
  face_verified BOOLEAN DEFAULT FALSE,
  face_verification_score DECIMAL(3,2),
  liveness_check_passed BOOLEAN DEFAULT FALSE,

  -- MetaMap Data
  metamap_verification_id TEXT,
  metamap_identity_status TEXT,
  metamap_selfie_status TEXT,
  metamap_liveness_status TEXT,
  metamap_document_data JSONB,
  metamap_metadata JSONB,
  metamap_verified_at TIMESTAMP WITH TIME ZONE,

  -- Agreements
  agreed_to_terms BOOLEAN DEFAULT FALSE,
  agreed_to_background_check BOOLEAN DEFAULT FALSE,
  agreed_to_data_processing BOOLEAN DEFAULT FALSE,

  -- Status
  verification_status TEXT DEFAULT 'pending' CHECK (
    verification_status IN ('pending', 'documents_submitted', 'under_review', 'approved', 'rejected')
  ),

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

-- ============================================================================
-- 3. VERIFICATION ATTEMPTS TABLE (Audit Log)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.verification_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_profile_id UUID REFERENCES public.host_profiles(id) ON DELETE CASCADE,

  verification_type TEXT NOT NULL CHECK (
    verification_type IN ('id_document', 'face_recognition', 'liveness', 'metamap_full')
  ),

  status TEXT NOT NULL CHECK (status IN ('initiated', 'success', 'failed', 'rejected')),

  -- Verification Details
  verification_provider TEXT DEFAULT 'metamap',
  verification_id TEXT,
  score DECIMAL(3,2),

  -- Error Details (if failed)
  error_message TEXT,
  error_code TEXT,

  -- Raw Data
  raw_response JSONB,

  -- Timestamps
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 4. PROPERTY PHOTOS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.property_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_profile_id UUID REFERENCES public.host_profiles(id) ON DELETE CASCADE,

  -- Photo Data
  photo_url TEXT NOT NULL,
  photo_data TEXT, -- Base64 encoded image (temporary storage)
  filename TEXT NOT NULL,

  -- GPS Location
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  location_accuracy DECIMAL(10, 2),

  -- Metadata
  captured_at TIMESTAMP WITH TIME ZONE NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Session tracking (for QR code uploads)
  upload_session_id TEXT,

  -- Verification
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES public.users(id),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 5. LISTINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID REFERENCES public.users(id) ON DELETE CASCADE,

  -- Basic Information
  title TEXT NOT NULL,
  description TEXT NOT NULL,

  -- Property Details
  property_type TEXT CHECK (property_type IN ('house', 'apartment', 'cabin', 'farm', 'other')),
  bedrooms INTEGER,
  bathrooms INTEGER,
  max_guests INTEGER,

  -- Location
  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  city TEXT,
  region TEXT,
  country TEXT DEFAULT 'Colombia',

  -- Pricing
  price_per_night DECIMAL(10, 2) NOT NULL,
  cleaning_fee DECIMAL(10, 2),

  -- Amenities
  amenities JSONB DEFAULT '[]'::jsonb,

  -- Images
  images JSONB DEFAULT '[]'::jsonb,

  -- Availability
  available BOOLEAN DEFAULT TRUE,

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

-- ============================================================================
-- 6. BOOKINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES public.users(id) ON DELETE CASCADE,

  -- Booking Dates
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,

  -- Pricing
  total_price DECIMAL(10, 2) NOT NULL,
  community_contribution DECIMAL(10, 2),

  -- Status
  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'cancelled', 'completed')
  ),

  -- Guest Information
  number_of_guests INTEGER NOT NULL,

  -- Payment
  payment_status TEXT DEFAULT 'pending' CHECK (
    payment_status IN ('pending', 'paid', 'refunded')
  ),
  payment_method TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_dates CHECK (check_out > check_in)
);

-- ============================================================================
-- 7. COMMUNITY PROJECTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.community_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Project Information
  name TEXT NOT NULL,
  description TEXT NOT NULL,

  -- Location
  location TEXT,
  city TEXT,
  region TEXT,
  country TEXT DEFAULT 'Colombia',

  -- Funding
  goal_amount DECIMAL(10, 2) NOT NULL,
  current_amount DECIMAL(10, 2) DEFAULT 0,

  -- Images
  images JSONB DEFAULT '[]'::jsonb,

  -- Impact
  impact_category TEXT CHECK (
    impact_category IN ('education', 'infrastructure', 'environment', 'health', 'other')
  ),

  -- Status
  status TEXT DEFAULT 'active' CHECK (
    status IN ('active', 'completed', 'cancelled')
  ),

  -- Timestamps
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 8. CONTRIBUTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Contribution Source
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.community_projects(id) ON DELETE CASCADE,

  -- Amount
  amount DECIMAL(10, 2) NOT NULL,

  -- Timestamps
  contributed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Users
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Host Profiles
CREATE INDEX IF NOT EXISTS idx_host_profiles_user_id ON public.host_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_host_profiles_verification_status ON public.host_profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_host_profiles_id_verified ON public.host_profiles(id_verified);

-- Verification Attempts
CREATE INDEX IF NOT EXISTS idx_verification_attempts_host_profile_id ON public.verification_attempts(host_profile_id);
CREATE INDEX IF NOT EXISTS idx_verification_attempts_status ON public.verification_attempts(status);

-- Property Photos
CREATE INDEX IF NOT EXISTS idx_property_photos_host_profile_id ON public.property_photos(host_profile_id);
CREATE INDEX IF NOT EXISTS idx_property_photos_session_id ON public.property_photos(upload_session_id);

-- Listings
CREATE INDEX IF NOT EXISTS idx_listings_host_id ON public.listings(host_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON public.listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_available ON public.listings(available);
CREATE INDEX IF NOT EXISTS idx_listings_city ON public.listings(city);

-- Bookings
CREATE INDEX IF NOT EXISTS idx_bookings_listing_id ON public.bookings(listing_id);
CREATE INDEX IF NOT EXISTS idx_bookings_guest_id ON public.bookings(guest_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON public.bookings(check_in, check_out);

-- Community Projects
CREATE INDEX IF NOT EXISTS idx_community_projects_status ON public.community_projects(status);

-- Contributions
CREATE INDEX IF NOT EXISTS idx_contributions_project_id ON public.contributions(project_id);
CREATE INDEX IF NOT EXISTS idx_contributions_booking_id ON public.contributions(booking_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.host_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

-- Users: Can read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Host Profiles: Can read and update their own profile
CREATE POLICY "Hosts can read own profile" ON public.host_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Hosts can update own profile" ON public.host_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Hosts can insert own profile" ON public.host_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Property Photos: Hosts can manage their own photos
CREATE POLICY "Hosts can read own photos" ON public.property_photos
  FOR SELECT USING (
    host_profile_id IN (SELECT id FROM public.host_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Hosts can insert own photos" ON public.property_photos
  FOR INSERT WITH CHECK (
    host_profile_id IN (SELECT id FROM public.host_profiles WHERE user_id = auth.uid())
  );

-- Listings: Public can read active listings
CREATE POLICY "Anyone can read active listings" ON public.listings
  FOR SELECT USING (status = 'active' AND available = true);

CREATE POLICY "Hosts can manage own listings" ON public.listings
  FOR ALL USING (auth.uid() = host_id);

-- Bookings: Guests can read their own bookings
CREATE POLICY "Guests can read own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = guest_id);

CREATE POLICY "Guests can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = guest_id);

-- Community Projects: Public can read
CREATE POLICY "Anyone can read community projects" ON public.community_projects
  FOR SELECT USING (true);

-- Contributions: Public can read
CREATE POLICY "Anyone can read contributions" ON public.contributions
  FOR SELECT USING (true);

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_host_profiles_updated_at BEFORE UPDATE ON public.host_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_projects_updated_at BEFORE UPDATE ON public.community_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- GRANT PERMISSIONS
-- ============================================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant access to tables
GRANT ALL ON public.users TO authenticated;
GRANT ALL ON public.host_profiles TO authenticated;
GRANT ALL ON public.verification_attempts TO authenticated;
GRANT ALL ON public.property_photos TO authenticated;
GRANT ALL ON public.listings TO authenticated, anon;
GRANT ALL ON public.bookings TO authenticated;
GRANT ALL ON public.community_projects TO authenticated, anon;
GRANT ALL ON public.contributions TO authenticated, anon;

-- ============================================================================
-- SAMPLE DATA (OPTIONAL - Comment out if not needed)
-- ============================================================================

-- Insert sample community project
INSERT INTO public.community_projects (name, description, location, goal_amount, current_amount, impact_category, status)
VALUES
  ('Rural School Renovation', 'Renovate the local school in San Agustin to provide better education facilities for children.', 'San Agustin, Huila', 5000.00, 1250.00, 'education', 'active'),
  ('Clean Water Initiative', 'Install water filtration systems in 5 rural communities.', 'Cauca Region', 8000.00, 3200.00, 'infrastructure', 'active'),
  ('Reforestation Project', 'Plant 1000 native trees in the Colombian coffee region.', 'Coffee Triangle', 3000.00, 2800.00, 'environment', 'active');

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ SPTC Rural Database Schema Installation Complete!';
  RAISE NOTICE '';
  RAISE NOTICE 'Tables created:';
  RAISE NOTICE '  • users';
  RAISE NOTICE '  • host_profiles';
  RAISE NOTICE '  • verification_attempts';
  RAISE NOTICE '  • property_photos';
  RAISE NOTICE '  • listings';
  RAISE NOTICE '  • bookings';
  RAISE NOTICE '  • community_projects';
  RAISE NOTICE '  • contributions';
  RAISE NOTICE '';
  RAISE NOTICE 'Security: Row Level Security (RLS) policies enabled';
  RAISE NOTICE 'Indexes: Performance indexes created';
  RAISE NOTICE 'Triggers: Auto-update timestamps configured';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Update Netlify environment variables with new Supabase credentials';
  RAISE NOTICE '2. Trigger a clean deploy in Netlify';
  RAISE NOTICE '3. Test the registration flow';
END $$;
