/*
  # Add Auth Callback Support
  
  1. Changes
    - Add auth_callbacks table to track magic link sessions
    - Add policies for secure access
    
  2. Security
    - Enable RLS
    - Restrict access appropriately
*/

CREATE TABLE IF NOT EXISTS auth_callbacks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
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