-- ============================================================================
-- SPTC RURAL - COMBINED SQL FILE (ALL 5 SCRIPTS)
-- ============================================================================
-- Run this ENTIRE file in Supabase SQL Editor
-- ============================================================================


-- ============================================================================
-- 1. FIX RLS POLICIES FOR ADMIN PANEL ACCESS
-- ============================================================================

-- HOST PROFILES - Allow public read (for admin listing)
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

-- LISTINGS - Allow public read and admin write
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

-- BOOKINGS - Allow public read for admin
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

-- COMMUNITY PROJECTS - Allow full access
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

-- HOMEPAGE CONTENT - Allow full access (if table exists)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'homepage_content') THEN
    EXECUTE 'DROP POLICY IF EXISTS "Anyone can read active homepage content" ON public.homepage_content';
    EXECUTE 'DROP POLICY IF EXISTS "Admins can manage homepage content" ON public.homepage_content';
    EXECUTE 'CREATE POLICY "Anyone can read homepage content" ON public.homepage_content FOR SELECT USING (true)';
    EXECUTE 'CREATE POLICY "Anyone can manage homepage content" ON public.homepage_content FOR ALL USING (true)';
  END IF;
END $$;

-- PROPERTY PHOTOS - Allow read access
DROP POLICY IF EXISTS "Anyone can read property photos" ON public.property_photos;
CREATE POLICY "Anyone can read property photos" ON public.property_photos
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can insert property photos" ON public.property_photos;
CREATE POLICY "Anyone can insert property photos" ON public.property_photos
  FOR INSERT WITH CHECK (true);

-- FIX LISTINGS TABLE - Add missing columns
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='listings' AND column_name='host_profile_id') THEN
    ALTER TABLE public.listings ADD COLUMN host_profile_id UUID REFERENCES public.host_profiles(id);
  END IF;
END $$;

-- GRANT PERMISSIONS
GRANT ALL ON public.host_profiles TO anon, authenticated;
GRANT ALL ON public.listings TO anon, authenticated;
GRANT ALL ON public.bookings TO anon, authenticated;
GRANT ALL ON public.community_projects TO anon, authenticated;
GRANT ALL ON public.property_photos TO anon, authenticated;

DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'homepage_content') THEN
    EXECUTE 'GRANT ALL ON public.homepage_content TO anon, authenticated';
  END IF;
END $$;


-- ============================================================================
-- 2. CREATE HOMEPAGE CONTENT TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS homepage_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key VARCHAR(100) UNIQUE NOT NULL,
  title_en TEXT NOT NULL,
  title_es TEXT NOT NULL,
  description_en TEXT,
  description_es TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_homepage_content_section_key ON homepage_content(section_key);
CREATE INDEX IF NOT EXISTS idx_homepage_content_active ON homepage_content(is_active);

ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read active homepage content" ON public.homepage_content;
DROP POLICY IF EXISTS "Admins can manage homepage content" ON public.homepage_content;
DROP POLICY IF EXISTS "Anyone can read homepage content" ON public.homepage_content;
DROP POLICY IF EXISTS "Anyone can manage homepage content" ON public.homepage_content;

CREATE POLICY "Anyone can read homepage content" ON public.homepage_content FOR SELECT USING (true);
CREATE POLICY "Anyone can manage homepage content" ON public.homepage_content FOR ALL USING (true);

INSERT INTO homepage_content (section_key, title_en, title_es, description_en, description_es, items, display_order)
VALUES (
  'community_projects',
  'Current community projects',
  'Proyectos comunitarios actuales',
  'Help us reach our goals and make a lasting difference in rural Colombia',
  'Ayúdanos a alcanzar nuestras metas y hacer una diferencia duradera en la Colombia rural',
  '[
    {
      "id": "1",
      "image_url": "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80",
      "title_en": "School Renovation",
      "title_es": "Renovación de Escuela",
      "description_en": "Improving educational facilities in rural areas",
      "description_es": "Mejorando las instalaciones educativas en áreas rurales",
      "goal": 5000,
      "raised": 3200
    },
    {
      "id": "2",
      "image_url": "https://images.unsplash.com/photo-1594708767771-a7502f38b0ff?w=800&q=80",
      "title_en": "Clean Water Initiative",
      "title_es": "Iniciativa de Agua Limpia",
      "description_en": "Bringing clean water to remote communities",
      "description_es": "Llevando agua limpia a comunidades remotas",
      "goal": 8000,
      "raised": 6500
    },
    {
      "id": "3",
      "image_url": "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&q=80",
      "title_en": "Women Artisan Collective",
      "title_es": "Colectivo de Artesanas",
      "description_en": "Supporting local crafts and traditions",
      "description_es": "Apoyando artesanías y tradiciones locales",
      "goal": 3000,
      "raised": 2800
    }
  ]'::jsonb,
  1
) ON CONFLICT (section_key) DO NOTHING;

INSERT INTO homepage_content (section_key, title_en, title_es, description_en, description_es, items, display_order)
VALUES (
  'destinations',
  'Explore Colombian destinations',
  'Explora destinos colombianos',
  'Authentic rural experiences across Colombia',
  'Experiencias rurales auténticas en toda Colombia',
  '[
    {
      "id": "1",
      "image_url": "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=800&q=80",
      "title_en": "Coffee Region",
      "title_es": "Región Cafetera",
      "description_en": "Experience authentic coffee culture",
      "description_es": "Experimenta la auténtica cultura cafetera",
      "link": "/search?region=Coffee%20Region"
    },
    {
      "id": "2",
      "image_url": "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&q=80",
      "title_en": "Andean Mountains",
      "title_es": "Montañas Andinas",
      "description_en": "Breathtaking mountain landscapes",
      "description_es": "Paisajes montañosos impresionantes",
      "link": "/search?region=Andean%20Mountains"
    },
    {
      "id": "3",
      "image_url": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
      "title_en": "Caribbean Coast",
      "title_es": "Costa Caribe",
      "description_en": "Tropical paradise and rich culture",
      "description_es": "Paraíso tropical y rica cultura",
      "link": "/search?region=Caribbean%20Coast"
    },
    {
      "id": "4",
      "image_url": "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80",
      "title_en": "Amazon Rainforest",
      "title_es": "Selva Amazónica",
      "description_en": "Explore the worlds largest rainforest",
      "description_es": "Explora la selva más grande del mundo",
      "link": "/search?region=Amazon"
    }
  ]'::jsonb,
  2
) ON CONFLICT (section_key) DO NOTHING;

CREATE OR REPLACE FUNCTION update_homepage_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS homepage_content_updated_at ON homepage_content;
CREATE TRIGGER homepage_content_updated_at
  BEFORE UPDATE ON homepage_content
  FOR EACH ROW
  EXECUTE FUNCTION update_homepage_content_updated_at();

GRANT ALL ON public.homepage_content TO anon, authenticated;


-- ============================================================================
-- 3. ADD PROPERTY_TYPES COLUMN TO LISTINGS
-- ============================================================================

ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS property_types TEXT[];

UPDATE public.listings
SET property_types = ARRAY[property_type]
WHERE property_types IS NULL AND property_type IS NOT NULL;


-- ============================================================================
-- 4. ADD ADDRESS COLUMNS TO LISTINGS
-- ============================================================================

ALTER TABLE public.listings
ADD COLUMN IF NOT EXISTS street_address TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT;

UPDATE public.listings
SET address = location
WHERE address IS NULL AND location IS NOT NULL;


-- ============================================================================
-- 5. FIX PRICING RULES SCHEMA
-- ============================================================================

ALTER TABLE public.pricing_rules
ADD COLUMN IF NOT EXISTS value DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS applies_to TEXT DEFAULT 'all';

ALTER TABLE public.pricing_rules DROP CONSTRAINT IF EXISTS pricing_rules_rule_type_check;

ALTER TABLE public.pricing_rules
ADD CONSTRAINT pricing_rules_rule_type_check
CHECK (rule_type IN ('weekend', 'holiday', 'season', 'month', 'percentage', 'fixed', 'discount'));

ALTER TABLE public.pricing_rules DROP CONSTRAINT IF EXISTS pricing_rules_applies_to_check;
ALTER TABLE public.pricing_rules
ADD CONSTRAINT pricing_rules_applies_to_check
CHECK (applies_to IN ('all', 'weekends', 'weekdays', 'holidays'));

UPDATE public.pricing_rules
SET value = COALESCE(price_percentage::decimal, price_adjustment, 0)
WHERE value IS NULL;

UPDATE public.pricing_rules
SET applies_to = 'all'
WHERE applies_to IS NULL;


-- ============================================================================
-- DONE - ALL 5 SCRIPTS EXECUTED
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'ALL 5 SQL SCRIPTS EXECUTED SUCCESSFULLY';
  RAISE NOTICE '============================================';
  RAISE NOTICE '';
  RAISE NOTICE '1. Admin RLS Policies - DONE';
  RAISE NOTICE '2. Homepage Content Table - DONE';
  RAISE NOTICE '3. Property Types Column - DONE';
  RAISE NOTICE '4. Address Columns - DONE';
  RAISE NOTICE '5. Pricing Rules Schema - DONE';
  RAISE NOTICE '';
END $$;
