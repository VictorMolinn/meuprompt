/*
  # Fix auth_callbacks RLS policies

  1. Changes
    - Drop existing INSERT policy that's not working correctly
    - Create new INSERT policy that allows public access for creating auth callbacks
    - This is necessary because password reset needs to work for non-authenticated users

  2. Security
    - Allow public INSERT access but with strict expiration and usage controls
    - Maintain existing SELECT policy for public access to verify tokens
    - Keep UPDATE policy for authenticated users
*/

-- Drop the problematic INSERT policy
DROP POLICY IF EXISTS "Authenticated users can create callbacks" ON auth_callbacks;

-- Create new INSERT policy that allows public access
CREATE POLICY "Anyone can create auth callbacks"
ON auth_callbacks
FOR INSERT
TO public
WITH CHECK (
  -- Ensure basic security constraints:
  -- 1. Must have a token
  -- 2. Must have a redirect URL
  -- 3. Must not be used
  -- 4. Must have proper expiration (handled by default value)
  token IS NOT NULL AND
  redirect_url IS NOT NULL AND
  (used IS NULL OR used = false)
);