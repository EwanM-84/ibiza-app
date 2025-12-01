-- ============================================================================
-- CREATE TEST HOST: ewan.sptc@gmail.com
-- ============================================================================
-- This creates a test host account for development/testing
-- Password: pass1234

-- Note: You need to run this in Supabase SQL Editor with appropriate permissions

DO $$
DECLARE
    new_user_id UUID;
BEGIN
    -- 1. Create auth user (this requires service role key or admin privileges)
    -- You'll need to do this part via Supabase Dashboard > Authentication > Users > Add User
    -- OR use the Supabase admin panel to create user with:
    -- Email: ewan.sptc@gmail.com
    -- Password: pass1234
    -- Auto Confirm Email: YES

    -- For now, let's assume the user was created and we're just setting up the profile
    -- Get the user ID (you'll need to replace this with actual user_id after creating via UI)

    RAISE NOTICE 'Please create the auth user first via Supabase Dashboard:';
    RAISE NOTICE '1. Go to Authentication > Users';
    RAISE NOTICE '2. Click "Add User"';
    RAISE NOTICE '3. Email: ewan.sptc@gmail.com';
    RAISE NOTICE '4. Password: pass1234';
    RAISE NOTICE '5. Auto Confirm Email: YES';
    RAISE NOTICE '6. Then run the INSERT below with the correct user_id';
END $$;

-- After creating the user in Supabase Dashboard, get their ID and run this:
-- (Replace 'YOUR-USER-ID-HERE' with actual UUID from auth.users table)

/*
INSERT INTO public.host_profiles (
    user_id,
    first_name,
    last_name,
    phone,
    country,
    city,
    date_of_birth,
    verification_status,
    agreed_to_terms,
    agreed_to_background_check,
    agreed_to_data_processing,
    host_type,
    listing_title,
    listing_description,
    default_price_per_night,
    currency
) VALUES (
    'YOUR-USER-ID-HERE', -- Replace with actual user ID
    'Ewan',
    'Test',
    '+57 123 456 7890',
    'Colombia',
    'Bogotá',
    '1990-01-01',
    'approved', -- Set as approved for testing
    true,
    true,
    true,
    'accommodation',
    'Beautiful Mountain Retreat',
    'Experience authentic Colombian hospitality in our cozy mountain cabin with stunning views.',
    50000,
    'COP'
);
*/

-- ============================================================================
-- EASIER METHOD: Use the Registration Form
-- ============================================================================
-- Just go to http://localhost:3000/host/register
-- Fill in the form with ewan.sptc@gmail.com and pass1234
-- This will automatically create everything correctly
