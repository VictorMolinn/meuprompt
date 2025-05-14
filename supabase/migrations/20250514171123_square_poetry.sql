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
CREATE INDEX IF NOT EXISTS favorites_user_id_idx ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS favorites_prompt_id_idx ON public.favorites(prompt_id);