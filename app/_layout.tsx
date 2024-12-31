import { Stack } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from '@/lib/UserContext';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// 引入 analytics 服务
import { initializeAnalytics } from '@/services/analytics';
// 在应用启动时调用
initializeAnalytics();

// Initialize Stripe
export const stripePromise = loadStripe('pk_test_51PBXHTDISTrmdpg8Px0ZFxMz42kbz2rQg2uiwnRt6HgAhLJrGeIpKShrHuiRk1wQCHwyTQYZVZnvBZiRZ5uBwmo2001GnjOGoD'); // Replace with your actual publishable key

export default function RootLayout() {
  return (
    <Elements stripe={stripePromise}>
      <GluestackUIProvider mode="light">
        <UserProvider>
          <StatusBar style="dark"/>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: '#fff',
              },
              headerTintColor: '#000',
              headerTitleStyle: {
                fontWeight: 'normal',
              },
              headerShadowVisible: false,
              headerTitleAlign: 'center',
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="novel"
              options={{
                title: 'detail',
                headerShown: false,
                presentation: 'card',
                headerTitleAlign: 'center',
              }}
            />
            <Stack.Screen
              name="login"
              options={{
                headerShown: true,
              }}
            />
          </Stack>
        </UserProvider>
      </GluestackUIProvider>
    </Elements>
  );
}
