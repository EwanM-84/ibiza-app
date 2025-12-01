-- Approve existing hosts who have completed MetaMap verification
-- Run this in Supabase SQL Editor

UPDATE host_profiles
SET verification_status = 'approved'
WHERE
  id_verified = true
  AND face_verified = true
  AND verification_status = 'pending';

-- Check the results
SELECT
  id,
  first_name,
  last_name,
  id_verified,
  face_verified,
  verification_status
FROM host_profiles;
