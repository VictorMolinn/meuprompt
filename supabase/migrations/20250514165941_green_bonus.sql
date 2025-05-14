/*
  # Fix Favorites RLS Policies
  
  1. Changes
    - Drop existing RLS policies for favorites table
    - Create new policies for proper access control
    
  2. Security
    - Enable RLS on favorites table
    - Add policy for users to manage their own favorites
    - Add policy for users to view their own favorites
*/

-- First ensure RLS is enabled
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can manage their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can read their own favorites" ON favorites;

-- Create policy for managing favorites (insert, update, delete)
CREATE POLICY "Users can manage their own favorites"
ON favorites
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy for reading favorites
CREATE POLICY "Users can read their own favorites"
ON favorites
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);