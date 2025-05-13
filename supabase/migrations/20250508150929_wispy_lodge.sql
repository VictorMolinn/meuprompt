/*
  # Remove auth_callbacks table
  
  This migration removes the auth_callbacks table since we're using Supabase's built-in
  password reset functionality which handles token verification internally.
  
  1. Changes
    - Drop auth_callbacks table and its policies
*/

-- Drop the table and its policies
DROP TABLE IF EXISTS auth_callbacks CASCADE;