/*
  # Fix Storage Policies for KYC Documents

  1. Storage Policies
    - Create policies for KYC document storage with proper checks
    - Users can upload their own documents
    - Users can view their own documents
    - Prevent updates and deletions for audit trail

  2. Security
    - User-specific folder access
    - Upload-only permissions (no updates/deletes)
    - Authenticated user requirements
*/

-- Drop existing policies if they exist to avoid conflicts
DO $$
BEGIN
  -- Drop upload policy if exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can upload their own KYC documents'
  ) THEN
    DROP POLICY "Users can upload their own KYC documents" ON storage.objects;
  END IF;

  -- Drop view policy if exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users can view their own KYC documents'
  ) THEN
    DROP POLICY "Users can view their own KYC documents" ON storage.objects;
  END IF;

  -- Drop update policy if exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users cannot update KYC documents'
  ) THEN
    DROP POLICY "Users cannot update KYC documents" ON storage.objects;
  END IF;

  -- Drop delete policy if exists
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects' 
    AND policyname = 'Users cannot delete KYC documents'
  ) THEN
    DROP POLICY "Users cannot delete KYC documents" ON storage.objects;
  END IF;
END $$;

-- Create storage policies for KYC documents
-- Note: The bucket 'kyc-documents' should be created manually in Supabase dashboard

CREATE POLICY "Users can upload their own KYC documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'kyc-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own KYC documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'kyc-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Prevent users from updating/deleting documents for audit trail
CREATE POLICY "Users cannot update KYC documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "Users cannot delete KYC documents"
ON storage.objects FOR DELETE
TO authenticated
USING (false);