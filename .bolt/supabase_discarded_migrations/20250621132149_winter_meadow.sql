/*
  # Storage Policies for KYC Documents

  1. Security Policies
    - Users can upload KYC documents to their own folder
    - Users can view their own KYC documents only
    - Documents cannot be updated or deleted (audit trail)
    
  2. Performance
    - Index for efficient bucket and folder queries
    
  3. Requirements
    - The 'kyc-documents' bucket must be created manually in Supabase dashboard
    - Bucket should be set to private (not public)
*/

-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can upload their own KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Users cannot update KYC documents" ON storage.objects;
DROP POLICY IF EXISTS "Users cannot delete KYC documents" ON storage.objects;

-- Create storage policies for KYC documents
-- Note: The bucket 'kyc-documents' should be created manually in Supabase dashboard

-- Policy for uploading KYC documents
-- Users can only upload to folders that match their user ID
CREATE POLICY "Users can upload their own KYC documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'kyc-documents' AND
  auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- Policy for viewing KYC documents
-- Users can only view documents in their own folder
CREATE POLICY "Users can view their own KYC documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'kyc-documents' AND
  auth.uid()::text = (string_to_array(name, '/'))[1]
);

-- Prevent users from updating documents (for audit trail)
-- Once uploaded, KYC documents should not be modified
CREATE POLICY "Users cannot update KYC documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (false);

-- Prevent users from deleting documents (for audit trail)
-- KYC documents must be retained for compliance
CREATE POLICY "Users cannot delete KYC documents"
ON storage.objects FOR DELETE
TO authenticated
USING (false);

-- Create indexes for better performance on storage queries
-- This helps with faster lookups when users access their KYC documents
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_name 
ON storage.objects (bucket_id, name) 
WHERE bucket_id = 'kyc-documents';

-- Additional index for bucket-specific queries
CREATE INDEX IF NOT EXISTS idx_storage_objects_kyc_bucket 
ON storage.objects (bucket_id) 
WHERE bucket_id = 'kyc-documents';