-- ============================================================================
-- SPTC RURAL - PRICING TABLES
-- ============================================================================
-- Run this in Supabase SQL Editor
-- This creates the pricing tables for hosts to manage their nightly rates
-- ============================================================================

-- 1. Add default_price_per_night to host_profiles if not exists
ALTER TABLE public.host_profiles
ADD COLUMN IF NOT EXISTS default_price_per_night DECIMAL(10,2) DEFAULT 50,
ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';

-- 2. Create pricing_rules table for seasonal/recurring pricing
CREATE TABLE IF NOT EXISTS public.pricing_rules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rule_name TEXT NOT NULL,
    rule_type TEXT CHECK (rule_type IN ('percentage', 'fixed', 'discount')) NOT NULL,
    value DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    applies_to TEXT CHECK (applies_to IN ('all', 'weekends', 'weekdays', 'holidays')) DEFAULT 'all',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create pricing_calendar table for specific date pricing
CREATE TABLE IF NOT EXISTS public.pricing_calendar (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    host_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    is_available BOOLEAN DEFAULT true,
    pricing_type TEXT CHECK (pricing_type IN ('daily', 'weekend', 'holiday', 'seasonal')) DEFAULT 'daily',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(host_id, date)
);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_pricing_rules_host ON public.pricing_rules(host_id);
CREATE INDEX IF NOT EXISTS idx_pricing_calendar_host_date ON public.pricing_calendar(host_id, date);

-- 5. Enable RLS
ALTER TABLE public.pricing_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_calendar ENABLE ROW LEVEL SECURITY;

-- 6. Drop existing policies if they exist
DROP POLICY IF EXISTS "Hosts can manage their own pricing rules" ON public.pricing_rules;
DROP POLICY IF EXISTS "Hosts can manage their own pricing calendar" ON public.pricing_calendar;
DROP POLICY IF EXISTS "Public can view pricing for verified hosts" ON public.pricing_calendar;

-- 7. RLS Policies for pricing_rules
CREATE POLICY "Hosts can manage their own pricing rules"
    ON public.pricing_rules FOR ALL
    USING (auth.uid() = host_id);

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

-- 9. Update trigger function (create if not exists)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Update triggers
DROP TRIGGER IF EXISTS update_pricing_rules_updated_at ON public.pricing_rules;
CREATE TRIGGER update_pricing_rules_updated_at
    BEFORE UPDATE ON public.pricing_rules
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_pricing_calendar_updated_at ON public.pricing_calendar;
CREATE TRIGGER update_pricing_calendar_updated_at
    BEFORE UPDATE ON public.pricing_calendar
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- 11. Grant permissions
GRANT ALL ON public.pricing_rules TO authenticated;
GRANT ALL ON public.pricing_calendar TO authenticated;
GRANT SELECT ON public.pricing_calendar TO anon;

-- ============================================================================
-- Completion message
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'PRICING TABLES CREATED SUCCESSFULLY';
  RAISE NOTICE '============================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Tables created:';
  RAISE NOTICE '  - pricing_rules: Seasonal/recurring pricing rules';
  RAISE NOTICE '  - pricing_calendar: Specific date pricing overrides';
  RAISE NOTICE '';
  RAISE NOTICE 'Features:';
  RAISE NOTICE '  - Base rate stored in host_profiles.default_price_per_night';
  RAISE NOTICE '  - Pricing rules: percentage, fixed, or discount types';
  RAISE NOTICE '  - Calendar pricing: override prices for specific dates';
  RAISE NOTICE '  - Applies to: all days, weekends only, weekdays only';
  RAISE NOTICE '';
END $$;
