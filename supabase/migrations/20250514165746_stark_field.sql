/*
  # Fix Favorites RLS Policies

  1. Changes
    - Drop existing RLS policies for favorites table
    - Create new, properly scoped RLS policies for favorites table
    
  2. Security
    - Enable RLS on favorites table (ensuring it's enabled)
    - Add policy for authenticated users to read their own favorites
    - Add policy for authenticated users to manage their own favorites
*/

-- First ensure RLS is enabled
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can manage their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can read their own favorites" ON favorites;

-- Create new policies with proper conditions
CREATE POLICY "Users can read their own favorites"
ON favorites
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own favorites"
ON favorites
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);