import { Text, View, Image, TouchableOpacity } from 'react-native';
import { useEffect } from 'react';
import { router } from 'expo-router';
import { Analytics } from '@/services/analytics';
import useStore from '@/store/useStore';

export default function Profile() {
  const user = useStore((state) => state.user);
  const subscription = useStore((state) => state.subscription);
  const logout = useStore((state) => state.logout);
  const checkSubscriptionStatus = useStore((state) => state.checkSubscriptionStatus);

  useEffect(() => {
    console.log('user:', user);
    if (user) {
      checkSubscriptionStatus(user.id);
    }
  }, [user]);

  if (!user) {
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
    isVip: subscription?.status === 'active',
    expiryDate: subscription?.expiryDate,
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
                End time: {new Date(userData.expiryDate).toLocaleDateString()}
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
        onPress={logout}>
        <Text className="text-[#666] text-sm font-bold">logout</Text>
      </TouchableOpacity>
    </View>
  );
}