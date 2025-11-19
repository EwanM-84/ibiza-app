# Database Setup Instructions

## Problem
The application is showing this error:
```
Could not find the table 'public.host_profiles' in the schema cache
```

This is because the `host_profiles` table and related tables haven't been created in your Supabase database yet.

## Solution
You need to run the SQL schema file to create all the necessary tables.

## Step-by-Step Instructions

### Option 1: Via Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `ywfhrqgjiudngpdarfzy`

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy the SQL below and paste into the SQL Editor**

```sql
-- Host Profiles Table
-- Stores verified host account information
CREATE TABLE IF NOT EXISTS host_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Personal Information
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50) NOT NULL,
  date_of_birth DATE NOT NULL,

  -- Location
  country VARCHAR(100) NOT NULL DEFAULT 'Colombia',
  city VARCHAR(100) NOT NULL,
  address TEXT,

  -- Verification Status
  verification_status VARCHAR(50) DEFAULT 'pending' CHECK (verification_status IN ('pending', 'documents_submitted', 'under_review', 'approved', 'rejected', 'suspended')),
  verification_notes TEXT,
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES auth.users(id),

  -- Identity Verification
  id_document_url TEXT,
  id_document_type VARCHAR(50), -- passport, national_id, driver_license
  id_document_number VARCHAR(100),
  id_document_expiry DATE,
  id_verified BOOLEAN DEFAULT FALSE,
  id_verification_score DECIMAL(5,2), -- 0-100 confidence score

  -- Biometric Verification
  face_photo_url TEXT,
  face_verified BOOLEAN DEFAULT FALSE,
  face_verification_score DECIMAL(5,2), -- 0-100 confidence score
  liveness_check_passed BOOLEAN DEFAULT FALSE,

  -- Background Checks
  background_check_status VARCHAR(50) DEFAULT 'pending' CHECK (background_check_status IN ('pending', 'in_progress', 'clear', 'flagged', 'failed')),
  background_check_completed_at TIMESTAMP WITH TIME ZONE,
  criminal_record_check BOOLEAN DEFAULT FALSE,

  -- Agreements & Consent
  agreed_to_terms BOOLEAN DEFAULT FALSE NOT NULL,
  agreed_to_background_check BOOLEAN DEFAULT FALSE NOT NULL,
  agreed_to_data_processing BOOLEAN DEFAULT FALSE NOT NULL,
  terms_accepted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Host Status
  is_active BOOLEAN DEFAULT FALSE,
  listing_count INTEGER DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2) DEFAULT 0.00,

  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT check_age CHECK (EXTRACT(YEAR FROM AGE(date_of_birth)) >= 18)
);

-- Property Verification Table
-- Stores property photos with GPS verification
CREATE TABLE IF NOT EXISTS property_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_profile_id UUID REFERENCES host_profiles(id) ON DELETE CASCADE,

  -- Photo Information
  photo_url TEXT NOT NULL,
  photo_order INTEGER NOT NULL,

  -- GPS Verification
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  location_accuracy DECIMAL(10, 2), -- meters
  gps_verified BOOLEAN DEFAULT FALSE,

  -- Photo Metadata
  taken_at TIMESTAMP WITH TIME ZONE NOT NULL,
  device_info TEXT,

  -- Verification Status
  verified BOOLEAN DEFAULT FALSE,
  verification_notes TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Identity Verification Attempts Table
-- Audit log for all verification attempts
CREATE TABLE IF NOT EXISTS verification_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_profile_id UUID REFERENCES host_profiles(id) ON DELETE CASCADE,

  -- Attempt Details
  verification_type VARCHAR(50) NOT NULL, -- id_document, face_recognition, background_check
  status VARCHAR(50) NOT NULL, -- pending, success, failed, retry_needed
  confidence_score DECIMAL(5,2),

  -- Provider Information (for third-party verification services)
  provider_name VARCHAR(100), -- e.g., Jumio, Onfido, Stripe Identity
  provider_transaction_id VARCHAR(255),
  provider_response JSONB,

  -- Failure Details
  failure_reason TEXT,
  retry_count INTEGER DEFAULT 0,

  -- Metadata
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Host Banking Information Table
-- For payment processing (encrypted)
CREATE TABLE IF NOT EXISTS host_banking_info (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_profile_id UUID REFERENCES host_profiles(id) ON DELETE CASCADE,

  -- Bank Account Details (should be encrypted at application level)
  account_holder_name VARCHAR(255) NOT NULL,
  bank_name VARCHAR(255) NOT NULL,
  account_number_encrypted TEXT NOT NULL, -- Store encrypted
  routing_number_encrypted TEXT,
  account_type VARCHAR(50), -- checking, savings

  -- Verification
  bank_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,

  -- Payment Provider
  stripe_account_id VARCHAR(255),
  paypal_email VARCHAR(255),

  -- Status
  is_active BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Security Flags Table
-- Track security incidents and flags
CREATE TABLE IF NOT EXISTS host_security_flags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_profile_id UUID REFERENCES host_profiles(id) ON DELETE CASCADE,

  flag_type VARCHAR(100) NOT NULL, -- suspicious_activity, fake_document, multiple_accounts, etc.
  severity VARCHAR(50) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  description TEXT NOT NULL,

  -- Resolution
  status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'false_positive')),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by UUID REFERENCES auth.users(id),
  resolution_notes TEXT,

  -- Source
  detected_by VARCHAR(100), -- system, admin, user_report
  evidence JSONB,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_host_profiles_user_id ON host_profiles(user_id);
CREATE INDEX idx_host_profiles_email ON host_profiles(email);
CREATE INDEX idx_host_profiles_verification_status ON host_profiles(verification_status);
CREATE INDEX idx_host_profiles_created_at ON host_profiles(created_at);

CREATE INDEX idx_property_verifications_host_id ON property_verifications(host_profile_id);
CREATE INDEX idx_property_verifications_gps ON property_verifications(latitude, longitude);

CREATE INDEX idx_verification_attempts_host_id ON verification_attempts(host_profile_id);
CREATE INDEX idx_verification_attempts_status ON verification_attempts(status);
CREATE INDEX idx_verification_attempts_created_at ON verification_attempts(created_at);

CREATE INDEX idx_host_security_flags_host_id ON host_security_flags(host_profile_id);
CREATE INDEX idx_host_security_flags_status ON host_security_flags(status);
CREATE INDEX idx_host_security_flags_severity ON host_security_flags(severity);

-- Row Level Security Policies

-- Enable RLS
ALTER TABLE host_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE host_banking_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE host_security_flags ENABLE ROW LEVEL SECURITY;

-- Host Profiles: Hosts can read/update their own profile
CREATE POLICY "Hosts can view own profile" ON host_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Hosts can update own profile" ON host_profiles
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON host_profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Property Verifications: Hosts can manage their own property photos
CREATE POLICY "Hosts can manage own property verifications" ON property_verifications
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM host_profiles
      WHERE host_profiles.id = property_verifications.host_profile_id
      AND host_profiles.user_id = auth.uid()
    )
  );

-- Verification Attempts: Hosts can view their own attempts
CREATE POLICY "Hosts can view own verification attempts" ON verification_attempts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM host_profiles
      WHERE host_profiles.id = verification_attempts.host_profile_id
      AND host_profiles.user_id = auth.uid()
    )
  );

-- Banking Info: Hosts can manage their own banking info
CREATE POLICY "Hosts can manage own banking info" ON host_banking_info
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM host_profiles
      WHERE host_profiles.id = host_banking_info.host_profile_id
      AND host_profiles.user_id = auth.uid()
    )
  );

-- Security Flags: Only admins can view/manage
CREATE POLICY "Only admins can manage security flags" ON host_security_flags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_host_profiles_updated_at BEFORE UPDATE ON host_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_host_banking_info_updated_at BEFORE UPDATE ON host_banking_info
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check verification completeness
CREATE OR REPLACE FUNCTION check_host_verification_complete(host_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  profile_record host_profiles%ROWTYPE;
  property_count INTEGER;
BEGIN
  SELECT * INTO profile_record FROM host_profiles WHERE id = host_id;

  -- Check if all required verifications are complete
  IF profile_record.id_verified = FALSE THEN
    RETURN FALSE;
  END IF;

  IF profile_record.face_verified = FALSE THEN
    RETURN FALSE;
  END IF;

  -- Check for at least 5 property photos with GPS
  SELECT COUNT(*) INTO property_count
  FROM property_verifications
  WHERE host_profile_id = host_id AND gps_verified = TRUE;

  IF property_count < 5 THEN
    RETURN FALSE;
  END IF;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Comments for documentation
COMMENT ON TABLE host_profiles IS 'Stores comprehensive host profile information including verification status and biometric data';
COMMENT ON TABLE property_verifications IS 'GPS-verified property photos to confirm property location and authenticity';
COMMENT ON TABLE verification_attempts IS 'Audit log of all identity verification attempts for compliance and security';
COMMENT ON TABLE host_banking_info IS 'Encrypted banking information for host payouts';
COMMENT ON TABLE host_security_flags IS 'Security incidents and flags for fraud prevention';
```

4. **Click "Run"** (or press Ctrl+Enter)

5. **Verify Success**
   - You should see: "Success. No rows returned"
   - Check "Table Editor" → you should now see these tables:
     - ✅ host_profiles
     - ✅ property_verifications
     - ✅ verification_attempts
     - ✅ host_banking_info
     - ✅ host_security_flags

### Option 2: Via Supabase CLI (Advanced)

If you have Supabase CLI installed:

```bash
# Navigate to project directory
cd C:\Users\ewanm\OneDrive\Desktop\sptc-rural-project\sptc-rural

# Run the schema file
supabase db push --db-url "postgresql://postgres:[YOUR-PASSWORD]@db.ywfhrqgjiudngpdarfzy.supabase.co:5432/postgres" --file database/host_verification_schema.sql
```

## What This Schema Creates

### Tables Created:

1. **host_profiles**
   - Stores host personal information
   - Verification status and scores
   - Identity document data
   - Biometric verification data
   - Agreements and consent tracking

2. **property_verifications**
   - GPS-verified property photos
   - Location coordinates
   - Photo metadata

3. **verification_attempts**
   - Audit log of all verification attempts
   - Tracks MetaMap verification responses
   - Provider transaction IDs

4. **host_banking_info**
   - Bank account details (encrypted)
   - Payment provider integration
   - Stripe/PayPal account IDs

5. **host_security_flags**
   - Security incident tracking
   - Fraud detection flags
   - Investigation status

### Security Features:

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Hosts can only see their own data
- ✅ Admins can see all data
- ✅ Automatic timestamp updates
- ✅ Age verification (must be 18+)

## After Running the Schema

1. **Refresh your application**
   - The error should disappear
   - Host registration should work

2. **Test the flow**
   - Go to: http://localhost:3000/host/register
   - Fill out the registration form
   - Submit and verify it creates a host_profile record

3. **Check Supabase Dashboard**
   - Go to Table Editor → host_profiles
   - You should see your new host profile record

## Troubleshooting

### Error: "permission denied for schema public"
**Solution:** Make sure you're logged in as the database owner in Supabase dashboard

### Error: "extension uuid-ossp does not exist"
**Solution:** Run this first:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### Error: "relation auth.users does not exist"
**Solution:** This means Supabase auth isn't set up. This shouldn't happen in a Supabase project, but if it does, contact Supabase support.

### Tables created but still getting error
**Solution:**
1. Restart your Next.js dev server
2. Clear browser cache (Ctrl + Shift + R)
3. Check Supabase project URL in .env.local matches your actual project

## Need Help?

If you encounter any issues:
1. Check the Supabase logs in Dashboard → Logs
2. Check the browser console for detailed error messages
3. Verify your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correct in .env.local
