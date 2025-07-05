/*
  # KYC and Contest Tables Setup

  1. New Tables
    - `kyc_details`
      - User verification information
      - Personal details, document info, and bank details
    
    - `contests_participants`
      - Track contest participation
      - Link users to contests with their portfolio

  2. Security
    - Enable RLS
    - Add appropriate access policies
*/

-- KYC Details table
CREATE TABLE public.kyc_details (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    full_name text NOT NULL,
    dob date NOT NULL,
    address text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    pincode text NOT NULL,
    phone text NOT NULL,
    id_type text NOT NULL,
    id_number text NOT NULL,
    id_front_url text,
    id_back_url text,
    bank_name text,
    account_number text,
    ifsc_code text,
    account_holder_name text,
    verification_status text DEFAULT 'pending',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id)
);

-- Contest Participants table
CREATE TABLE public.contests_participants (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    contest_id uuid NOT NULL,
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    portfolio_id uuid REFERENCES public.portfolios ON DELETE CASCADE,
    join_time timestamptz DEFAULT now(),
    rank integer,
    profit numeric DEFAULT 0,
    profit_percentage numeric DEFAULT 0,
    UNIQUE(contest_id, user_id)
);

-- Enable RLS
ALTER TABLE public.kyc_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contests_participants ENABLE ROW LEVEL SECURITY;

-- KYC Details policies
CREATE POLICY "Users can view their own KYC details"
    ON public.kyc_details
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own KYC details"
    ON public.kyc_details
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own KYC details"
    ON public.kyc_details
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());

-- Contest Participants policies
CREATE POLICY "Users can view contest participants"
    ON public.contests_participants
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Users can join contests"
    ON public.contests_participants
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own contest participation"
    ON public.contests_participants
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid());