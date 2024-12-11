import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Session, User } from '@supabase/supabase-js';

// 定义上下文中要共享的数据类型
// Session: Supabase 的会话信息，包含 token 等认证数据
// User: 用户基本信息，包含 id、email 等
type UserContextType = {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
};

// 创建 Context，设置默认值为 null
// createContext 用于创建一个可以跨组件层级传递数据的容器
const UserContext = createContext<UserContextType>({
  session: null,
  user: null,
  signOut: async () => {},
});

// UserProvider 组件：用于包装整个应用，提供用户状态管理
// children 参数使用 React.ReactNode 类型，表示可以接收任何有效的 React 子元素
export function UserProvider({ children }: { children: React.ReactNode }) {
  // 使用 useState 管理会话和用户状态
  // 这些状态会在用户登录、登出时更新
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // 新增 signOut 方法
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    // 1. 初始化：获取当前会话状态
    // 应用启动时检查是否有现存的会话
    supabase.auth.getSession().then(({ data: { session } ,error}) => {
      if (error) {
        console.error('Session error:', error);
        // 如果是 refresh token 错误，清除会话
        if (error.message.includes('Refresh Token Not Found')) {
          supabase.auth.signOut();
        }
        return;
      }
      setSession(session);
      setUser(session?.user ?? null);
    });

    // 2. 设置监听器：监听认证状态变化
    // onAuthStateChange 会在用户登录、登出、token 刷新等事件时触发
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') {
        setSession(session);
        setUser(session?.user ?? null);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
      } else if (event === 'USER_UPDATED') {
        setSession(session);
        setUser(session?.user ?? null);
      }
    });

    // 3. 清理函数：组件卸载时取消订阅
    // 防止内存泄漏
    return () => subscription.unsubscribe();
  }, []); // 空依赖数组表示这个效果只在组件挂载时运行一次

  // 通过 Context.Provider 向子组件提供状态
  return (
    <UserContext.Provider value={{ session, user, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

// 自定义 Hook：方便在其他组件中获取用户状态
// 使用 useContext 获取 UserContext 中的值
export const useUser = () => useContext(UserContext); 