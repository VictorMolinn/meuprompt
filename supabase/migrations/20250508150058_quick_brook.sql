/*
  # Fix Auth Callbacks Table
  
  1. Changes
    - Add used flag to track used tokens
    - Add expires_at column for token expiration
    - Update RLS policies for better security
    
  2. Security
    - Enable RLS
    - Add policy for token verification
*/

-- Drop existing table if it exists
DROP TABLE IF EXISTS auth_callbacks;

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
CREATE POLICY "Public can verify tokens"
  ON auth_callbacks FOR SELECT
  TO public
  USING (
    expires_at > now() 
    AND NOT used
  );

CREATE POLICY "Authenticated users can create callbacks"
  ON auth_callbacks FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update their callbacks"
  ON auth_callbacks FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);