-- Run this in Supabase Dashboard > SQL Editor
-- https://supabase.com/dashboard/project/enejlftxqypcsmsanxzo/sql/new

-- Founding CEO / Head of Operations applications
CREATE TABLE ceo_applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  linkedin_url text NOT NULL,
  location text NOT NULL,
  current_title text,
  current_company text,
  years_experience text NOT NULL,
  marketplace_background text NOT NULL,
  other_platforms text,
  pl_experience text NOT NULL,
  team_size text NOT NULL,
  biggest_scale text NOT NULL,
  why_sweat_equity text NOT NULL,
  plan_30_60_90 text NOT NULL,
  anything_else text,
  video_url text NOT NULL,
  resume_url text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'first_call', 'deep_dive', 'offer', 'hired', 'rejected', 'withdrawn')),
  created_at timestamptz DEFAULT now()
);

CREATE INDEX ceo_applications_created_at_idx ON ceo_applications (created_at DESC);
CREATE INDEX ceo_applications_email_idx ON ceo_applications (email);
CREATE INDEX ceo_applications_status_idx ON ceo_applications (status);

-- RLS: lock down to service_role only (same pattern as applications table)
ALTER TABLE ceo_applications ENABLE ROW LEVEL SECURITY;

-- No public policies — only service_role (used by the API route) can read/write.
