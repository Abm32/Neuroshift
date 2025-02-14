import { create } from 'zustand';
import { supabase } from './supabase';
import type { User, DailyCheckin, Task, EducationalContent } from './types';

interface AppState {
  user: User | null;
  checkins: DailyCheckin[];
  tasks: Task[];
  educationalContent: EducationalContent[];
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  fetchUserData: () => Promise<void>;
  addCheckin: (checkin: Omit<DailyCheckin, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  addTask: (task: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  fetchEducationalContent: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  checkins: [],
  tasks: [],
  educationalContent: [],
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),

  fetchUserData: async () => {
    const { user } = get();
    if (!user) return;

    set({ isLoading: true, error: null });
    try {
      const { data: checkins, error: checkinsError } = await supabase
        .from('daily_checkins')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (checkinsError) throw checkinsError;

      const { data: tasks, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('due_date', { ascending: true });

      if (tasksError) throw tasksError;

      set({
        checkins: checkins || [],
        tasks: tasks || [],
        isLoading: false
      });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },

  addCheckin: async (checkin) => {
    const { user } = get();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('daily_checkins')
        .insert([{ ...checkin, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        checkins: [data, ...state.checkins]
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  addTask: async (task) => {
    const { user } = get();
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert([{ ...task, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        tasks: [...state.tasks, data]
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  updateTask: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        tasks: state.tasks.map((task) => 
          task.id === id ? { ...task, ...data } : task
        )
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    }
  },

  fetchEducationalContent: async () => {
    try {
      const { data, error } = await supabase
        .from('educational_content')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({ educationalContent: data || [] });
    } catch (error) {
      set({ error: (error as Error).message });
    }
  }
}));