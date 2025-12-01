-- QUICK START - Run this first in Supabase SQL Editor
-- This creates the essential tables needed for host registration

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Host Profiles Table
CREATE TABLE IF NOT EXISTS public.host_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  country TEXT DEFAULT 'Colombia',
  city TEXT,
  date_of_birth DATE,

  id_verified BOOLEAN DEFAULT FALSE,
  face_verified BOOLEAN DEFAULT FALSE,

  metamap_verification_id TEXT,
  metamap_identity_status TEXT,
  metamap_selfie_status TEXT,

  agreed_to_terms BOOLEAN DEFAULT FALSE,
  agreed_to_background_check BOOLEAN DEFAULT FALSE,
  agreed_to_data_processing BOOLEAN DEFAULT FALSE,

  verification_status TEXT DEFAULT 'pending',

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(user_id)
);

-- Property Photos Table
CREATE TABLE IF NOT EXISTS public.property_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_profile_id UUID REFERENCES public.host_profiles(id) ON DELETE CASCADE,

  photo_url TEXT NOT NULL,
  filename TEXT NOT NULL,

  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,

  captured_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.host_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_photos ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON public.host_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.host_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.host_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own photos" ON public.property_photos
  FOR SELECT USING (
    host_profile_id IN (SELECT id FROM public.host_profiles WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can insert own photos" ON public.property_photos
  FOR INSERT WITH CHECK (
    host_profile_id IN (SELECT id FROM public.host_profiles WHERE user_id = auth.uid())
  );

-- Indexes
CREATE INDEX IF NOT EXISTS idx_host_profiles_user_id ON public.host_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_property_photos_host_id ON public.property_photos(host_profile_id);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.host_profiles TO authenticated;
GRANT ALL ON public.property_photos TO authenticated;
