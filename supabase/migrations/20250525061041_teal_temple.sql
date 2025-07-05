/*
  # Storage policies for KYC documents

  1. Security
    - Enable RLS on kyc-documents bucket
    - Add policies for:
      - Users can upload their own documents
      - Users can only view their own documents
      - Users cannot delete documents (admin only)
*/

-- Enable RLS
CREATE POLICY "Users can upload their own KYC documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'kyc-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own KYC documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'kyc-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
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