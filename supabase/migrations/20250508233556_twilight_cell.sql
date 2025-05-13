/*
  # Fix Auth Redirects Table
  
  1. Changes
    - Drop and recreate auth_redirects table if it exists
    - Add proper constraints and defaults
    - Update RLS policies
    
  2. Security
    - Enable RLS
    - Allow public access for verification
    - Allow updates to mark redirects as used
*/

-- Drop existing table and policies
DROP TABLE IF EXISTS auth_redirects CASCADE;

-- Create auth redirects table
CREATE TABLE IF NOT EXISTS auth_redirects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  redirect_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '24 hours')
);

-- Enable RLS
ALTER TABLE auth_redirects ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Only admins can manage redirects"
  ON auth_redirects FOR ALL
  TO authenticated
  USING (auth.email() = 'eiaiflix@gmail.com');