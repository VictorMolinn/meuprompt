/*
  # Fix Hotmart Webhook Integration
  
  1. Changes
    - Add user_id to hotmart_transactions table
    - Add indexes for better query performance
    - Update transaction status check constraint
    
  2. Security
    - Maintain existing RLS policies
*/

-- Add user_id to transactions if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'hotmart_transactions' 
    AND column_name = 'user_id'
  ) THEN
    ALTER TABLE hotmart_transactions 
    ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hotmart_transactions_user_id ON hotmart_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_hotmart_transactions_transaction ON hotmart_transactions(transaction);
CREATE INDEX IF NOT EXISTS idx_hotmart_transactions_status ON hotmart_transactions(status);

-- Update status check constraint
ALTER TABLE hotmart_transactions 
DROP CONSTRAINT IF EXISTS hotmart_transactions_status_check;

ALTER TABLE hotmart_transactions
ADD CONSTRAINT hotmart_transactions_status_check
CHECK (status IN (
  'APPROVED',
  'COMPLETED',
  'CANCELED',
  'REFUNDED',
  'CHARGEBACK',
  'EXPIRED',
  'DELAYED',
  'PRINTED_BILLET',
  'WAITING_PAYMENT',
  'BLOCKED',
  'UNDER_ANALYSIS',
  'STARTED'
));