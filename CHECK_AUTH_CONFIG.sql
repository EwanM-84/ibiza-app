-- ============================================================================
-- CHECK AUTH CONFIGURATION
-- ============================================================================

-- 1. Check for triggers on auth.users table
SELECT
    trigger_name,
    event_manipulation,
    action_statement,
    action_timing,
    action_orientation
FROM information_schema.triggers
WHERE event_object_schema = 'auth'
AND event_object_table = 'users'
ORDER BY trigger_name;

-- 2. Check for foreign key constraints FROM auth.users
SELECT
    tc.constraint_name,
    tc.table_schema,
    tc.table_name,
    kcu.column_name,
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'auth'
AND tc.table_name = 'users';

-- 3. Check for auth hooks
SELECT
    id,
    hook_table_id,
    hook_name,
    enabled
FROM auth.hooks
WHERE enabled = true;

-- 4. Check if there are any auth extensions or custom functions
SELECT
    p.proname as function_name,
    n.nspname as schema_name
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'auth'
AND p.proname LIKE '%trigger%'
OR p.proname LIKE '%hook%';
