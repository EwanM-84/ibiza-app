-- Create homepage_content table for managing dynamic content sections
CREATE TABLE IF NOT EXISTS homepage_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'community_projects', 'destinations', 'featured_stays'
  title_en TEXT NOT NULL,
  title_es TEXT NOT NULL,
  description_en TEXT,
  description_es TEXT,
  items JSONB DEFAULT '[]'::jsonb, -- Array of items with image_url, title_en, title_es, description_en, description_es
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_homepage_content_section_key ON homepage_content(section_key);
CREATE INDEX IF NOT EXISTS idx_homepage_content_active ON homepage_content(is_active);

-- Enable RLS
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active content
CREATE POLICY "Anyone can read active homepage content"
  ON homepage_content
  FOR SELECT
  USING (is_active = true);

-- Policy: Only authenticated admins can modify
CREATE POLICY "Admins can manage homepage content"
  ON homepage_content
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM host_profiles
      WHERE user_id = auth.uid()
      AND verification_status = 'approved'
    )
  );

-- Insert default content for community projects section
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

-- Insert default content for destinations section
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

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_homepage_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS homepage_content_updated_at ON homepage_content;
CREATE TRIGGER homepage_content_updated_at
  BEFORE UPDATE ON homepage_content
  FOR EACH ROW
  EXECUTE FUNCTION update_homepage_content_updated_at();
