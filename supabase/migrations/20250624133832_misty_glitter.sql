/*
  # Add API Credentials Table

  1. New Table
    - `api_credentials` - Store API keys and tokens for external services
    - Secure storage for Zerodha API credentials
    - Support for access token management

  2. Security
    - Enable RLS
    - Admin-only access policies
    - Service role access for backend operations
*/

-- Create api_credentials table
CREATE TABLE IF NOT EXISTS api_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL,
  api_key text,
  api_secret text,
  user_id text,
  access_token text,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add unique constraint on provider
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'api_credentials' AND constraint_name = 'api_credentials_provider_key'
  ) THEN
    ALTER TABLE api_credentials ADD CONSTRAINT api_credentials_provider_key UNIQUE (provider);
  END IF;
END $$;

-- Add indexes
CREATE INDEX IF NOT EXISTS api_credentials_provider_idx ON api_credentials (provider);
CREATE INDEX IF NOT EXISTS api_credentials_expires_at_idx ON api_credentials (expires_at);

-- Enable RLS
ALTER TABLE api_credentials ENABLE ROW LEVEL SECURITY;

-- Add RLS policies
-- Only allow admin users to access API credentials (since these are system-wide credentials)
CREATE POLICY "Only admins can manage API credentials"
  ON api_credentials
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Allow service role to access (for server-side operations)
CREATE POLICY "Service role can manage API credentials"
  ON api_credentials
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);