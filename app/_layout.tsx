import { Stack } from "expo-router";
// import { StatusBar } from 'expo-status-bar';
import { UserProvider } from '@/lib/UserContext';

export default function RootLayout() {
  return (
    <UserProvider>
      {/* <StatusBar style="dark" /> */}
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
            title: 'detail',
            headerShown: false,
            presentation: 'card',
            headerTitleAlign: 'center',
          }}
        />
      </Stack>
    </UserProvider>
  );
}
