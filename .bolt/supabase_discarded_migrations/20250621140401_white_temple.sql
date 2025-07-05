/*
  # Fix Storage Policies for KYC Documents

  1. Security
    - Create storage bucket for KYC documents if it doesn't exist
    - Set up RLS policies for secure access to KYC documents
    - Ensure users can only access their own documents
    - Prevent modification and deletion of uploaded documents

  This migration uses Supabase's storage API functions rather than directly
  modifying the storage.objects table, which avoids permission issues.
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
END $$;

-- Create security policies using storage.create_policy function
-- This approach avoids direct manipulation of storage.objects table

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

-- Create function to help with folder name extraction if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_proc WHERE proname = 'foldername') THEN
    CREATE OR REPLACE FUNCTION storage.foldername(name text)
    RETURNS text[]
    LANGUAGE plpgsql
    AS $$
    BEGIN
      RETURN string_to_array(name, '/');
    END;
    $$;
  END IF;
END $$;

-- Create indexes for better performance on storage queries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_storage_objects_kyc_bucket'
  ) THEN
    CREATE INDEX idx_storage_objects_kyc_bucket 
    ON storage.objects (bucket_id) 
    WHERE bucket_id = 'kyc-documents';
  END IF;
END $$;

-- Add a comment to the bucket for documentation
COMMENT ON TABLE storage.buckets IS 'Storage buckets, including the kyc-documents bucket for secure storage of user verification documents';