-- ============================================================================
-- HOST DASHBOARD SCHEMA ADDITIONS
-- ============================================================================
-- Adds tables and fields needed for host dashboard features:
-- - Host types (accommodation/excursion/volunteer)
-- - Listing photos (separate from verification)
-- - Pricing calendar
-- - Listing descriptions

-- 1. Add host_type to host_profiles
ALTER TABLE public.host_profiles
ADD COLUMN IF NOT EXISTS host_type TEXT CHECK (host_type IN ('accommodation', 'excursion', 'volunteer')),
ADD COLUMN IF NOT EXISTS listing_title TEXT,
ADD COLUMN IF NOT EXISTS listing_description TEXT,
ADD COLUMN IF NOT EXISTS default_price_per_night DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'COP';

-- 2. Create listing_photos table (separate from verification photos)
CREATE TABLE IF NOT EXISTS public.listing_photos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    host_id UUID NOT NULL REFERENCES public.host_profiles(user_id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    caption TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create pricing_calendar table for dynamic pricing
CREATE TABLE IF NOT EXISTS public.pricing_calendar (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    host_id UUID NOT NULL REFERENCES public.host_profiles(user_id) ON DELETE CASCADE,
    date DATE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    is_available BOOLEAN DEFAULT true,
    pricing_type TEXT CHECK (pricing_type IN ('daily', 'weekend', 'holiday', 'seasonal')) DEFAULT 'daily',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(host_id, date)
);

-- 4. Create pricing_rules table for recurring pricing patterns
CREATE TABLE IF NOT EXISTS public.pricing_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    host_id UUID NOT NULL REFERENCES public.host_profiles(user_id) ON DELETE CASCADE,
    rule_name TEXT NOT NULL,
    rule_type TEXT CHECK (rule_type IN ('weekend', 'holiday', 'season', 'month')) NOT NULL,
    start_date DATE,
    end_date DATE,
    price_adjustment DECIMAL(10,2), -- Amount to add/subtract
    price_percentage INTEGER, -- Percentage adjustment (use one or the other)
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_listing_photos_host_id ON public.listing_photos(host_id);
CREATE INDEX IF NOT EXISTS idx_listing_photos_order ON public.listing_photos(host_id, display_order);
CREATE INDEX IF NOT EXISTS idx_pricing_calendar_host_date ON public.pricing_calendar(host_id, date);
CREATE INDEX IF NOT EXISTS idx_pricing_rules_host ON public.pricing_rules(host_id);

-- 6. Enable RLS on new tables
ALTER TABLE public.listing_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_calendar ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;

-- 7. RLS Policies for listing_photos
CREATE POLICY "Hosts can view their own listing photos"
    ON public.listing_photos FOR SELECT
    USING (auth.uid() = host_id);

CREATE POLICY "Hosts can insert their own listing photos"
    ON public.listing_photos FOR INSERT
    WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their own listing photos"
    ON public.listing_photos FOR UPDATE
    USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their own listing photos"
    ON public.listing_photos FOR DELETE
    USING (auth.uid() = host_id);

CREATE POLICY "Public can view listing photos of verified hosts"
    ON public.listing_photos FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.host_profiles
        WHERE user_id = host_id AND verification_status = 'approved'
    ));

-- 8. RLS Policies for pricing_calendar
CREATE POLICY "Hosts can manage their own pricing calendar"
    ON public.pricing_calendar FOR ALL
    USING (auth.uid() = host_id);

CREATE POLICY "Public can view pricing for verified hosts"
    ON public.pricing_calendar FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.host_profiles
        WHERE user_id = host_id AND verification_status = 'approved'
    ));

-- 9. RLS Policies for pricing_rules
CREATE POLICY "Hosts can manage their own pricing rules"
    ON public.pricing_rules FOR ALL
    USING (auth.uid() = host_id);

-- 10. Update trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_listing_photos_updated_at
    BEFORE UPDATE ON public.listing_photos
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pricing_calendar_updated_at
    BEFORE UPDATE ON public.pricing_calendar
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pricing_rules_updated_at
    BEFORE UPDATE ON public.pricing_rules
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- COMPLETED: Run this SQL in your Supabase SQL Editor
-- ============================================================================
