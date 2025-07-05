/*
  # Storage Policies for KYC Documents

  1. Security
    - Enable users to upload their own KYC documents to designated folders
    - Allow users to view only their own documents
    - Prevent users from updating or deleting documents once uploaded
    - Folder structure: bucket/user_id/filename

  2. Storage Bucket
    - Bucket 'kyc-documents' should be created manually in Supabase dashboard
    - Set as private bucket (not public)
    - Configure appropriate file size limits and MIME type restrictions

  3. Policies
    - Upload: Users can only upload to their own folder (auth.uid())
    - View: Users can only view documents in their own folder
    - Update/Delete: Completely restricted for data integrity
*/

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can upload their own KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Users cannot update KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Users cannot delete KYC documents" ON storage.objects;

-- Create storage policies for KYC documents
-- Note: The bucket 'kyc-documents' should be created manually in Supabase dashboard

-- Allow users to upload documents to their own folder
CREATE POLICY "Users can upload their own KYC documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'kyc-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to view their own documents
CREATE POLICY "Users can view their own KYC documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'kyc-documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Prevent users from updating documents (for audit trail integrity)
CREATE POLICY "Users cannot update KYC documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (false);

-- Prevent users from deleting documents (for compliance and audit)
CREATE POLICY "Users cannot delete KYC documents"
ON storage.objects FOR DELETE
TO authenticated
USING (false);

-- Create additional policy for admin access (optional)
-- Uncomment if you need admin users to access all KYC documents
/*
CREATE POLICY "Admins can view all KYC documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'kyc-documents' AND
  (auth.jwt() ->> 'role')::text = 'admin'
);
*/