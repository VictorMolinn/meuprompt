/*
  # Update auth_callbacks RLS policies

  1. Changes
    - Update RLS policies for auth_callbacks table to allow password reset functionality
    - Add policy for inserting new auth callbacks
    - Keep existing policies for token verification

  2. Security
    - Enable RLS on auth_callbacks table
    - Allow public to insert new auth callbacks for password reset
    - Maintain secure token verification
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can create auth callbacks" ON auth_callbacks;
DROP POLICY IF EXISTS "Public can verify tokens" ON auth_callbacks;

-- Create new policies
CREATE POLICY "Anyone can create auth callbacks"
ON auth_callbacks
FOR INSERT
TO public
WITH CHECK (
  redirect_url IS NOT NULL
  AND (used IS NULL OR used = false)
);

CREATE POLICY "Public can verify tokens"
ON auth_callbacks
FOR SELECT
TO public
USING (
  expires_at > now()
  AND (NOT used)
);

-- Keep RLS enabled
ALTER TABLE auth_callbacks ENABLE ROW LEVEL SECURITY;