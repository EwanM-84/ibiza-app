-- Fix login for testing: Manually approve verification and reset password
-- Run these in Supabase SQL Editor

-- Step 1: Manually approve the host verification
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
WHERE user_id = '0773e9d4-2c3b-41a4-a774-9c0b4d54b198';

-- Step 2: To reset password, you need to use Supabase Dashboard:
-- 1. Go to Authentication > Users in Supabase Dashboard
-- 2. Find user: sptc@gmail.com
-- 3. Click the three dots (...) menu
-- 4. Select "Send Password Recovery Email"
-- 5. Or manually set a new password from the UI

-- Step 3: Verify the update worked
SELECT
    u.id as user_id,
    u.email,
    hp.verification_status,
    hp.id_verified,
    hp.metamap_verification_id
FROM auth.users u
LEFT JOIN public.host_profiles hp ON u.id = hp.user_id
WHERE u.email = 'sptc@gmail.com';
