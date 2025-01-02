import { supabase } from '@/lib/supabase';

export const backendUrl = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000'  // 开发环境
  : process.env.EXPO_PUBLIC_VERCEL_PRODUCTION_URL;  // 生产环境

export const stripeKey = process.env.NODE_ENV === 'development' 
  ? 'pk_test_51PBXHTDISTrmdpg8Px0ZFxMz42kbz2rQg2uiwnRt6HgAhLJrGeIpKShrHuiRk1wQCHwyTQYZVZnvBZiRZ5uBwmo2001GnjOGoD'  // 开发环境
  : process.env.EXPO_PUBLIC_PRODUCTION_STRIPE_KEY;  // 生产环境

// supabase接口
export const api = {
  
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
  // 获取订阅计划
  getSubscriptionPlans: async () => {
    const { data, error } = await supabase
    .from('stripe_prices')
    .select('*');
    
    return { data, error };
  },
  // 获取用户订阅状态
  checkSubscriptionStatus: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('id, user_id, status, current_period_end')
        .eq('user_id', userId)
        .maybeSingle();
      
      return { data, error };
    } catch (e) {
      console.error('Subscription check error:', e);
      return { data: null, error: e };
    }
  },
  // 使用id token登录
  signInWithIdToken: async (idToken: string) => {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: idToken,
    });
    return { data, error };
  },
  // 登出
  signOut: async () => {
    await supabase.auth.signOut();
  },
  // 检查session是否有效
  checkSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      // 检查是否有错误或session不存在
      if (error || !session) {
        return {
          isValid: false,
          session: null,
          error: error || new Error('No session found')
        };
      }

      // 检查access token是否存在且未过期
      if (session.expires_at) {
        const expiresAt = new Date(session.expires_at * 1000);
        const now = new Date();
        
        if (expiresAt <= now) {
          // Token已过期，尝试刷新
          const { error: refreshError } = await supabase.auth.refreshSession();
          if (refreshError) {
            // 刷新失败，可能是refresh token已失效
            return {
              isValid: false,
              session: null,
              error: refreshError
            };
          }
        }
      }

      return {
        isValid: true,
        session,
        error: null
      };
    } catch (e) {
      console.error('Session check error:', e);
      return {
        isValid: false,
        session: null,
        error: e
      };
    }
  },
};

//后端接口
export const backendapi = {
  // 创建订阅
  createSubscription: async (plan: { id: string }) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const response = await fetch(`${backendUrl}/create-subscription`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: user?.email,
          priceId: plan.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Subscription creation failed');
      }

      return await response.json();
    } catch (error) {
      return { error };
    }
  }
};