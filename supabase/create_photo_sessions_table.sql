-- Create photo_sessions table for persistent storage across serverless invocations
-- Run this SQL in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS photo_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  host_profile_id UUID REFERENCES host_profiles(id) ON DELETE CASCADE,
  photos JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create index for faster lookups by session_id
CREATE INDEX IF NOT EXISTS idx_photo_sessions_session_id ON photo_sessions(session_id);

-- Create index for cleanup of expired sessions
CREATE INDEX IF NOT EXISTS idx_photo_sessions_expires_at ON photo_sessions(expires_at);

-- Enable Row Level Security
ALTER TABLE photo_sessions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to create and read sessions (for QR code flow)
CREATE POLICY "Allow anonymous insert" ON photo_sessions
  FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select" ON photo_sessions
  FOR SELECT TO anon
  USING (true);

CREATE POLICY "Allow anonymous update" ON photo_sessions
  FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

-- Optional: Create a function to clean up expired sessions (run daily via cron)
CREATE OR REPLACE FUNCTION cleanup_expired_photo_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM photo_sessions WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
