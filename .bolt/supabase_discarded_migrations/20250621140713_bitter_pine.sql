/*
  # Storage Bucket for KYC Documents

  1. New Storage
    - Creates a private 'kyc-documents' bucket for secure document storage
    - Sets 10MB file size limit
    - Restricts to image and PDF file types
  
  2. Security
    - Adds RLS policies for the storage.objects table
    - Users can only upload to their own folder
    - Users can only view their own documents
    - Prevents document modification and deletion
*/

-- Create a bucket for KYC documents
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

-- Create RLS policies directly on the objects table

-- Policy for uploading KYC documents (users can only upload to their own folder)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Users can upload their own KYC documents'
  ) THEN
    CREATE POLICY "Users can upload their own KYC documents"
    ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (
      bucket_id = 'kyc-documents' AND
      (auth.uid())::text = SPLIT_PART(name, '/', 1)
    );
  END IF;
END
$$;

-- Policy for viewing KYC documents (users can only view their own documents)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Users can view their own KYC documents'
  ) THEN
    CREATE POLICY "Users can view their own KYC documents"
    ON storage.objects FOR SELECT TO authenticated
    USING (
      bucket_id = 'kyc-documents' AND
      (auth.uid())::text = SPLIT_PART(name, '/', 1)
    );
  END IF;
END
$$;

-- Policy to prevent document updates (always false)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Users cannot update KYC documents'
  ) THEN
    CREATE POLICY "Users cannot update KYC documents"
    ON storage.objects FOR UPDATE TO authenticated
    USING (
      bucket_id = 'kyc-documents' AND
      false -- Always deny updates
    );
  END IF;
END
$$;

-- Policy to prevent document deletions (always false)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'objects' 
    AND schemaname = 'storage' 
    AND policyname = 'Users cannot delete KYC documents'
  ) THEN
    CREATE POLICY "Users cannot delete KYC documents"
    ON storage.objects FOR DELETE TO authenticated
    USING (
      bucket_id = 'kyc-documents' AND
      false -- Always deny deletions
    );
  END IF;
END
$$;

-- Ensure RLS is enabled on the objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

COMMIT;