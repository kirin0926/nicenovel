import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const subscriptionPlans = [
  { id: 1, days: 3, price: 9.9, label: '3天体验' },
  { id: 2, days: 7, price: 19.99, label: '7天会员' },
  { id: 3, days: 30, price: 29.99, label: '30天会员' },
  { id: 4, days: 90, price: 69.99, label: '90天会员' },
  { id: 5, days: 365, price: 169.99, label: '365天会员' },
];

export default function Subscription() {
  const handleSubscribe = (plan: typeof subscriptionPlans[0]) => {
    // Implement subscription logic here
    console.log('Subscribe to plan:', plan);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="diamond" size={40} color="#FFD700" />
        <Text style={styles.title}>VIP会员特权</Text>
        <Text style={styles.subtitle}>解锁全部小说，尊享无广告阅读体验</Text>
      </View>

      <View style={styles.benefitsContainer}>
        <View style={styles.benefitItem}>
          <FontAwesome name="book" size={24} color="#007AFF" />
          <Text style={styles.benefitText}>海量小说免费读</Text>
        </View>
        <View style={styles.benefitItem}>
          <FontAwesome name="ban" size={24} color="#007AFF" />
          <Text style={styles.benefitText}>完全无广告</Text>
        </View>
        <View style={styles.benefitItem}>
          <FontAwesome name="download" size={24} color="#007AFF" />
          <Text style={styles.benefitText}>离线下载</Text>
        </View>
      </View>

      <View style={styles.plansContainer}>
        {subscriptionPlans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={styles.planCard}
            onPress={() => handleSubscribe(plan)}>
            <Text style={styles.planLabel}>{plan.label}</Text>
            <Text style={styles.planPrice}>¥{plan.price}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.noticeContainer}>
        <Text style={styles.noticeTitle}>订阅须知：</Text>
        <Text style={styles.noticeText}>
          1. 订阅会员后立即生效，可享受会员特权{'\n'}
          2. 会员有效期内可畅读全站小说内容{'\n'}
          3. 付款成功后不支持退款{'\n'}
          4. 会员到期后自动转为普通用户{'\n'}
          5. 如有问题请联系客服
        </Text>
      </View>
    </ScrollView>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  benefitsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    padding: 20,
    marginTop: 12,
  },
  benefitItem: {
    alignItems: 'center',
  },
  benefitText: {
    marginTop: 8,
    color: '#333',
  },
  plansContainer: {
    padding: 16,
  },
  planCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  planLabel: {
    fontSize: 18,
    fontWeight: '500',
  },
  planPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  noticeContainer: {
    padding: 16,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  noticeText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
}); 