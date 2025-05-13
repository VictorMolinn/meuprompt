/*
  # Auth Tables Setup
  
  1. New Tables
    - `auth_callbacks` - Stores temporary auth callback tokens
    - `auth_redirects` - Stores temporary redirect URLs
  
  2. Security
    - Enable RLS on both tables
    - Add policies for token verification
    - Add admin-only policies for redirects
*/

-- Create auth callbacks table if not exists
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

-- Create policy if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'auth_callbacks' 
      AND policyname = 'Public can verify tokens'
  ) THEN
    CREATE POLICY "Public can verify tokens"
      ON auth_callbacks FOR SELECT
      TO public
      USING (
        expires_at > now() 
        AND NOT used
      );
  END IF;
END $$;

-- Create auth redirects table if not exists
CREATE TABLE IF NOT EXISTS auth_redirects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  redirect_url text NOT NULL,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '24 hours')
);

-- Enable RLS
ALTER TABLE auth_redirects ENABLE ROW LEVEL SECURITY;

-- Create policy if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'auth_redirects' 
      AND policyname = 'Only admins can manage redirects'
  ) THEN
    CREATE POLICY "Only admins can manage redirects"
      ON auth_redirects FOR ALL
      TO authenticated
      USING (auth.email() = 'eiaiflix@gmail.com');
  END IF;
END $$;