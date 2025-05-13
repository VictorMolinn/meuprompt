/*
  # Add Premium Features
  
  1. Changes
    - Add is_premium column to prompts table
    - Add subscription_status to profiles table
    - Update existing prompts to be free by default
    - Update existing profiles to be free by default
    
  2. Security
    - Maintain existing RLS policies
    - Add policy to restrict premium prompt access
*/

-- Add premium flag to prompts
ALTER TABLE prompts 
ADD COLUMN is_premium boolean DEFAULT false;

-- Add subscription status to profiles
ALTER TABLE profiles 
ADD COLUMN subscription_status text DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium'));

-- Update existing prompts to be free
UPDATE prompts SET is_premium = false;

-- Update existing profiles to be free
UPDATE profiles SET subscription_status = 'free';

-- Create policy to restrict premium prompt access
CREATE POLICY "Users can only view premium prompts if they have premium subscription"
  ON prompts
  FOR SELECT
  USING (
    (NOT is_premium) OR 
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND subscription_status = 'premium'
    )
  );