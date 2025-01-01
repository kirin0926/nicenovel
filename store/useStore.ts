import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'//持久化
import { storage } from '@/lib/storage-adapter'
import { supabase } from '@/lib/supabase'

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

interface Subscription {
  status: 'active' | 'inactive';
  expiryDate?: string;
}

interface StoreState {
  user: User | null;
  subscription: Subscription | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setSubscription: (subscription: Subscription | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  checkSubscriptionStatus: (userId: string) => Promise<void>;
  logout: () => Promise<void>;
}

const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      user: null,
      subscription: null,
      isLoading: false,

      setUser: (user) => set({ user }),
      setSubscription: (subscription) => set({ subscription }),
      setIsLoading: (isLoading) => set({ isLoading }),

      checkSubscriptionStatus: async (userId) => {
        try {
          set({ isLoading: true });
          const { data, error } = await supabase
            .from('subscriptions')
            .select('*')
            .eq('user_id', userId)
            .eq('status', 'active')
            .gte('current_period_end', new Date().toISOString())
            .single();

          if (error) throw error;

          set({
            subscription: {
              status: data ? 'active' : 'inactive',
              expiryDate: data?.current_period_end,
            },
          });
        } catch (error) {
          console.error('Error checking subscription:', error);
          set({ subscription: { status: 'inactive' } });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await supabase.auth.signOut();
          set({ user: null, subscription: null });
        } catch (error) {
          console.error('Error logging out:', error);
        }
      },
    }),
    {
      name: 'app-storage',
      storage: createJSONStorage(() => storage),
    }
  )
)

export default useStore 