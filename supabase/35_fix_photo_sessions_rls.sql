-- ============================================================================
-- FIX PHOTO_SESSIONS RLS FOR BOTH ANON AND AUTHENTICATED
-- ============================================================================
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Allow anonymous insert" ON photo_sessions;
DROP POLICY IF EXISTS "Allow anonymous select" ON photo_sessions;
DROP POLICY IF EXISTS "Allow anonymous update" ON photo_sessions;

-- Create new policies that work for both anon and authenticated
CREATE POLICY "Anyone can insert photo sessions" ON photo_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can select photo sessions" ON photo_sessions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can update photo sessions" ON photo_sessions
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Anyone can delete photo sessions" ON photo_sessions
  FOR DELETE USING (true);

-- Grant permissions to both roles
GRANT ALL ON photo_sessions TO anon, authenticated;

-- ============================================================================
-- DONE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Photo Sessions RLS Fixed!';
  RAISE NOTICE 'Now works for both anonymous and authenticated users.';
END $$;
