-- Run this ENTIRE file in Supabase SQL Editor to fix the database error

-- Drop existing tables
DROP TABLE IF EXISTS public.verification_attempts CASCADE;
DROP TABLE IF EXISTS public.photo_sessions CASCADE;
DROP TABLE IF EXISTS public.property_photos CASCADE;
DROP TABLE IF EXISTS public.host_profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- HOST PROFILES TABLE (referencing auth.users, not public.users)
-- ============================================================================
CREATE TABLE public.host_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

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

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PHOTO SESSIONS TABLE
-- ============================================================================
CREATE TABLE public.photo_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_profile_id UUID REFERENCES public.host_profiles(id) ON DELETE CASCADE,

  session_type TEXT NOT NULL CHECK (session_type IN ('property', 'identity', 'other')),
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'cancelled')),

  total_photos INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- PROPERTY PHOTOS TABLE
-- ============================================================================
CREATE TABLE public.property_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID REFERENCES public.photo_sessions(id) ON DELETE CASCADE,
  host_profile_id UUID REFERENCES public.host_profiles(id) ON DELETE CASCADE,

  photo_url TEXT NOT NULL,
  photo_type TEXT NOT NULL CHECK (
    photo_type IN ('exterior', 'interior', 'bedroom', 'bathroom', 'kitchen', 'amenity', 'other')
  ),

  -- GPS Verification
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  gps_accuracy DECIMAL(10, 2),
  gps_verified BOOLEAN DEFAULT FALSE,

  -- Photo Metadata
  capture_timestamp TIMESTAMP WITH TIME ZONE,
  device_info JSONB,
  exif_data JSONB,

  -- Verification Status
  verification_status TEXT DEFAULT 'pending' CHECK (
    verification_status IN ('pending', 'approved', 'rejected', 'flagged')
  ),
  admin_notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.host_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.photo_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies for host_profiles
CREATE POLICY "Users can view own profile" ON public.host_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.host_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.host_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for verification_attempts
CREATE POLICY "Users can view own verification attempts" ON public.verification_attempts
  FOR SELECT USING (
    host_profile_id IN (SELECT id FROM public.host_profiles WHERE user_id = auth.uid())
  );

-- RLS Policies for photo_sessions
CREATE POLICY "Users can view own photo sessions" ON public.photo_sessions
  FOR SELECT USING (
    host_profile_id IN (SELECT id FROM public.host_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own photo sessions" ON public.photo_sessions
  FOR INSERT WITH CHECK (
    host_profile_id IN (SELECT id FROM public.host_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update own photo sessions" ON public.photo_sessions
  FOR UPDATE USING (
    host_profile_id IN (SELECT id FROM public.host_profiles WHERE user_id = auth.uid())
  );

-- RLS Policies for property_photos
CREATE POLICY "Users can view own property photos" ON public.property_photos
  FOR SELECT USING (
    host_profile_id IN (SELECT id FROM public.host_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own property photos" ON public.property_photos
  FOR INSERT WITH CHECK (
    host_profile_id IN (SELECT id FROM public.host_profiles WHERE user_id = auth.uid())
  );
