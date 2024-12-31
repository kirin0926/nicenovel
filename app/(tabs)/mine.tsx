import { Text, View, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useUser } from '@/lib/UserContext';
import { Analytics } from '@/services/analytics';
import { api } from '@/services/api';
import { useState, useEffect } from 'react';

export default function Profile() {
  const { user, signOut } = useUser();
  const [isVip, setIsVip] = useState(false);
  const [expiryDate, setExpiryDate] = useState<string | null>(null);

  useEffect(() => {
    async function checkVipStatus() {
      if (!user) return;
      const { data: subscription } = await api.checkSubscriptionStatus(user.id);
      setIsVip(!!subscription);
      // console.log('subscription:', subscription);
      if (subscription?.current_period_end) {
        setExpiryDate(new Date(subscription.current_period_end).toLocaleDateString());
      }
    }

    checkVipStatus();
  }, [user]);

  const isLoggedIn = !!user;

  if (!isLoggedIn) {
    return (
      <View className="flex-1 bg-[#f5f5f5]">
        <View className="flex-1 justify-center items-center p-2.5">
          <TouchableOpacity
            className="bg-[#FF629A] px-10 py-4 rounded-lg mt-5"
            onPress={() => {
              Analytics.trackEvent('Login Button Click', {
                source: 'profile_page'
              });
              router.push('/login');
            }}>
            <Text className="text-white text-sm font-bold">Login/Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const userData = {
    id: user.id,
    nickname: user.user_metadata?.full_name || '用户' + user.id.slice(0, 6),
    avatar: user.user_metadata?.avatar_url || 'https://picsum.photos/200',
    isVip: isVip,
    expiryDate: expiryDate,
  };

  return (
    <View className="flex-1 bg-[#f5f5f5]">
      <View className="bg-white p-4 flex-row items-center">
        <Image source={{ uri: userData.avatar }} className="w-[60px] h-[60px] rounded-[40px]" />
        <View className="ml-4">
          <Text className="text-base font-bold mb-1">{userData.nickname}</Text>
          <Text className="text-sm text-[#666] mb-1" numberOfLines={1}>ID: {userData.id}</Text>
          <View className="flex-row items-center">
            <Text className={`ml-1 text-sm ${userData.isVip ? 'text-[#FF629A]' : 'text-[#999]'}`}>
              {userData.isVip ? 'SVIP' : 'normal'}
            </Text>
            {userData.isVip && userData.expiryDate && (
              <Text className="ml-2 text-xs text-[#FF629A]">
                End time: {userData.expiryDate}
              </Text>
            )}
          </View>
        </View>
      </View>

      <TouchableOpacity
        className="bg-[#FF629A] mx-5 my-5 p-4 rounded-lg flex-row justify-center items-center"
        onPress={() => router.push('/subscription')}>
        <Text className="text-white text-sm font-bold">Membership</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-[#f5f5f5] mx-5 mt-0 p-4 rounded-lg border border-[#ddd] justify-center items-center"
        onPress={signOut}>
        <Text className="text-[#666] text-sm font-bold">logout</Text>
      </TouchableOpacity>
    </View>
  );
} 