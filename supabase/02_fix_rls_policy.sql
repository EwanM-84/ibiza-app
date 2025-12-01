DROP POLICY IF EXISTS "Hosts can insert own profile" ON host_profiles;
CREATE POLICY "Hosts can insert own profile" ON host_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
