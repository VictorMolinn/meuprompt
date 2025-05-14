/*
  # Fix favorites table RLS policies

  1. Changes
    - Drop existing policies
    - Recreate policies with correct permissions
    - Add missing indexes
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read their own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can manage their own favorites" ON public.favorites;

-- Create policy for reading favorites
CREATE POLICY "Users can read their own favorites"
ON public.favorites
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create policy for managing favorites (insert, delete)
CREATE POLICY "Users can manage their own favorites"
ON public.favorites
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS favorites_prompt_id_idx ON public.favorites(prompt_id);