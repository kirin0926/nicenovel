import { supabase } from '@/lib/supabase';

export const api = {
  // 获取订阅计划
  getSubscriptionPlans: async () => {
    const { data, error } = await supabase
    .from('stripe_prices')
    .select('*');
    
    return { data, error };
  },
  // 获取小说章节
  getNovelChapter: async (novelId: string, chapterId: string) => {
    const { data, error } = await supabase
    .from('novel_chapters')
    .select('*')
    .eq('novel_id', novelId)
    .eq('chapter_id', chapterId);

    return { data, error };
  },
  // 获取小说章节内容
  getNovelChapterContent: async (novelId: string, chapterId: string) => {
    const { data, error } = await supabase
    .from('novel_chapters')
    .select('*')
    .eq('novel_id', novelId)
    .eq('chapter_id', chapterId);

    return { data, error };
  },
  // 获取首页小说列表
  getNovelList: async () => {
    const { data, error } = await supabase
    .from('novels')
    .select('*');

    return { data, error };
  },
  // 获取用户订阅状态
  checkSubscriptionStatus: async (userId: string) => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)// 用户id
      .eq('status', 'active')// 状态
      .gte('current_period_end', new Date().toISOString())// 结束时间
      .single();// 单个
  
    return { data, error };
  },
};
