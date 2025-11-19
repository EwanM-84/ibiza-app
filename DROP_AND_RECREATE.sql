-- ============================================================================
-- DROP EXISTING TABLES AND RECREATE EVERYTHING
-- ============================================================================
-- WARNING: This will delete all existing data!
-- ============================================================================

-- Drop all policies first
DROP POLICY IF EXISTS "Hosts can read own profile" ON public.host_profiles;
DROP POLICY IF EXISTS "Hosts can update own profile" ON public.host_profiles;
DROP POLICY IF EXISTS "Hosts can insert own profile" ON public.host_profiles;
DROP POLICY IF EXISTS "Hosts can read own photos" ON public.property_photos;
DROP POLICY IF EXISTS "Hosts can insert own photos" ON public.property_photos;
DROP POLICY IF EXISTS "Anyone can read active listings" ON public.listings;
DROP POLICY IF EXISTS "Hosts can manage own listings" ON public.listings;
DROP POLICY IF EXISTS "Guests can read own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Guests can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Anyone can read community projects" ON public.community_projects;
DROP POLICY IF EXISTS "Anyone can read contributions" ON public.contributions;

-- Drop tables in correct order (child tables first)
DROP TABLE IF EXISTS public.contributions CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.listings CASCADE;
DROP TABLE IF EXISTS public.property_photos CASCADE;
DROP TABLE IF EXISTS public.verification_attempts CASCADE;
DROP TABLE IF EXISTS public.host_profiles CASCADE;
DROP TABLE IF EXISTS public.community_projects CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- HOST PROFILES TABLE
-- ============================================================================
CREATE TABLE public.host_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  country TEXT DEFAULT 'Colombia',
  city TEXT,
  date_of_birth DATE,

  id_verified BOOLEAN DEFAULT FALSE,
  id_verification_score DECIMAL(3,2),
  id_document_type TEXT,
  id_document_number TEXT,
  id_document_expiry DATE,

  face_verified BOOLEAN DEFAULT FALSE,
  face_verification_score DECIMAL(3,2),
  liveness_check_passed BOOLEAN DEFAULT FALSE,

  metamap_verification_id TEXT,
  metamap_identity_status TEXT,
  metamap_selfie_status TEXT,
  metamap_liveness_status TEXT,
  metamap_document_data JSONB,
  metamap_metadata JSONB,
  metamap_verified_at TIMESTAMP WITH TIME ZONE,

  agreed_to_terms BOOLEAN DEFAULT FALSE,
  agreed_to_background_check BOOLEAN DEFAULT FALSE,
  agreed_to_data_processing BOOLEAN DEFAULT FALSE,

  verification_status TEXT DEFAULT 'pending' CHECK (
    verification_status IN ('pending', 'documents_submitted', 'under_review', 'approved', 'rejected')
  ),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

-- ============================================================================
-- VERIFICATION ATTEMPTS TABLE
-- ============================================================================
CREATE TABLE public.verification_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_profile_id UUID REFERENCES public.host_profiles(id) ON DELETE CASCADE,

  verification_type TEXT NOT NULL CHECK (
    verification_type IN ('id_document', 'face_recognition', 'liveness', 'metamap_full')
  ),

  status TEXT NOT NULL CHECK (status IN ('initiated', 'success', 'failed', 'rejected')),

  verification_provider TEXT DEFAULT 'metamap',
  verification_id TEXT,
  score DECIMAL(3,2),

  error_message TEXT,
  error_code TEXT,

  raw_response JSONB,

  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PROPERTY PHOTOS TABLE
-- ============================================================================
CREATE TABLE public.property_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_profile_id UUID REFERENCES public.host_profiles(id) ON DELETE CASCADE,

  photo_url TEXT NOT NULL,
  photo_data TEXT,
  filename TEXT NOT NULL,

  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  location_accuracy DECIMAL(10, 2),

  captured_at TIMESTAMP WITH TIME ZONE NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  upload_session_id TEXT,

  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- LISTINGS TABLE
-- ============================================================================
CREATE TABLE public.listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  description TEXT NOT NULL,

  property_type TEXT CHECK (property_type IN ('house', 'apartment', 'cabin', 'farm', 'other')),
  bedrooms INTEGER,
  bathrooms INTEGER,
  max_guests INTEGER,

  location TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  city TEXT,
  region TEXT,
  country TEXT DEFAULT 'Colombia',

  price_per_night DECIMAL(10, 2) NOT NULL,
  cleaning_fee DECIMAL(10, 2),

  amenities JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,

  available BOOLEAN DEFAULT TRUE,
  community_contribution_percentage INTEGER DEFAULT 10,

  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'active', 'inactive', 'suspended')
  ),

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- BOOKINGS TABLE
-- ============================================================================
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  check_in DATE NOT NULL,
  check_out DATE NOT NULL,

  total_price DECIMAL(10, 2) NOT NULL,
  community_contribution DECIMAL(10, 2),

  status TEXT DEFAULT 'pending' CHECK (
    status IN ('pending', 'confirmed', 'cancelled', 'completed')
  ),

  number_of_guests INTEGER NOT NULL,

  payment_status TEXT DEFAULT 'pending' CHECK (
    payment_status IN ('pending', 'paid', 'refunded')
  ),
  payment_method TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT valid_dates CHECK (check_out > check_in)
);

-- ============================================================================
-- COMMUNITY PROJECTS TABLE
-- ============================================================================
CREATE TABLE public.community_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  name TEXT NOT NULL,
  description TEXT NOT NULL,

  location TEXT,
  city TEXT,
  region TEXT,
  country TEXT DEFAULT 'Colombia',

  goal_amount DECIMAL(10, 2) NOT NULL,
  current_amount DECIMAL(10, 2) DEFAULT 0,

  images JSONB DEFAULT '[]'::jsonb,

  impact_category TEXT CHECK (
    impact_category IN ('education', 'infrastructure', 'environment', 'health', 'other')
  ),

  status TEXT DEFAULT 'active' CHECK (
    status IN ('active', 'completed', 'cancelled')
  ),

  start_date DATE,
  end_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CONTRIBUTIONS TABLE
-- ============================================================================
CREATE TABLE public.contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  project_id UUID REFERENCES public.community_projects(id) ON DELETE CASCADE,

  amount DECIMAL(10, 2) NOT NULL,

  contributed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
CREATE INDEX idx_host_profiles_user_id ON public.host_profiles(user_id);
CREATE INDEX idx_host_profiles_verification_status ON public.host_profiles(verification_status);
CREATE INDEX idx_verification_attempts_host_profile_id ON public.verification_attempts(host_profile_id);
CREATE INDEX idx_property_photos_host_profile_id ON public.property_photos(host_profile_id);
CREATE INDEX idx_listings_host_id ON public.listings(host_id);
CREATE INDEX idx_listings_status ON public.listings(status);
CREATE INDEX idx_bookings_listing_id ON public.bookings(listing_id);
CREATE INDEX idx_bookings_guest_id ON public.bookings(guest_id);
CREATE INDEX idx_contributions_project_id ON public.contributions(project_id);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
ALTER TABLE public.host_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;

-- Host Profiles Policies
CREATE POLICY "Hosts can read own profile" ON public.host_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Hosts can update own profile" ON public.host_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Hosts can insert own profile" ON public.host_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Property Photos Policies
CREATE POLICY "Hosts can read own photos" ON public.property_photos
  FOR SELECT USING (
    host_profile_id IN (SELECT id FROM public.host_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Hosts can insert own photos" ON public.property_photos
  FOR INSERT WITH CHECK (
    host_profile_id IN (SELECT id FROM public.host_profiles WHERE user_id = auth.uid())
  );

-- Listings Policies
CREATE POLICY "Anyone can read active listings" ON public.listings
  FOR SELECT USING (status = 'active' AND available = true);

CREATE POLICY "Hosts can manage own listings" ON public.listings
  FOR ALL USING (auth.uid() = host_id);

-- Bookings Policies
CREATE POLICY "Guests can read own bookings" ON public.bookings
  FOR SELECT USING (auth.uid() = guest_id);

CREATE POLICY "Guests can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (auth.uid() = guest_id);

-- Community Projects Policies
CREATE POLICY "Anyone can read community projects" ON public.community_projects
  FOR SELECT USING (true);

-- Contributions Policies
CREATE POLICY "Anyone can read contributions" ON public.contributions
  FOR SELECT USING (true);

-- ============================================================================
-- TRIGGERS
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_host_profiles_updated_at BEFORE UPDATE ON public.host_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON public.listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_projects_updated_at BEFORE UPDATE ON public.community_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- PERMISSIONS
-- ============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.host_profiles TO authenticated;
GRANT ALL ON public.verification_attempts TO authenticated;
GRANT ALL ON public.property_photos TO authenticated;
GRANT ALL ON public.listings TO authenticated, anon;
GRANT ALL ON public.bookings TO authenticated;
GRANT ALL ON public.community_projects TO authenticated, anon;
GRANT ALL ON public.contributions TO authenticated, anon;

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================
INSERT INTO public.community_projects (name, description, location, goal_amount, current_amount, impact_category, status)
VALUES
  ('Rural School Renovation', 'Renovate the local school in San Agustin to provide better education facilities for children.', 'San Agustin, Huila', 5000.00, 1250.00, 'education', 'active'),
  ('Clean Water Initiative', 'Install water filtration systems in 5 rural communities.', 'Cauca Region', 8000.00, 3200.00, 'infrastructure', 'active'),
  ('Reforestation Project', 'Plant 1000 native trees in the Colombian coffee region.', 'Coffee Triangle', 3000.00, 2800.00, 'environment', 'active');
