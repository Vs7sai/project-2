/*
  # Fix Storage Policies for KYC Documents

  1. New Storage Bucket
    - Create 'kyc-documents' bucket for secure document storage
    - Set 10MB file size limit
    - Restrict to specific MIME types (images and PDF)
    - Make bucket private (not public)

  2. Security
    - Create policies for authenticated users to:
      - Upload documents to their own folder
      - View only their own documents
    - Prevent document updates and deletions
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
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'kyc-documents' AND
  (auth.uid())::text = (SPLIT_PART(name, '/', 1))
);

-- Create policy for viewing KYC documents
CREATE POLICY "Users can view their own KYC documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'kyc-documents' AND
  (auth.uid())::text = (SPLIT_PART(name, '/', 1))
);

-- Prevent users from updating documents
CREATE POLICY "Users cannot update KYC documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (false);

-- Prevent users from deleting documents
CREATE POLICY "Users cannot delete KYC documents"
ON storage.objects FOR DELETE
TO authenticated
USING (false);

-- Add a comment to the bucket for documentation
COMMENT ON TABLE storage.buckets IS 'Storage buckets, including the kyc-documents bucket for secure storage of user verification documents';