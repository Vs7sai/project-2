/*
  # Storage Policies for KYC Documents

  1. Storage Setup
    - Creates storage policies for KYC document management
    - Ensures users can only access their own documents
    - Prevents unauthorized access to sensitive documents

  2. Security Policies
    - Upload policy: Users can upload to their own folder
    - View policy: Users can only view their own documents
    - Update/Delete policies: Prevent modification of uploaded documents

  3. Important Notes
    - The bucket 'kyc-documents' should be created manually in Supabase dashboard
    - Folder structure: user_id/document_type-timestamp.ext
    - Documents are immutable once uploaded for audit purposes
*/

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can upload their own KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Users cannot update KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Users cannot delete KYC documents" ON storage.objects;

-- Create storage policies for KYC documents
-- Note: The bucket 'kyc-documents' should be created manually in Supabase dashboard

-- Policy for uploading KYC documents
CREATE POLICY "Users can upload their own KYC documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'kyc-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Policy for viewing KYC documents
CREATE POLICY "Users can view their own KYC documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'kyc-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Prevent users from updating documents (for audit trail)
CREATE POLICY "Users cannot update KYC documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (false);

-- Prevent users from deleting documents (for audit trail)
CREATE POLICY "Users cannot delete KYC documents"
ON storage.objects FOR DELETE
TO authenticated
USING (false);

-- Create indexes for better performance on storage queries
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_user 
ON storage.objects (bucket_id, (storage.foldername(name))[1]) 
WHERE bucket_id = 'kyc-documents';