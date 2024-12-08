import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from './supabase';
import { Session, User } from '@supabase/supabase-js';

type UserContextType = {
  session: Session | null;
  user: User | null;
};

const UserContext = createContext<UserContextType>({ session: null, user: null });

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 获取当前会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ session, user }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext); 