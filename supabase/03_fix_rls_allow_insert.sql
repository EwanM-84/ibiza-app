DROP POLICY IF EXISTS "Hosts can insert own profile" ON host_profiles;
CREATE POLICY "Allow signup to create profile" ON host_profiles FOR INSERT WITH CHECK (true);
