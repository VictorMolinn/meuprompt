/*
  # Add Magic Link Support
  
  1. Changes
    - Add auth_redirects table to track magic link redirects
    - Add RLS policies for secure access
    
  2. Security
    - Enable RLS
    - Restrict management to admin users
*/

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