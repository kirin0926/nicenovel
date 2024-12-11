import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useUser } from '@/lib/UserContext';

export default function Profile() {
  const { user, signOut } = useUser();
  const isLoggedIn = !!user;

  if (!isLoggedIn) {
    return (
      <View style={styles.container}>
        <View style={styles.loginContainer}>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/login')}>
            <Text style={styles.loginButtonText}>Login/Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const userData = {
    id: user.id,
    nickname: user.user_metadata?.full_name || '用户' + user.id.slice(0, 6),
    avatar: user.user_metadata?.avatar_url || 'https://picsum.photos/200',
    isVip: user.user_metadata?.isVip || false,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: userData.avatar }} style={styles.avatar} />
        <View style={styles.userInfo}>
          <Text style={styles.nickname}>{userData.nickname}</Text>
          <Text style={styles.userId} numberOfLines={1}>ID: {userData.id}</Text>
          <View style={styles.vipBadge}>
            <Text style={[styles.vipText, !userData.isVip && styles.nonVipText]}>
              {userData.isVip ? 'VIP' : 'nomal'}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.vipButton}
        onPress={() => router.push('/subscription')}>
        {/* <FontAwesome name="diamond" size={24} color="white" style={styles.vipIcon} /> */}
        <Text style={styles.vipButtonText}>Membership</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={signOut}>
        <Text style={styles.logoutButtonText}>logout</Text>
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
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 40,
  },
  userInfo: {
    marginLeft: 15,
  },
  nickname: {
    fontSize: 16,
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
    display: 'none',
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
    padding: 10,
  },
  loginButton: {
    backgroundColor: '#FF629A',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#f5f5f5',
    margin: 20,
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 