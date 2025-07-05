/*
  # Add KYC Login Support

  1. New Tables
    - `kyc_login_sessions` - Track KYC login sessions
    - `pan_verification_logs` - Log PAN verification attempts
    - `otp_verification_logs` - Log OTP verification attempts

  2. Security
    - Enable RLS on all new tables
    - Add policies for user access control
    - Add indexes for performance

  3. Functions
    - Add function to clean up expired sessions
    - Add function to validate PAN format
*/

-- Create KYC login sessions table
CREATE TABLE IF NOT EXISTS kyc_login_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text NOT NULL,
  pan_number text NOT NULL,
  full_name text NOT NULL,
  date_of_birth date NOT NULL,
  session_token text UNIQUE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'pan_verified', 'otp_sent', 'otp_verified', 'completed', 'expired', 'failed')),
  pan_verified_at timestamptz,
  otp_sent_at timestamptz,
  otp_verified_at timestamptz,
  otp_code text,
  otp_attempts integer DEFAULT 0,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create PAN verification logs table
CREATE TABLE IF NOT EXISTS pan_verification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pan_number text NOT NULL,
  full_name text NOT NULL,
  date_of_birth date NOT NULL,
  success boolean NOT NULL,
  error_message text,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Create OTP verification logs table
CREATE TABLE IF NOT EXISTS otp_verification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number text NOT NULL,
  session_id uuid REFERENCES kyc_login_sessions(id),
  action text NOT NULL CHECK (action IN ('send', 'verify', 'resend')),
  success boolean NOT NULL,
  error_message text,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE kyc_login_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE pan_verification_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_verification_logs ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS kyc_login_sessions_phone_number_idx ON kyc_login_sessions(phone_number);
CREATE INDEX IF NOT EXISTS kyc_login_sessions_pan_number_idx ON kyc_login_sessions(pan_number);
CREATE INDEX IF NOT EXISTS kyc_login_sessions_session_token_idx ON kyc_login_sessions(session_token);
CREATE INDEX IF NOT EXISTS kyc_login_sessions_status_idx ON kyc_login_sessions(status);
CREATE INDEX IF NOT EXISTS pan_verification_logs_pan_number_idx ON pan_verification_logs(pan_number);
CREATE INDEX IF NOT EXISTS otp_verification_logs_phone_number_idx ON otp_verification_logs(phone_number);
CREATE INDEX IF NOT EXISTS otp_verification_logs_session_id_idx ON otp_verification_logs(session_id);

-- Create function to clean up expired sessions
CREATE OR REPLACE FUNCTION clean_expired_kyc_sessions()
RETURNS void AS $$
BEGIN
  UPDATE kyc_login_sessions
  SET status = 'expired'
  WHERE expires_at < now() AND status IN ('pending', 'pan_verified', 'otp_sent');
END;
$$ LANGUAGE plpgsql;

-- Create function to validate PAN format
CREATE OR REPLACE FUNCTION is_valid_pan(pan_number text)
RETURNS boolean AS $$
BEGIN
  RETURN pan_number ~ '^[A-Z]{5}[0-9]{4}[A-Z]{1}$';
END;
$$ LANGUAGE plpgsql;

-- Create RLS policies for kyc_login_sessions
CREATE POLICY "Anon users can create KYC login sessions"
ON kyc_login_sessions FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Users can view their own KYC login sessions"
ON kyc_login_sessions FOR SELECT
TO authenticated
USING (phone_number = auth.jwt() ->> 'phone');

-- Create RLS policies for verification logs (admin only)
CREATE POLICY "Only admins can view PAN verification logs"
ON pan_verification_logs FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Only admins can view OTP verification logs"
ON otp_verification_logs FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');

-- Create RLS policies for anon users to create verification logs
CREATE POLICY "Anon users can create PAN verification logs"
ON pan_verification_logs FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "Anon users can create OTP verification logs"
ON otp_verification_logs FOR INSERT
TO anon
WITH CHECK (true);