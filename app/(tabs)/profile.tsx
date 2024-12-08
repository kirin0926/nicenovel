import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function Profile() {
  const isLoggedIn = false;
  
  const user = {
    id: '12345678',
    nickname: '书友123456',
    avatar: 'https://picsum.photos/200',
    isVip: false,
  };

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.loginButtonText}>登录/注册</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.nickname}>{user.nickname}</Text>
          <Text style={styles.userId}>ID: {user.id}</Text>
          <View style={styles.vipBadge}>
            <Text style={[styles.vipText, !user.isVip && styles.nonVipText]}>
              {user.isVip ? 'VIP会员' : '普通用户'}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.vipButton}
        onPress={() => router.push('/subscription')}>
        <FontAwesome name="diamond" size={24} color="white" style={styles.vipIcon} />
        <Text style={styles.vipButtonText}>开通会员</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: 'white',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  userInfo: {
    marginLeft: 20,
  },
  nickname: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userId: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vipText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#FFD700',
  },
  nonVipText: {
    color: '#999',
  },
  vipButton: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  vipIcon: {
    marginRight: 8,
  },
  vipButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 