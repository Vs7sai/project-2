/*
  # Contest API Integration

  1. New Tables
    - `external_contests` - Store contests fetched from external API
    - `contest_results` - Store contest results to be sent to external API
    
  2. Security
    - Enable RLS on all tables
    - Add appropriate access policies
    
  3. Indexes
    - Add indexes for performance optimization
*/

-- Create external_contests table to store contests from API
CREATE TABLE IF NOT EXISTS public.external_contests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id text UNIQUE,
  title text NOT NULL,
  description text,
  prize_pool numeric NOT NULL DEFAULT 0,
  max_participants integer NOT NULL DEFAULT 0,
  first_prize numeric,
  second_prize numeric,
  third_prize numeric,
  registration_starts_at timestamptz NOT NULL,
  registration_ends_at timestamptz NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  sector text,
  is_completed boolean DEFAULT false,
  raw_data jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create contest_results table to store results to be sent to API
CREATE TABLE IF NOT EXISTS public.contest_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id text NOT NULL,
  results jsonb NOT NULL,
  is_sent boolean DEFAULT false,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.external_contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contest_results ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS external_contests_external_id_idx ON public.external_contests(external_id);
CREATE INDEX IF NOT EXISTS external_contests_start_time_idx ON public.external_contests(start_time);
CREATE INDEX IF NOT EXISTS external_contests_end_time_idx ON public.external_contests(end_time);
CREATE INDEX IF NOT EXISTS external_contests_is_completed_idx ON public.external_contests(is_completed);
CREATE INDEX IF NOT EXISTS contest_results_contest_id_idx ON public.contest_results(contest_id);
CREATE INDEX IF NOT EXISTS contest_results_is_sent_idx ON public.contest_results(is_sent);

-- Create RLS policies for external_contests
CREATE POLICY "Anyone can view external contests"
  ON public.external_contests
  FOR SELECT
  USING (true);

CREATE POLICY "Only service role can insert external contests"
  ON public.external_contests
  FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Only service role can update external contests"
  ON public.external_contests
  FOR UPDATE
  TO service_role
  USING (true);

-- Create RLS policies for contest_results
CREATE POLICY "Only authenticated users can view contest results"
  ON public.contest_results
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only authenticated users can insert contest results"
  ON public.contest_results
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Only service role can update contest results"
  ON public.contest_results
  FOR UPDATE
  TO service_role
  USING (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_external_contests_updated_at
  BEFORE UPDATE ON public.external_contests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contest_results_updated_at
  BEFORE UPDATE ON public.contest_results
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();