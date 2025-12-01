-- Delete the existing user and re-register fresh
-- Run this in Supabase SQL Editor

-- This will delete the user from auth.users
-- The cascade will automatically delete from host_profiles
DELETE FROM auth.users WHERE email = 'sptc@gmail.com';

-- After running this SQL:
-- 1. Go to: http://localhost:3000/host/register
-- 2. Register again with:
--    Email: sptc@gmail.com
--    Password: (choose a password you'll remember - e.g., "testpass123")
-- 3. Complete the registration and onboarding
-- 4. Then run the approval SQL again:

/*
UPDATE public.host_profiles
SET
    id_verified = true,
    face_verified = true,
    liveness_check_passed = true,
    metamap_verification_id = 'dev-test-verification',
    metamap_identity_status = 'verified',
    metamap_selfie_status = 'verified',
    metamap_liveness_status = 'passed',
    metamap_verified_at = now(),
    verification_status = 'approved'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'sptc@gmail.com');
*/
