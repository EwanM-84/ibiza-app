-- ============================================================================
-- CHECK AUTH CONFIGURATION (SIMPLIFIED)
-- ============================================================================

-- 1. Check for triggers on auth.users table
SELECT
    trigger_name,
    event_manipulation,
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
AND event_object_table = 'users'
ORDER BY trigger_name;

-- 2. Check what tables reference auth.users
SELECT
    tc.table_schema,
    tc.table_name,
    kcu.column_name,
    tc.constraint_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND ccu.table_schema = 'auth'
AND ccu.table_name = 'users';

-- 3. Try to manually create a test user to see the exact error
-- UNCOMMENT THIS ONLY IF YOU WANT TO TEST:
-- INSERT INTO auth.users (
--   instance_id,
--   id,
--   aud,
--   role,
--   email,
--   encrypted_password,
--   email_confirmed_at,
--   confirmation_token,
--   recovery_token,
--   email_change_token_new,
--   email_change
-- ) VALUES (
--   '00000000-0000-0000-0000-000000000000',
--   gen_random_uuid(),
--   'authenticated',
--   'authenticated',
--   'test@example.com',
--   crypt('password123', gen_salt('bf')),
--   NOW(),
--   '',
--   '',
--   '',
--   ''
-- );
