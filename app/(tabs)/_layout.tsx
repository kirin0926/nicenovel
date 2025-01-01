import { Tabs } from 'expo-router';
import { Image } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FF629A',// 选中颜色
        headerShadowVisible: false,// 隐藏顶部导航栏阴影
        headerTitleAlign: 'center',// 设置标题居中
        headerStyle: {
          height: 53, // 设置导航栏高度
        },
        tabBarStyle: {
          elevation: 0,  // Android 去除阴影
          shadowOpacity: 0, // iOS 去除阴影
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'home',
          tabBarIcon: ({ color, focused }) => (
            <Image 
              source={focused ? require('@/assets/images/tab/indexcheck.png') : require('@/assets/images/tab/index.png')}
              style={{ width: 26, height: 25, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookshelf"
        options={{
          title: 'bookshelf',
          tabBarIcon: ({ color, focused }) => (
            <Image 
              source={focused ? require('@/assets/images/tab/bookshelfcheck.png') : require('@/assets/images/tab/bookshelf.png')}
              style={{ width: 25, height: 25, tintColor: color }}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="mine"
        options={{
          title: 'mine',
          tabBarIcon: ({ color, focused }) => (
            <Image 
              source={focused ? require('@/assets/images/tab/minecheck.png') : require('@/assets/images/tab/mine.png')}
              style={{ width: 25, height: 25, tintColor: color }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
