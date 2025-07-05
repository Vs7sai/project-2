/*
  # Storage Bucket and Policies for KYC Documents

  1. New Storage Bucket
    - Creates a secure `kyc-documents` bucket for storing user verification documents
    - Sets 10MB file size limit
    - Restricts to specific file types (JPEG, PNG, PDF)
    - Makes bucket private (not publicly accessible)

  2. Security
    - Creates policies for authenticated users to access only their own documents
    - Implements folder-based security using user ID as folder name
    - Adds performance optimization with indexes
*/

-- Create the KYC documents bucket if it doesn't exist
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

-- Create policy for uploading KYC documents
CREATE POLICY "Users can upload their own KYC documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'kyc-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create policy for viewing KYC documents
CREATE POLICY "Users can view their own KYC documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'kyc-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create index for better performance on storage queries
CREATE INDEX IF NOT EXISTS idx_storage_objects_kyc_bucket 
ON storage.objects (bucket_id) 
WHERE bucket_id = 'kyc-documents';

-- Add a comment to the bucket for documentation
COMMENT ON TABLE storage.buckets IS 'Storage buckets, including the kyc-documents bucket for secure storage of user verification documents';