import { createClient } from '@supabase/supabase-js';

// 1. Supabase Mocks Project (QB Questions, Syllabus Tracker, Shared Live Dump)
const mocksUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL_MOCKS) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) ||
  'https://xfjpruukqnocsskxwgdl.supabase.co';

const mocksAnonKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY_MOCKS) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmanBydXVrcW5vY3Nza3h3Z2RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NzU5NDYsImV4cCI6MjEwNjM1MTk0Nn0.I7QC_RNdwp0afAHO6n9CByHgdjAC9ajTptU51yYyFLg';

export const supabaseMocks = createClient(mocksUrl, mocksAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// 2. Supabase Oneliners Project (Solve Mode, Sprint Mode, Squad Leaderboard, RPC get_next_question)
const onelinersUrl =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL_ONELINERS) ||
  'https://lacvlqethzpabveqwxsy.supabase.co';

const onelinersAnonKey =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY_ONELINERS) ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhY3ZscWV0aHpwYWJ2ZXF3eHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MTgxMzMsImV4cCI6MjEwNjA5NDEzM30.f1tGlb2jXv7ibE_M9-FIneOQJscMVDhrs7nkTUajONY';

export const supabaseOneliners = createClient(onelinersUrl, onelinersAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Backward compatibility alias (points to supabaseMocks by default)
export const supabase = supabaseMocks;
