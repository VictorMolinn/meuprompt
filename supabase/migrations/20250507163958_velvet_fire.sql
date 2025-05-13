/*
  # Add Site Configuration Table
  
  1. New Tables
    - `site_config` - Stores site-wide configuration values
      - `key` (text, primary key) - Configuration key
      - `value` (text) - Configuration value
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS
    - Restrict management to admin users
    - Allow public read access
*/

-- Create site config table
CREATE TABLE IF NOT EXISTS site_config (
  key text PRIMARY KEY,
  value text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Config is readable by everyone"
  ON site_config FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only admins can manage config"
  ON site_config FOR ALL
  TO authenticated
  USING (auth.email() = 'eiaiflix@gmail.com');

-- Add site URL config
INSERT INTO site_config (key, value)
VALUES ('site_url', 'https://meuprompt.eiaiflix.com.br')
ON CONFLICT (key) DO UPDATE
SET value = EXCLUDED.value;