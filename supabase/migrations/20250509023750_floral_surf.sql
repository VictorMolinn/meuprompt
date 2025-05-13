/*
  # Update Hotmart Integration Flow
  
  1. Changes
    - Add email column to hotmart_transactions to track purchases before signup
    - Update indexes for better query performance
    - Add name column to store buyer info
    
  2. Security
    - Maintain existing RLS policies
*/

-- Add email and name columns to transactions
ALTER TABLE hotmart_transactions 
ADD COLUMN email text,
ADD COLUMN name text;

-- Update existing transactions with email from users
UPDATE hotmart_transactions t
SET email = u.email,
    name = p.full_name
FROM auth.users u
JOIN profiles p ON p.id = u.id
WHERE t.user_id = u.id;

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_hotmart_transactions_email 
ON hotmart_transactions(email);

-- Add function to check transaction status
CREATE OR REPLACE FUNCTION check_user_transaction(user_email text)
RETURNS TABLE (
  has_transaction boolean,
  transaction_status text
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    true as has_transaction,
    ht.status as transaction_status
  FROM hotmart_transactions ht
  WHERE ht.email = user_email
    AND ht.status IN ('APPROVED', 'COMPLETED')
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;