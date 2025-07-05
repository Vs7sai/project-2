/*
  # Fix Storage Policies for KYC Documents

  1. New Bucket
    - Creates 'kyc-documents' bucket if it doesn't exist
    - Sets 10MB file size limit
    - Restricts to image and PDF files only
    - Makes bucket private (not public)

  2. Security
    - Adds upload policy for authenticated users (own folder only)
    - Adds read policy for authenticated users (own folder only)
    - Creates helper function for folder name extraction

  3. Performance
    - Adds index for faster bucket queries
*/

-- Create the KYC documents bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public, avif_autodetection, file_size_limit, allowed_mime_types)
  VALUES (
    'kyc-documents',
    'kyc-documents',
    FALSE,
    FALSE,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']::text[]
  )
  ON CONFLICT (id) DO NOTHING;
END
$$;

-- Create function to help with folder name extraction if it doesn't exist
CREATE OR REPLACE FUNCTION storage.foldername(name text)
RETURNS text[]
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN string_to_array(name, '/');
END;
$$;

-- Policy for uploading KYC documents
SELECT storage.create_policy(
  'kyc-documents',
  'upload',
  'authenticated',
  'auth.uid()::text = (storage.foldername(name))[1]'
);

-- Policy for viewing KYC documents
SELECT storage.create_policy(
  'kyc-documents',
  'read',
  'authenticated',
  'auth.uid()::text = (storage.foldername(name))[1]'
);

-- Create index for better performance on storage queries
CREATE INDEX IF NOT EXISTS idx_storage_objects_kyc_bucket 
ON storage.objects (bucket_id) 
WHERE bucket_id = 'kyc-documents';

-- Add a comment to the bucket for documentation
COMMENT ON TABLE storage.buckets IS 'Storage buckets, including the kyc-documents bucket for secure storage of user verification documents';