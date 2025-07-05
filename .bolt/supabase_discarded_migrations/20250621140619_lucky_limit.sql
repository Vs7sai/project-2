/*
  # Storage Policies for KYC Documents

  1. New Storage Bucket
    - Creates a private 'kyc-documents' bucket for secure document storage
    - Sets 10MB file size limit
    - Restricts to image and PDF files only

  2. Security
    - Implements folder-based security using user IDs
    - Users can only access their own documents
    - Prevents document modification after upload
*/

-- Create a bucket for KYC documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('kyc-documents', 'kyc-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Set bucket configuration
UPDATE storage.buckets 
SET file_size_limit = 10485760, -- 10MB
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']::text[]
WHERE id = 'kyc-documents';

-- Enable RLS on objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to upload their own KYC documents
CREATE POLICY "Users can upload their own KYC documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'kyc-documents' AND
  (auth.uid())::text = SPLIT_PART(name, '/', 1)
);

-- Create policy to allow users to view their own KYC documents
CREATE POLICY "Users can view their own KYC documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'kyc-documents' AND
  (auth.uid())::text = SPLIT_PART(name, '/', 1)
);

-- Create policy to prevent users from updating KYC documents
CREATE POLICY "Users cannot update KYC documents"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'kyc-documents' AND
  false -- Always deny updates
);

-- Create policy to prevent users from deleting KYC documents
CREATE POLICY "Users cannot delete KYC documents"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'kyc-documents' AND
  false -- Always deny deletions
);