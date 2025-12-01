-- ============================================================================
-- SPTC RURAL - FIX PRICING RULES SCHEMA
-- ============================================================================
-- Run this in Supabase SQL Editor
-- This adds missing columns to the pricing_rules table
-- ============================================================================

-- Add missing columns to pricing_rules
ALTER TABLE public.pricing_rules
ADD COLUMN IF NOT EXISTS value DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS applies_to TEXT DEFAULT 'all';

-- Update rule_type constraint to include our new types
-- First drop the existing constraint if it exists
ALTER TABLE public.pricing_rules DROP CONSTRAINT IF EXISTS pricing_rules_rule_type_check;

-- Add new constraint with all supported types
ALTER TABLE public.pricing_rules
ADD CONSTRAINT pricing_rules_rule_type_check
CHECK (rule_type IN ('weekend', 'holiday', 'season', 'month', 'percentage', 'fixed', 'discount'));

-- Add constraint for applies_to
ALTER TABLE public.pricing_rules DROP CONSTRAINT IF EXISTS pricing_rules_applies_to_check;
ALTER TABLE public.pricing_rules
ADD CONSTRAINT pricing_rules_applies_to_check
CHECK (applies_to IN ('all', 'weekends', 'weekdays', 'holidays'));

-- Migrate existing data: copy price_percentage or price_adjustment to value if needed
UPDATE public.pricing_rules
SET value = COALESCE(price_percentage::decimal, price_adjustment, 0)
WHERE value IS NULL;

-- Set default applies_to for existing rules
UPDATE public.pricing_rules
SET applies_to = 'all'
WHERE applies_to IS NULL;

-- ============================================================================
-- Completion message
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'PRICING RULES SCHEMA FIXED';
  RAISE NOTICE '============================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Added columns:';
  RAISE NOTICE '  - value: stores the pricing value';
  RAISE NOTICE '  - applies_to: all, weekends, weekdays, holidays';
  RAISE NOTICE '';
  RAISE NOTICE 'Updated rule_type to support:';
  RAISE NOTICE '  - percentage, fixed, discount (new)';
  RAISE NOTICE '  - weekend, holiday, season, month (existing)';
  RAISE NOTICE '';
END $$;
