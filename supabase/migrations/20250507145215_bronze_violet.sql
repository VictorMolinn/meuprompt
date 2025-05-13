/*
  # Update Hotmart Transaction Status Check
  
  1. Changes
    - Add check constraint for valid transaction status values
    - Add check constraint for valid subscription status values
    - Update existing tables to handle all Hotmart event types
*/

-- Add status check constraint to transactions
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
  'UNDER_ANALYSIS'
));

-- Add status check constraint to subscriptions
ALTER TABLE hotmart_subscriptions
DROP CONSTRAINT IF EXISTS hotmart_subscriptions_status_check;

ALTER TABLE hotmart_subscriptions
ADD CONSTRAINT hotmart_subscriptions_status_check
CHECK (status IN (
  'ACTIVE',
  'CANCELLED',
  'OVERDUE',
  'EXPIRED',
  'STARTED',
  'SUSPENDED'
));