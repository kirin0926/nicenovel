import { Stack } from "expo-router";
import "@/global.css";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import { StatusBar } from 'expo-status-bar';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { stripeKey } from '@/services/api';
import { initializeAnalytics } from '@/services/analytics';

initializeAnalytics();
export const stripePromise = loadStripe(stripeKey!);

export default function RootLayout() {
  return (
    <Elements stripe={stripePromise}>
      <GluestackUIProvider mode="light">
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
            // contentStyle: {
            //   flex: 1,
            // },
          }}>
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
      </GluestackUIProvider>
    </Elements>
  );
}
