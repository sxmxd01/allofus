import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xfjpruukqnocsskxwgdl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmanBydXVrcW5vY3Nza3h3Z2RsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA3NzU5NDYsImV4cCI6MjEwNjM1MTk0Nn0.I7QC_RNdwp0afAHO6n9CByHgdjAC9ajTptU51yYyFLg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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
