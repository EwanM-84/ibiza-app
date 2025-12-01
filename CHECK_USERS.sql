-- Check all registered users and their host profiles
SELECT
    u.id as user_id,
    u.email,
    u.created_at as registered_at,
    hp.first_name,
    hp.last_name,
    hp.verification_status,
    hp.id_verified,
    hp.metamap_verification_id,
    hp.metamap_verified_at
FROM auth.users u
LEFT JOIN public.host_profiles hp ON u.id = hp.user_id
ORDER BY u.created_at DESC
LIMIT 10;

-- To manually update verification status for testing:
-- Uncomment the UPDATE statement below and run it in Supabase SQL Editor

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
