/*
  # Fix Auth Callback System
  
  1. Changes
    - Drop and recreate auth_callbacks table with proper structure
    - Update RLS policies to handle magic link flow
    - Add proper token verification
    
  2. Security
    - Enable RLS
    - Allow public access for token verification
    - Prevent token reuse
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS auth_callbacks CASCADE;

-- Create auth callbacks table
CREATE TABLE auth_callbacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text NOT NULL,
  redirect_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '15 minutes'),
  used boolean DEFAULT false
);

-- Enable RLS
ALTER TABLE auth_callbacks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can create callbacks"
  ON auth_callbacks FOR INSERT
  TO public
  WITH CHECK (
    redirect_url IS NOT NULL AND
    (used IS NULL OR used = false)
  );

CREATE POLICY "Public can verify tokens"
  ON auth_callbacks FOR SELECT
  TO public
  USING (
    expires_at > now() AND
    NOT used
  );

CREATE POLICY "Public can mark tokens as used"
  ON auth_callbacks FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (used = true);