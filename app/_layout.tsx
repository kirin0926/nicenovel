import { Stack } from "expo-router";
import { StatusBar } from 'expo-status-bar';
import { UserProvider } from '@/lib/UserContext';
// import { screenOptions } from '@/styles/navigation.ts';

// 引入 analytics 服务
import { initializeAnalytics } from '@/services/analytics';
// 在应用启动时调用
initializeAnalytics();

export default function RootLayout() {
  return (
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
              headerShown: false,// 隐藏顶部导航栏
            }}
          />
          <Stack.Screen
            name="novel"
            options={{
              title: 'detail',
              headerShown: false,// 隐藏顶部导航栏
              presentation: 'card',// 设置为card，可以设置背景颜色
              headerTitleAlign: 'center',// 设置标题居中
            }}
          />
          <Stack.Screen
            name="login"
            options={{
              headerShown: true,// 隐藏顶部导航栏
            }}
          />
        </Stack>
      </UserProvider>
  );
}
