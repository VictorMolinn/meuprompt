/*
  # Update favorites table RLS policies

  1. Changes
    - Add explicit SELECT policy for authenticated users to read their own favorites
    - Keep existing policy for managing favorites
    
  2. Security
    - Ensures users can only read their own favorites
    - Maintains existing policy for managing favorites
*/

-- Drop the existing policy that might be causing conflicts
DROP POLICY IF EXISTS "Users can manage their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can view their own favorites" ON favorites;

-- Create separate policies for different operations
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