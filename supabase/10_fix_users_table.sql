-- ============================================================================
-- FIX: Remove public.users table or add INSERT policy
-- ============================================================================
-- Option 1: If you don't need public.users for host registration, drop it
-- Option 2: Add an INSERT policy to allow service role to create users
-- ============================================================================

-- OPTION 1: Drop public.users table (if it's not needed)
-- WARNING: This will delete the table and all data in it
-- Uncomment if you want to use this option:

-- DROP TABLE IF EXISTS public.users CASCADE;


-- OPTION 2: Add INSERT policy to public.users (if you need to keep it)
-- This allows the service role to create users

-- First, check what columns public.users has
-- (You already ran this - copy the structure here)

-- Then add INSERT policy
DROP POLICY IF EXISTS "Service role can insert users" ON public.users;
CREATE POLICY "Service role can insert users" ON public.users
  FOR INSERT
  WITH CHECK (true);

-- Also allow authenticated users to insert their own record
DROP POLICY IF EXISTS "Users can create own record" ON public.users;
CREATE POLICY "Users can create own record" ON public.users
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow users to update their own record
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE
  USING (auth.uid() = id);
