-- Run this in Supabase Dashboard > SQL Editor
-- https://supabase.com/dashboard/project/enejlftxqypcsmsanxzo/sql/new

-- Leads (booking requests)
CREATE TABLE leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  service text NOT NULL,
  borough text NOT NULL,
  preferred_date text,
  message text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'booked', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- Applications (job applications)
CREATE TABLE applications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  specialty text NOT NULL,
  borough text NOT NULL,
  instagram text,
  experience text,
  availability text,
  message text,
  resume_url text,
  video_url text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'interview', 'hired', 'rejected')),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for public forms)
CREATE POLICY "Allow public insert" ON leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public insert" ON applications FOR INSERT WITH CHECK (true);

-- Allow service role full access (for admin panel)
CREATE POLICY "Service role full access leads" ON leads FOR ALL USING (true);
CREATE POLICY "Service role full access apps" ON applications FOR ALL USING (true);

-- Create storage bucket for uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('uploads', 'uploads', true);

-- Allow public uploads to the uploads bucket
CREATE POLICY "Allow public uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'uploads');
CREATE POLICY "Allow public read uploads" ON storage.objects FOR SELECT USING (bucket_id = 'uploads');
