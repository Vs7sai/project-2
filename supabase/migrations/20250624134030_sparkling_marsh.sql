/*
  # Create API Credentials Table

  1. New Table
    - `api_credentials` - Store API keys and tokens for external services
    - Secure storage for Zerodha API credentials and other integrations
    
  2. Security
    - Enable RLS on the table
    - Add policies for admin and service role access
    - Create indexes for performance
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
    USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
    WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

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