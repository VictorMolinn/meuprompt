/*
  # Add Webhook Logs Table
  
  1. New Tables
    - `webhook_logs` - Stores webhook event processing history
      - `id` (uuid, primary key)
      - `event_type` (text) - Type of webhook event
      - `payload` (jsonb) - Raw webhook payload
      - `status` (text) - Processing status (success/error)
      - `error_message` (text) - Error details if failed
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS
    - Restrict access to admin only
*/

CREATE TABLE IF NOT EXISTS webhook_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  payload jsonb NOT NULL,
  status text NOT NULL CHECK (status IN ('success', 'error')),
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE webhook_logs ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Only admins can view webhook logs"
  ON webhook_logs FOR ALL
  TO authenticated
  USING (auth.email() = 'eiaiflix@gmail.com');