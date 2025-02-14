export interface User {
  id: string;
  wake_time: string;
  sleep_time: string;
  work_start_time: string;
  work_end_time: string;
  energy_baseline: number;
  focus_challenges: string;
  created_at: string;
  updated_at: string;
}

export interface DailyCheckin {
  id: string;
  user_id: string;
  date: string;
  energy_level: number;
  mood_rating: number;
  focus_rating: number;
  sleep_quality: number;
  notes: string;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category: string;
  due_date: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface EducationalContent {
  id: string;
  title: string;
  content: string;
  category: string;
  reading_time: number;
  created_at: string;
  updated_at: string;
}