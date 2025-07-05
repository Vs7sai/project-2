/*
  # Fix Storage Policies for KYC Documents

  1. New Tables
    - No new tables created
  2. Security
    - Creates storage bucket for KYC documents
    - Sets up RLS policies for secure document access
    - Ensures users can only access their own documents
*/

-- Create the KYC documents bucket using the built-in Supabase function
-- This avoids permission issues with direct storage schema access
SELECT create_bucket('kyc-documents', 'KYC document storage');

-- Configure the bucket properties
UPDATE storage.buckets 
SET public = FALSE,
    file_size_limit = 10485760, -- 10MB limit
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']::text[]
WHERE id = 'kyc-documents';

-- Create security policies for the KYC documents bucket
-- Policy for uploading KYC documents (users can only upload to their own folder)
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
  'Users can upload their own KYC documents',
  'kyc-documents',
  'INSERT',
  'auth.uid()::text = (storage.foldername(name))[1]'
) ON CONFLICT (name, bucket_id, operation) DO UPDATE 
  SET definition = EXCLUDED.definition;

-- Policy for viewing KYC documents (users can only view their own documents)
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
  'Users can view their own KYC documents',
  'kyc-documents',
  'SELECT',
  'auth.uid()::text = (storage.foldername(name))[1]'
) ON CONFLICT (name, bucket_id, operation) DO UPDATE 
  SET definition = EXCLUDED.definition;

-- Create helper function for folder name extraction if it doesn't exist
CREATE OR REPLACE FUNCTION storage.foldername(name text)
RETURNS text[]
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT string_to_array(name, '/');
$$;

-- Add documentation comment
COMMENT ON FUNCTION storage.foldername IS 'Extracts folder names from storage object paths';