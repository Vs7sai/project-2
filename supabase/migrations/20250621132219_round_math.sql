/*
  # Storage Policies for KYC Documents

  1. Security Policies
    - Users can upload KYC documents to their own folder only
    - Users can view their own KYC documents only
    - Documents cannot be updated once uploaded (audit trail)
    - Documents cannot be deleted (compliance requirement)

  2. File Structure
    - Path format: kyc-documents/{user-id}/{filename}
    - Each user has their own isolated folder

  3. Compliance
    - Maintains document integrity for regulatory requirements
    - Prevents tampering with uploaded documents
    - Ensures audit trail preservation
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
-- File path structure: kyc-documents/{user-id}/{filename}
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
-- Once uploaded, KYC documents should not be modified for compliance
CREATE POLICY "Users cannot update KYC documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (false);

-- Prevent users from deleting documents (for audit trail)
-- KYC documents must be retained for regulatory compliance
CREATE POLICY "Users cannot delete KYC documents"
ON storage.objects FOR DELETE
TO authenticated
USING (false);

-- Note: Indexes on storage.objects table require superuser privileges
-- These would be created by Supabase administrators if needed:
-- CREATE INDEX idx_storage_objects_bucket_name ON storage.objects (bucket_id, name);
-- CREATE INDEX idx_storage_objects_kyc_bucket ON storage.objects (bucket_id) WHERE bucket_id = 'kyc-documents';