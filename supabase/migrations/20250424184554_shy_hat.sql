/*
  # Fix Profile Policies

  1. Changes
    - Drop existing policies to avoid conflicts
    - Recreate profile policies with proper permissions
    - Add insert policy for authenticated users
    - Add select policy for own profile
    - Add update policy for own profile

  2. Security
    - Enable RLS on profiles table
    - Ensure users can only access their own data
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Recreate policies
CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);