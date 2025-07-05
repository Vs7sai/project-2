/*
  # Storage bucket for KYC documents

  1. New Storage
    - Creates a private 'kyc-documents' bucket for secure document storage
    - Sets file size limit to 10MB
    - Restricts allowed file types to images and PDFs
  
  2. Security
    - Creates secure access policies for the bucket
    - Users can only access their own documents
    - Prevents document modification and deletion
*/

-- Create a bucket for KYC documents using Supabase's storage API
BEGIN;

-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
SELECT 'kyc-documents', 'kyc-documents', false
WHERE NOT EXISTS (
  SELECT 1 FROM storage.buckets WHERE id = 'kyc-documents'
);

-- Set bucket configuration
UPDATE storage.buckets 
SET file_size_limit = 10485760, -- 10MB
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']::text[]
WHERE id = 'kyc-documents';

-- Create access policies using Supabase's storage API functions
-- These functions handle the permission issues

-- Policy for uploading KYC documents (users can only upload to their own folder)
SELECT storage.create_policy(
  'kyc-documents',
  'upload',
  'authenticated',
  '(auth.uid())::text = SPLIT_PART(name, ''/''::text, 1)'
);

-- Policy for viewing KYC documents (users can only view their own documents)
SELECT storage.create_policy(
  'kyc-documents',
  'read',
  'authenticated',
  '(auth.uid())::text = SPLIT_PART(name, ''/''::text, 1)'
);

-- Policy to prevent document updates (always false)
SELECT storage.create_policy(
  'kyc-documents',
  'update',
  'authenticated',
  'false'
);

-- Policy to prevent document deletions (always false)
SELECT storage.create_policy(
  'kyc-documents',
  'delete',
  'authenticated',
  'false'
);

COMMIT;