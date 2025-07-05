/*
  # Storage Bucket for KYC Documents

  1. New Storage
    - Creates a secure 'kyc-documents' bucket for storing KYC verification documents
    - Sets 10MB file size limit
    - Restricts allowed file types to images and PDFs
    - Makes bucket private (not public)
  
  2. Security
    - Creates policies for user access control
    - Users can only upload to their own folders
    - Users can only view their own documents
    - Prevents document updates and deletions
  
  3. Utilities
    - Adds helper function for folder name extraction
*/

-- Create the KYC documents bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'kyc-documents',
  'KYC document storage',
  FALSE,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']::text[]
) ON CONFLICT (id) DO UPDATE 
  SET public = FALSE,
      file_size_limit = 10485760,
      allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']::text[];

-- Create helper function for folder name extraction
CREATE OR REPLACE FUNCTION storage.foldername(name text)
RETURNS text[]
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT string_to_array(name, '/');
$$;

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

-- Prevent users from updating documents (for audit trail)
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
  'Users cannot update KYC documents',
  'kyc-documents',
  'UPDATE',
  'false'
) ON CONFLICT (name, bucket_id, operation) DO UPDATE 
  SET definition = EXCLUDED.definition;

-- Prevent users from deleting documents (for audit trail)
INSERT INTO storage.policies (name, bucket_id, operation, definition)
VALUES (
  'Users cannot delete KYC documents',
  'kyc-documents',
  'DELETE',
  'false'
) ON CONFLICT (name, bucket_id, operation) DO UPDATE 
  SET definition = EXCLUDED.definition;

-- Add documentation comment
COMMENT ON FUNCTION storage.foldername IS 'Extracts folder names from storage object paths';
COMMENT ON TABLE storage.buckets IS 'Storage buckets for user files, including secure KYC document storage';