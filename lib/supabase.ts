import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vfrowyjuieqcnicrhacb.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcm93eWp1aWVxY25pY3JoYWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMzEyMzEsImV4cCI6MjA0ODcwNzIzMX0.pqDt1fan36CO-I_OOEIeTmDNPf15m_gGmv8sOLEQFAM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}); 