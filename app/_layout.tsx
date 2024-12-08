import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from '@/lib/UserContext';

export default function RootLayout() {
  return (
    <UserProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#fff',
          },
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          contentStyle: {
            backgroundColor: '#fff',
          },
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
            title: '阅读',
            headerShown: true,
            presentation: 'card',
            headerTitleAlign: 'center',
          }}
        />
      </Stack>
    </UserProvider>
  );
}
