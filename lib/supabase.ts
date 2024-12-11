import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { storage } from './storage-adapter';

// const supabaseUrl = 'https://vfrowyjuieqcnicrhacb.supabase.co';
// const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcm93eWp1aWVxY25pY3JoYWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMzEyMzEsImV4cCI6MjA0ODcwNzIzMX0.pqDt1fan36CO-I_OOEIeTmDNPf15m_gGmv8sOLEQFAM';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}); 