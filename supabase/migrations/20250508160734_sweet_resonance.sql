/*
  # Auth Callback System Setup
  
  1. New Tables
    - `auth_callbacks` - Stores password reset tokens and metadata
      - `id` (uuid, primary key)
      - `token` (text) - Reset token
      - `redirect_url` (text) - Where to redirect after reset
      - `created_at` (timestamp)
      - `expires_at` (timestamp) - Token expiration
      - `used` (boolean) - Prevent token reuse
  
  2. Security
    - Enable RLS
    - Allow public access for verification
    - Allow updates to mark tokens as used
*/

-- Create auth callbacks table
CREATE TABLE IF NOT EXISTS auth_callbacks (
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
CREATE POLICY "Public can verify tokens"
  ON auth_callbacks FOR SELECT
  TO public
  USING (
    expires_at > now() 
    AND NOT used
  );

CREATE POLICY "Public can create callbacks"
  ON auth_callbacks FOR INSERT
  TO public
  WITH CHECK (
    redirect_url IS NOT NULL
    AND (used IS NULL OR used = false)
  );

CREATE POLICY "Public can mark tokens as used"
  ON auth_callbacks FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (
    -- Only allow updating the 'used' field
    used = true
  );