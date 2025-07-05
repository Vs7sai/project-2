/*
  # Create API Credentials Table

  1. New Tables
    - `api_credentials`
      - `id` (uuid, primary key)
      - `provider` (text, unique) - API provider name (e.g., 'zerodha')
      - `api_key` (text) - API key for the provider
      - `api_secret` (text) - API secret for the provider
      - `user_id` (text) - User ID from the provider
      - `access_token` (text) - Access token for authenticated requests
      - `expires_at` (timestamptz) - Token expiration timestamp
      - `created_at` (timestamptz) - Record creation timestamp
      - `updated_at` (timestamptz) - Record update timestamp

  2. Security
    - Enable RLS on `api_credentials` table
    - Add policy for admins to manage API credentials
    - Add policy for service role to manage API credentials

  3. Indexes
    - Index on provider for fast lookups
    - Index on expires_at for token expiry checks
*/

-- Create the api_credentials table
CREATE TABLE IF NOT EXISTS public.api_credentials (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    provider text UNIQUE NOT NULL,
    api_key text,
    api_secret text,
    user_id text,
    access_token text,
    expires_at timestamptz,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.api_credentials ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS api_credentials_provider_idx ON public.api_credentials USING btree (provider);
CREATE INDEX IF NOT EXISTS api_credentials_expires_at_idx ON public.api_credentials USING btree (expires_at);

-- Create RLS policies
CREATE POLICY "Only admins can manage API credentials"
    ON public.api_credentials
    FOR ALL
    TO authenticated
    USING ((jwt() ->> 'role'::text) = 'admin'::text)
    WITH CHECK ((jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Service role can manage API credentials"
    ON public.api_credentials
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_api_credentials_updated_at
    BEFORE UPDATE ON public.api_credentials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();