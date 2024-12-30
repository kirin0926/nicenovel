// Google OAuth 登录流程说明：
// 1. 用户点击"通过谷歌登录"按钮
// 2. 调用 handleGoogleLogin 函数
// 3. promptAsync() 会打开一个 web 浏览器窗口，让用户进行 Google 账号授权
// 4. 用户授权后，Google 会将结果返回给应用
// 5. useEffect 监听 response 变化，当获取到成功响应时处理登录结果
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  Image
} from 'react-native';
import { router } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
// import * as AppleAuthentication from 'expo-auth-session/providers/apple';
import { Analytics } from '@/services/analytics';
import { getOrCreateUUID } from '@/services/uuid';

// 确保在web浏览器完成身份验证后正确关闭
WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  // useAuthRequest 钩子用于建 Google OAuth 请求 
  // useIdTokenAuthRequest 用于获取 id_token
  // request: OAuth 请求对象
  // response: 授权响应结果
  // promptAsync: 触发授权流程的函数
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: "643989459317-9db0hp4bkr8i0ap0pfa4se9ah599i8ea.apps.googleusercontent.com",
    iosClientId: "643989459317-9db0hp4bkr8i0ap0pfa4se9ah599i8ea.apps.googleusercontent.com",
    webClientId: "643989459317-8m42ib4asihivfk4k73gk32l874kjna6.apps.googleusercontent.com",
  });

  // useEffect 用于监听授权响应
  // 当 response 发生变化时，检查是否授权成功
  // 如果成功，可以获取到 access token 进行后续操作
  useEffect(() => {
    if (response?.type === 'success') {
      // console.log('response', response);
      // const token = response.authentication?.accessToken as string;
      // const idToken = response.authentication?.idToken as string;
      const idToken = response.params?.id_token as string;
      signInWithSupabase(idToken);
    }
  }, [response]);

  // 使用 Supabase 进行 Google 登录
  const signInWithSupabase = async (token: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: token,
      });
      if (error) {
        if (error.message.includes('Refresh Token Not Found')) {
          // 清除本地存储的认证信息
          await supabase.auth.signOut();
          // 重新引导用户登录
          router.replace('/login');
        }
        console.error('Error signing in with Google:', error);
        return;
      }
      
      // 检查数据库表中用户ID是否已存在
      let { data: existingUser, error: userError } = await supabase
        .from('user')
        .select('user_id')
        .eq('user_id', data.user.id)
        .single();
        console.log('existingUser', existingUser);
        if (existingUser) {
          console.log('User already exists');
          //保存uuid到本地
          return;
        }

      // 获取本地UUID
      const localUUID = await getOrCreateUUID();

      // 准备要更新的用户数据
      const userData = {
        user_id: data.user.id,
        email: data.user.email,
        full_name: data.user.user_metadata.full_name,
        avatar_url: data.user.user_metadata.avatar_url,
        provider: 'google',
      };

      // 更新user表
      const { data: upsertData, error: upsertError } = await supabase
      .from('user')// 更新user表
      .update(userData)// 更新数据
      .eq('uuid', localUUID)// 条件
      .select()

      if (upsertError) {
        console.error('Error updating user table:', upsertError);
      }
      console.log('Supabase auth success: ok', upsertData);
      console.log('Supabase auth success: ok', data);
      router.back();
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  // 处理谷歌登录按钮点击
  // promptAsync() 会打开浏览器进行 OAuth 授权
  // 返回的 result 包含授权结果
  const handleGoogleLogin = async () => {
    try {
      const result = await promptAsync();
      if (result.type === 'success') {
        console.log('Google login success');
        Analytics.trackLogin('google', true);// 跟踪登录成功
      } else {
        Analytics.trackLogin('google', false, 'User cancelled or login failed');// 跟踪登录失败
      }
    } catch (error) {
      console.error('Google login error:', error);
      Analytics.trackLogin('google', false, error instanceof Error ? error.message : 'Unknown error');// 跟踪登录失败
    }
  };

  // 处理苹果登录按钮点击
  const handleAppleLogin = () => {
    // TODO: 实现苹果登录逻辑
    console.log('苹果登录');
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 p-5 justify-center">
        {/* <View className="w-64 h-64 self-center mb-8">
          <Image 
            source={require('../assets/images/icon.png')}
            className="w-full h-full"
            resizeMode="contain"
          />
        </View> */}
        <Text className="text-xl font-bold text-center mb-10">chiose login way</Text>
        
        <TouchableOpacity 
          className="flex-row items-center justify-center p-4 rounded-lg mb-4 bg-[#FF629A]"
          onPress={handleGoogleLogin}
        >
          <FontAwesome name="google" size={20} color="white" />
          <Text className="text-white text-base font-bold ml-3">Google Login</Text>
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <TouchableOpacity 
            className="flex-row items-center justify-center p-4 rounded-lg mb-4 bg-black"
            onPress={handleAppleLogin}
          >
            <FontAwesome name="apple" size={24} color="white" />
            <Text className="text-white text-base font-bold ml-3">Apple Login</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          className="mt-5 items-center"
          onPress={() => router.back()}
        >
          <Text className="text-base text-gray-600">not now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
} 