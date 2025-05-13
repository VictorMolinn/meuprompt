/*
  # Fix profiles RLS policies
  
  This migration adds the missing INSERT policy for profiles table while handling
  potential conflicts with existing policies.
  
  1. Changes
    - Adds INSERT policy for profiles if it doesn't exist
*/

DO $$ 
BEGIN
  -- Only create the policy if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM pg_policies 
    WHERE schemaname = 'public' 
      AND tablename = 'profiles' 
      AND policyname = 'Users can insert their own profile'
  ) THEN
    CREATE POLICY "Users can insert their own profile"
      ON profiles
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = id);
  END IF;
END $$;