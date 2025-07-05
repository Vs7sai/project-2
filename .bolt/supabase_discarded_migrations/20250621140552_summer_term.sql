/*
  # Fix storage policies for KYC documents

  1. New Tables
    - No new tables created
  2. Security
    - Creates a secure bucket for KYC documents
    - Adds policies for secure access to KYC documents
    - Restricts users to only access their own documents
*/

-- Create a secure bucket for KYC documents using the storage API
-- This avoids permission issues with direct schema access
BEGIN;

-- Create a function to create the bucket and policies
CREATE OR REPLACE FUNCTION create_kyc_bucket()
RETURNS void AS $$
DECLARE
  bucket_exists BOOLEAN;
BEGIN
  -- Check if bucket exists
  SELECT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'kyc-documents'
  ) INTO bucket_exists;
  
  -- Create bucket if it doesn't exist
  IF NOT bucket_exists THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'kyc-documents',
      'kyc-documents',
      FALSE,
      10485760, -- 10MB limit
      ARRAY['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']::text[]
    );
  END IF;

  -- Create policies using storage API functions
  -- Policy for uploading KYC documents
  INSERT INTO storage.policies (name, bucket_id, operation, definition)
  VALUES (
    'Users can upload their own KYC documents',
    'kyc-documents',
    'INSERT',
    'auth.uid()::text = (storage.foldername(name))[1]'
  ) ON CONFLICT (name, bucket_id, operation) DO NOTHING;

  -- Policy for viewing KYC documents
  INSERT INTO storage.policies (name, bucket_id, operation, definition)
  VALUES (
    'Users can view their own KYC documents',
    'kyc-documents',
    'SELECT',
    'auth.uid()::text = (storage.foldername(name))[1]'
  ) ON CONFLICT (name, bucket_id, operation) DO NOTHING;

  -- Prevent users from updating documents
  INSERT INTO storage.policies (name, bucket_id, operation, definition)
  VALUES (
    'Users cannot update KYC documents',
    'kyc-documents',
    'UPDATE',
    'false'
  ) ON CONFLICT (name, bucket_id, operation) DO NOTHING;

  -- Prevent users from deleting documents
  INSERT INTO storage.policies (name, bucket_id, operation, definition)
  VALUES (
    'Users cannot delete KYC documents',
    'kyc-documents',
    'DELETE',
    'false'
  ) ON CONFLICT (name, bucket_id, operation) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function for folder name extraction
CREATE OR REPLACE FUNCTION storage.foldername(name text)
RETURNS text[]
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT string_to_array(name, '/');
$$;

-- Execute the function to create bucket and policies
SELECT create_kyc_bucket();

-- Clean up the temporary function
DROP FUNCTION create_kyc_bucket();

COMMIT;