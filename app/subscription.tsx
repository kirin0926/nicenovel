import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const subscriptionPlans = [
  { id: 1, days: 3, price: 9.9, label: '3day' },
  { id: 2, days: 7, price: 19.99, label: '7day' },
  { id: 3, days: 30, price: 29.99, label: '30day' },
  { id: 4, days: 90, price: 69.99, label: '90day' },
  { id: 5, days: 365, price: 169.99, label: '365day' },
];

export default function Subscription() {
  const handleSubscribe = (plan: typeof subscriptionPlans[0]) => {
    console.log('handleSubscribe', plan);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <FontAwesome name="diamond" size={40} color="#FFD700" />
        <Text style={styles.title}>SVIP membership</Text>
        <Text style={styles.subtitle}>SVIP members can read all novels for free.</Text>
      </View>

      <View style={styles.benefitsContainer}>
        <View style={styles.benefitItem}>
          <FontAwesome name="book" size={24} color="#007AFF" />
          <Text style={styles.benefitText}>Read all SVIP stories</Text>
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
            activeOpacity={0.9}
            onPress={() => handleSubscribe(plan)}>
            <Text style={styles.planLabel}>{plan.label}</Text>
            <Text style={styles.planPrice}>${plan.price}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.noticeContainer}>
        <Text style={styles.noticeTitle}>Tips：</Text>
        <Text style={styles.noticeText}>
        1.When you recharge SVIP,the system will automaticallyconvert the currency of your region for payment;{'\n'}
        2.SVIP is a virtual commodity.Once it's recharged,it's non-refundable;{'\n'}
        3.After recharging SVIP,you can read all the short stories inthe SVIP section during the validity period;{'\n'}
        4.If the account is not available for along time afterrecharging SVIP,please click here to contact us. We willfollow up and help you;{'\n'}
        5.Working time :Monday to Friday, 10AM - 10PM
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
    display: 'none',
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
    width: '48%',
  },
  planLabel: {
    fontSize: 18,
    fontWeight: '500',
  },
  planPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF629A',
  },
  noticeContainer: {
    padding: 16,
    backgroundColor: 'white',
    margin: 16,
    marginTop:0,
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