/*
  # Create favorites table and policies

  1. New Tables
    - `favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `prompt_id` (uuid, references prompts)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on favorites table
    - Add policies for users to manage their own favorites
    - Add indexes for better performance
*/

-- Create favorites table with proper structure and constraints
CREATE TABLE IF NOT EXISTS public.favorites (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    prompt_id uuid NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, prompt_id)
);

-- Enable RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can read their own favorites" ON public.favorites;
    DROP POLICY IF EXISTS "Users can manage their own favorites" ON public.favorites;
EXCEPTION
    WHEN undefined_object THEN 
        NULL;
END $$;

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

-- Create indexes for better performance
DROP INDEX IF EXISTS favorites_user_id_idx;
DROP INDEX IF EXISTS favorites_prompt_id_idx;
CREATE INDEX favorites_user_id_idx ON public.favorites(user_id);
CREATE INDEX favorites_prompt_id_idx ON public.favorites(prompt_id);