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
} from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
// import { makeRedirectUri } from 'expo-auth-session';
// import * as AppleAuthentication from 'expo-auth-session/providers/apple';

// 确保在web浏览器完成身份验证后正确关闭
WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  // useAuthRequest 钩子用于创建 Google OAuth 请求
  // request: OAuth 请求对象
  // response: 授权响应结果
  // promptAsync: 触发授权流程的函数
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "643989459317-9db0hp4bkr8i0ap0pfa4se9ah599i8ea.apps.googleusercontent.com",
    iosClientId: "643989459317-9db0hp4bkr8i0ap0pfa4se9ah599i8ea.apps.googleusercontent.com",
    webClientId: "643989459317-8m42ib4asihivfk4k73gk32l874kjna6.apps.googleusercontent.com",
  });

  // useEffect 用于监听授权响应
  // 当 response 发生变化时，检查是否授权成功
  // 如果成功，可以获取到 access token 进行后续操作
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      const token = authentication?.idToken as string;
      console.log('response', response);
      console.log('token', token);
      signInWithSupabase(token);
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
        console.error('Error signing in with Google:', error);
        return;
      }
      if (data.user) {
        console.log('User logged in:', data.user);
        router.back();
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
    }
  };

  // 处理谷歌登录按钮点击
  // promptAsync() 会打开浏览器进行 OAuth 授权
  // 返回的 result 包含授权结果
  const handleGoogleLogin = async () => {
    const result = await promptAsync();
    if (result.type === 'success') {
      console.log('Google login success');
    }
  };

  const handleAppleLogin = () => {
    // TODO: 实现苹果登录逻辑
    console.log('苹果登录');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.content}>
        <Text style={styles.subtitle}>请选择登录方式</Text>
        
        <TouchableOpacity 
          style={[styles.loginButton, styles.googleButton]}
          onPress={handleGoogleLogin}
        >
          <FontAwesome name="google" size={20} color="white" />
          <Text style={styles.loginButtonText}>通过谷歌登录</Text>
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <TouchableOpacity 
            style={[styles.loginButton, styles.appleButton]}
            onPress={handleAppleLogin}
          >
            <FontAwesome name="apple" size={24} color="white" />
            <Text style={styles.loginButtonText}>通过苹果登录</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.closeButtonText}>暂不登录</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  googleButton: {
    backgroundColor: '#DB4437',
  },
  appleButton: {
    backgroundColor: '#000',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
}); 