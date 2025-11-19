-- Run ONLY this in Supabase SQL Editor
-- This adds the missing host_profiles table

CREATE TABLE IF NOT EXISTS host_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  date_of_birth DATE NOT NULL,
  country VARCHAR(100) NOT NULL DEFAULT 'Colombia',
  city VARCHAR(100) NOT NULL,
  address TEXT,
  verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'documents_submitted', 'under_review', 'approved', 'rejected', 'suspended')),
  verification_notes TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES auth.users(id),
  id_document_url TEXT,
  id_document_type VARCHAR(50),
  id_document_number VARCHAR(100),
  id_document_expiry DATE,
  id_verified BOOLEAN DEFAULT FALSE,
  id_verification_score DECIMAL(5,2),
  face_photo_url TEXT,
  face_verified BOOLEAN DEFAULT FALSE,
  face_verification_score DECIMAL(5,2),
  liveness_check_passed BOOLEAN DEFAULT FALSE,
  background_check_status VARCHAR(50) DEFAULT 'pending',
  background_check_completed_at TIMESTAMP WITH TIME ZONE,
  criminal_record_check BOOLEAN DEFAULT FALSE,
  agreed_to_terms BOOLEAN DEFAULT FALSE NOT NULL,
  agreed_to_background_check BOOLEAN DEFAULT FALSE NOT NULL,
  agreed_to_data_processing BOOLEAN DEFAULT FALSE NOT NULL,
  terms_accepted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT FALSE,
  listing_count INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT check_age CHECK (EXTRACT(YEAR FROM AGE(date_of_birth)) >= 18)
);

CREATE TABLE IF NOT EXISTS verification_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_profile_id UUID REFERENCES host_profiles(id) ON DELETE CASCADE,
  verification_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  confidence_score DECIMAL(5,2),
  provider_name VARCHAR(100),
  provider_transaction_id VARCHAR(255),
  provider_response JSONB,
  failure_reason TEXT,
  retry_count INTEGER DEFAULT 0,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_host_profiles_user_id ON host_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_host_profiles_email ON host_profiles(email);
CREATE INDEX IF NOT EXISTS idx_verification_attempts_host_id ON verification_attempts(host_profile_id);

ALTER TABLE host_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_attempts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Hosts can view own profile" ON host_profiles;
CREATE POLICY "Hosts can view own profile" ON host_profiles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Hosts can update own profile" ON host_profiles;
CREATE POLICY "Hosts can update own profile" ON host_profiles FOR UPDATE USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS update_host_profiles_updated_at ON host_profiles;
CREATE TRIGGER update_host_profiles_updated_at BEFORE UPDATE ON host_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
