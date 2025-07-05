/*
  # Add API Credentials Table

  1. New Tables
    - `api_credentials`
      - `id` (uuid, primary key)
      - `provider` (text) - API provider name (e.g., 'zerodha', 'finnhub')
      - `api_key` (text) - API key for the provider
      - `api_secret` (text) - API secret for the provider
      - `user_id` (text) - User ID for the provider
      - `access_token` (text) - Access token (for OAuth providers)
      - `expires_at` (timestamp) - Token expiration time
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `api_credentials` table
    - Add policy for admin access only (since this contains sensitive API credentials)
    - Add unique constraint on provider to ensure only one set of credentials per provider

  3. Indexes
    - Index on provider for fast lookups
    - Index on expires_at for token expiration checks
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
  USING ((jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((jwt() ->> 'role'::text) = 'admin'::text);

-- Allow service role to access (for server-side operations)
CREATE POLICY "Service role can manage API credentials"
  ON api_credentials
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);