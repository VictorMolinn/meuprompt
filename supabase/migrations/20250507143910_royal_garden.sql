/*
  # Add Hotmart Integration Tables
  
  1. New Tables
    - `hotmart_transactions` - Stores purchase transaction details
      - `id` (uuid, primary key)
      - `transaction` (text) - Hotmart transaction ID
      - `user_id` (uuid) - Reference to auth.users
      - `product_id` (text) - Hotmart product ID
      - `status` (text) - Purchase status (APPROVED, CANCELED, etc)
      - `payment_type` (text) - Payment method used
      - `payment_engine` (text) - Payment processor
      - `price` (numeric) - Transaction amount
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `hotmart_subscriptions` - Tracks recurring subscriptions
      - `id` (uuid, primary key)
      - `user_id` (uuid) - Reference to auth.users
      - `subscription_id` (text) - Hotmart subscription ID
      - `plan` (text) - Subscription plan name
      - `status` (text) - Subscription status
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for admin access
    - Add policies for user access to own data
*/

-- Create transactions table
CREATE TABLE IF NOT EXISTS hotmart_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction text NOT NULL UNIQUE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id text NOT NULL,
  status text NOT NULL,
  payment_type text,
  payment_engine text,
  price numeric(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS hotmart_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id text NOT NULL UNIQUE,
  plan text NOT NULL,
  status text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE hotmart_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotmart_subscriptions ENABLE ROW LEVEL SECURITY;

-- Admin policies
CREATE POLICY "Only admins can manage transactions"
  ON hotmart_transactions FOR ALL
  TO authenticated
  USING (auth.email() = 'eiaiflix@gmail.com');

CREATE POLICY "Only admins can manage subscriptions"
  ON hotmart_subscriptions FOR ALL
  TO authenticated
  USING (auth.email() = 'eiaiflix@gmail.com');

-- User policies
CREATE POLICY "Users can view their own transactions"
  ON hotmart_transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own subscriptions"
  ON hotmart_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);