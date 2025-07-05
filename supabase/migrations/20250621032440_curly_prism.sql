/*
  # Fix Storage Policies for KYC Documents

  1. Storage Policies
    - Drop existing policies if they exist
    - Create new policies for KYC document storage
    - Ensure users can only access their own documents

  2. Security
    - Users can upload their own KYC documents
    - Users can view their own KYC documents
    - Users cannot update or delete documents once uploaded
*/

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload their own KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Users cannot update KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Users cannot delete KYC documents" ON storage.objects;

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

-- Prevent users from updating/deleting documents
CREATE POLICY "Users cannot update KYC documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "Users cannot delete KYC documents"
ON storage.objects FOR DELETE
TO authenticated
USING (false);