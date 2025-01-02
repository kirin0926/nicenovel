import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'//持久化
import { storage } from '@/lib/storage-adapter'
import { api } from '@/services/api'

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
          const { data, error } = await api.checkSubscriptionStatus(userId);

          if (error) throw error;
          
          if (data) {
            // console.log('data', data);
            set({
              subscription: {
                status: 'active',
                expiryDate: data?.current_period_end,
              },
            });
          } else {
            // console.log('data', data);
            set({
              subscription: {
                status: 'inactive',
                expiryDate: undefined,
              },
            });
          }
        } catch (error) {
          console.log('Error checking subscription:', error);
          set({ subscription: { status: 'inactive' } });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        try {
          await api.signOut();
          set({ user: null, subscription: null });
        } catch (error) {
          console.log('Error logging out:', error);
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