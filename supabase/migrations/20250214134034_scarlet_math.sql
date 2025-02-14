/*
  # Initial Schema Setup for NeuroShift

  1. New Tables
    - users
      - Stores user profile information and preferences
    - daily_checkins
      - Records daily user check-ins and metrics
    - tasks
      - Stores user tasks and completion status
    - educational_content
      - Manages educational articles and resources
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  wake_time TIME NOT NULL,
  sleep_time TIME NOT NULL,
  work_start_time TIME NOT NULL,
  work_end_time TIME NOT NULL,
  energy_baseline INTEGER CHECK (energy_baseline BETWEEN 1 AND 10),
  focus_challenges TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Daily check-ins table
CREATE TABLE IF NOT EXISTS daily_checkins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  date DATE DEFAULT CURRENT_DATE,
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
  mood_rating INTEGER CHECK (mood_rating BETWEEN 1 AND 10),
  focus_rating INTEGER CHECK (focus_rating BETWEEN 1 AND 10),
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 10),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  due_date DATE,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Educational content table
CREATE TABLE IF NOT EXISTS educational_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  reading_time INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE educational_content ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Daily check-ins policies
CREATE POLICY "Users can read own check-ins"
  ON daily_checkins FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own check-ins"
  ON daily_checkins FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Users can read own tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own tasks"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own tasks"
  ON tasks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Educational content policies (readable by all authenticated users)
CREATE POLICY "Users can read educational content"
  ON educational_content FOR SELECT
  TO authenticated
  USING (true);