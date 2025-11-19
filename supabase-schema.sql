-- SPTC Rural Platform Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('guest', 'host', 'admin')),
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Listings table
CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  host_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  property_type TEXT,
  location TEXT NOT NULL,
  city TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  price DECIMAL(10, 2) NOT NULL,
  bedrooms INTEGER,
  beds INTEGER,
  bathrooms INTEGER,
  max_guests INTEGER,
  amenities JSONB DEFAULT '[]',
  house_rules TEXT,
  cancellation_policy TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Listing photos table
CREATE TABLE listing_photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pricing rules table
CREATE TABLE pricing_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('percentage', 'fixed', 'discount')),
  value DECIMAL(10, 2) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  applies_to TEXT DEFAULT 'all' CHECK (applies_to IN ('all', 'weekends', 'weekdays', 'holidays')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom prices table (for specific dates)
CREATE TABLE custom_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(listing_id, date)
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES users(id) ON DELETE CASCADE,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  adults INTEGER DEFAULT 1,
  children INTEGER DEFAULT 0,
  total_price DECIMAL(10, 2) NOT NULL,
  platform_fee DECIMAL(10, 2),
  host_payout DECIMAL(10, 2),
  community_contribution DECIMAL(10, 2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  special_requests TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Community projects table
CREATE TABLE community_projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  category TEXT,
  goal_amount DECIMAL(10, 2) NOT NULL,
  current_amount DECIMAL(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project contributions table
CREATE TABLE project_contributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES community_projects(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Host verification table
CREATE TABLE host_verification (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  id_document_url TEXT,
  face_photo_url TEXT,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_listings_host_id ON listings(host_id);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_bookings_listing_id ON bookings(listing_id);
CREATE INDEX idx_bookings_guest_id ON bookings(guest_id);
CREATE INDEX idx_bookings_check_in ON bookings(check_in);
CREATE INDEX idx_bookings_check_out ON bookings(check_out);
CREATE INDEX idx_pricing_rules_listing_id ON pricing_rules(listing_id);
CREATE INDEX idx_custom_prices_listing_date ON custom_prices(listing_id, date);
CREATE INDEX idx_listing_photos_listing_id ON listing_photos(listing_id);
CREATE INDEX idx_reviews_listing_id ON reviews(listing_id);
CREATE INDEX idx_project_contributions_project_id ON project_contributions(project_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at columns
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_listings_updated_at BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_community_projects_updated_at BEFORE UPDATE ON community_projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_host_verification_updated_at BEFORE UPDATE ON host_verification
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE host_verification ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (you can customize these based on your needs)

-- Users can read their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Anyone can view approved listings
CREATE POLICY "Anyone can view approved listings" ON listings
  FOR SELECT USING (status = 'approved');

-- Hosts can manage their own listings
CREATE POLICY "Hosts can manage own listings" ON listings
  FOR ALL USING (auth.uid() = host_id);

-- Anyone can view listing photos for approved listings
CREATE POLICY "Anyone can view listing photos" ON listing_photos
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = listing_photos.listing_id
      AND listings.status = 'approved'
    )
  );

-- Hosts can manage their own pricing rules
CREATE POLICY "Hosts can manage own pricing rules" ON pricing_rules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = pricing_rules.listing_id
      AND listings.host_id = auth.uid()
    )
  );

-- Hosts can manage their own custom prices
CREATE POLICY "Hosts can manage own custom prices" ON custom_prices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = custom_prices.listing_id
      AND listings.host_id = auth.uid()
    )
  );

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings" ON bookings
  FOR SELECT USING (auth.uid() = guest_id);

-- Hosts can view bookings for their listings
CREATE POLICY "Hosts can view listing bookings" ON bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM listings
      WHERE listings.id = bookings.listing_id
      AND listings.host_id = auth.uid()
    )
  );

-- Anyone can view community projects
CREATE POLICY "Anyone can view community projects" ON community_projects
  FOR SELECT USING (true);

-- Users can view their own verification status
CREATE POLICY "Users can view own verification" ON host_verification
  FOR SELECT USING (auth.uid() = user_id);

-- Users can create their own verification
CREATE POLICY "Users can create own verification" ON host_verification
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Anyone can view reviews for approved listings
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

-- Host Profiles Table (for MetaMap verification)
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

CREATE INDEX idx_host_profiles_user_id ON host_profiles(user_id);
CREATE INDEX idx_host_profiles_email ON host_profiles(email);
CREATE INDEX idx_verification_attempts_host_id ON verification_attempts(host_profile_id);

ALTER TABLE host_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hosts can view own profile" ON host_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Hosts can update own profile" ON host_profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_host_profiles_updated_at BEFORE UPDATE ON host_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample community projects
INSERT INTO community_projects (name, description, location, category, goal_amount, current_amount, status, image_url) VALUES
  ('Clean Water Initiative', 'Building clean water filtration systems for 3 rural schools serving 250 children. Providing access to safe drinking water and improving health outcomes.', 'San Vicente, Antioquia', 'Infrastructure', 10000, 7000, 'active', 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80'),
  ('Rural School Library Project', 'Creating a community library with 500+ books and educational materials for children in remote rural areas with limited access to resources.', 'Fusagasugá, Cundinamarca', 'Education', 8000, 3300, 'active', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80'),
  ('Reforestation Initiative', 'Planting 5,000 native trees in deforested areas to restore ecosystems and combat climate change, working with local farmers.', 'Coffee Region', 'Environment', 12000, 12000, 'completed', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80');
