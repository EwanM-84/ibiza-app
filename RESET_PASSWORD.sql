-- Reset password using Supabase Admin API
-- This SQL uses the auth.users table encrypted password

-- OPTION 1: Using Supabase Dashboard (EASIEST)
-- 1. Go to: Authentication > Users
-- 2. Click on the user row for sptc@gmail.com
-- 3. Scroll down to "User Management" section
-- 4. Click "Send Password Reset Email" button
-- OR manually type a new password in the password field and click Update

-- OPTION 2: If you're using Supabase CLI locally
-- Run this command in terminal:
-- supabase auth update --project-ref YOUR_PROJECT_REF --user 0773e9d4-2c3b-41a4-a774-9c0b4d54b198 --password pass1234

-- OPTION 3: Use the Supabase REST API
-- You can use curl or Postman to call:
-- PUT https://YOUR_PROJECT_REF.supabase.co/auth/v1/admin/users/0773e9d4-2c3b-41a4-a774-9c0b4d54b198
-- Headers:
--   apikey: YOUR_SERVICE_ROLE_KEY
--   Authorization: Bearer YOUR_SERVICE_ROLE_KEY
-- Body: { "password": "pass1234" }

-- For development testing, try logging in with ANY of these credentials:
-- The password you entered during registration at http://localhost:3000/host/register

-- If all else fails, delete the user and re-register:
/*
DELETE FROM auth.users WHERE email = 'sptc@gmail.com';
-- Then go to http://localhost:3000/host/register and register again
*/
