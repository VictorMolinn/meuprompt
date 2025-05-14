/*
  # Fix Favorites Table RLS Policies

  1. Changes
    - Drop existing RLS policies on favorites table
    - Add new policies for:
      - Selecting user's own favorites
      - Managing (insert/delete) user's own favorites
  
  2. Security
    - Enable RLS
    - Add policies to ensure users can only access their own favorites
    - Authenticated users can manage their own favorites
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can read their own favorites" ON favorites;

-- Create new policies
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