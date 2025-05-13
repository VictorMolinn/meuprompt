/*
  # User Premium Flow Setup
  
  1. Changes
    - Add subscription_status to profiles
    - Create tables for Hotmart integration
    - Add proper indexes and constraints
    
  2. Security
    - Enable RLS
    - Add policies for admin and user access
*/

-- Add premium status to profiles if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE profiles 
    ADD COLUMN subscription_status text DEFAULT 'free' CHECK (subscription_status IN ('free', 'premium'));
  END IF;
END $$;

-- Create hotmart transactions table if not exists
CREATE TABLE IF NOT EXISTS hotmart_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  status text NOT NULL CHECK (status IN (
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
  )),
  payment_type text,
  payment_engine text,
  price numeric(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create hotmart subscriptions table if not exists
CREATE TABLE IF NOT EXISTS hotmart_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id text NOT NULL UNIQUE,
  plan text NOT NULL,
  status text NOT NULL CHECK (status IN (
    'ACTIVE',
    'CANCELLED',
    'OVERDUE',
    'EXPIRED',
    'STARTED',
    'SUSPENDED'
  )),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE hotmart_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotmart_subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policies if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'hotmart_transactions' 
    AND policyname = 'Only admins can manage transactions'
  ) THEN
    CREATE POLICY "Only admins can manage transactions"
      ON hotmart_transactions FOR ALL
      TO authenticated
      USING (auth.email() = 'eiaiflix@gmail.com');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'hotmart_transactions' 
    AND policyname = 'Users can view their own transactions'
  ) THEN
    CREATE POLICY "Users can view their own transactions"
      ON hotmart_transactions FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'hotmart_subscriptions' 
    AND policyname = 'Only admins can manage subscriptions'
  ) THEN
    CREATE POLICY "Only admins can manage subscriptions"
      ON hotmart_subscriptions FOR ALL
      TO authenticated
      USING (auth.email() = 'eiaiflix@gmail.com');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = 'hotmart_subscriptions' 
    AND policyname = 'Users can view their own subscriptions'
  ) THEN
    CREATE POLICY "Users can view their own subscriptions"
      ON hotmart_subscriptions FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_hotmart_transactions_user_id ON hotmart_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_hotmart_transactions_transaction ON hotmart_transactions(transaction);
CREATE INDEX IF NOT EXISTS idx_hotmart_transactions_status ON hotmart_transactions(status);