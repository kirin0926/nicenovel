import 'react-native-url-polyfill/auto';// 解决supabase的url问题
import { createClient } from '@supabase/supabase-js';// 创建supabase客户端
import { storage } from './storage-adapter';// 存储适配器

// const supabaseUrl = 'https://vfrowyjuieqcnicrhacb.supabase.co';
// const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZmcm93eWp1aWVxY25pY3JoYWNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMxMzEyMzEsImV4cCI6MjA0ODcwNzIzMX0.pqDt1fan36CO-I_OOEIeTmDNPf15m_gGmv8sOLEQFAM';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storage,// 使用storage适配器
    autoRefreshToken: true,// 自动刷新令牌
    persistSession: true,// 持久化会话
    detectSessionInUrl: false,// 检测会话是否在url中
  },
}); 