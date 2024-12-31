import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import SubscriptionPlanDrawer from '@/components/pay/plan/SubscriptionPlanDrawer';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/app/_layout';

export default function Subscription() {
  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="bg-white p-5 items-center">
        <FontAwesome name="diamond" size={40} color="#FFD700" />
        <Text className="text-2xl font-bold mt-4 mb-2">SVIP membership</Text>
        <Text className="text-base text-gray-600">SVIP members can read all novels for free.</Text>
      </View>

      {/* <Elements stripe={stripePromise}>
      </Elements> */}

      <SubscriptionPlanDrawer />

      <View className="p-4 bg-white mx-4 rounded-lg">
        <Text className="text-base font-bold mb-2">Tips：</Text>
        <Text className="text-sm text-gray-600 leading-5">
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
