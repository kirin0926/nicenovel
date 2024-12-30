import { StyleSheet, Text, View, ScrollView, TouchableOpacity,Alert,Pressable} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement} from '@stripe/react-stripe-js';

import SubscriptionPlanDrawer from '@/components/pay/plan/SubscriptionPlanDrawer';
import { api } from '@/services/api';

export default function Subscription() {
  const [showDrawer, setShowDrawer] = useState(false)
  const [subscriptionPlans, setSubscriptionPlans] = useState<Array<{
    id: string;
    days: number;
    price: number;
    label: string;
  }>>([]);

  const stripe = useStripe();
  const elements = useElements();

  // 添加选中状态
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  // 获取订阅计划
  const fetchSubscriptionPlans = async () => {
    try {
      const { data:stripe_prices, error } = await api.getSubscriptionPlans();
      if (error) throw error;
      if (!stripe_prices) return;
      const formattedPlans = stripe_prices.map(plan => ({
        id: plan.price_id,
        days: plan.days,
        price: plan.unit_amount / 100,
        label: `${plan.nickname}`
      }));

      setSubscriptionPlans(formattedPlans);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
    }
  };

  // 订阅按钮
  const handleSubscribe = async (plan: typeof subscriptionPlans[0]) => {
    if (!stripe || !elements) {
      alert('Stripe has not been initialized');
      return;
    }

    try {
      // 1.创建支付意图
      const response = await fetch('http://localhost:3000/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: (await supabase.auth.getUser()).data.user?.email,
          priceId: plan.id,
        }),
      });

      const { data } = await response.json();
      console.log('clientSecret', data.clientSecret);
      console.log('subscriptionId', data.subscriptionId);

      // 2. 确认支付
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        }
      );
      console.log('paymentIntent', paymentIntent);
      if (stripeError) {
        console.log('Payment failed stripeError:', stripeError);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // 3. 更新订阅状态
        const { data: subscriptionData, error } = await supabase
          .from('subscriptions')
          .insert([
            {
              user_id: (await supabase.auth.getUser()).data.user?.id,
              email: (await supabase.auth.getUser()).data.user?.email,
              stripe_subscription_id: data.subscriptionId,
              stripe_customer_id: data.customerId,
              status: 'active',
              plan_id: plan.id,
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + plan.days * 24 * 60 * 60 * 1000).toISOString(),
            },
          ]);

        if (error) {
          console.error('Error updating subscription:', error);
          return;
        }
        console.log('subscriptionData', subscriptionData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <View className="bg-white p-5 items-center">
        <FontAwesome name="diamond" size={40} color="#FFD700" />
        <Text className="text-2xl font-bold mt-4 mb-2">SVIP membership</Text>
        <Text className="text-base text-gray-600">SVIP members can read all novels for free.</Text>
      </View>

      <View className="flex-row justify-around bg-white p-5 mt-3 hidden">
        <View className="items-center">
          <FontAwesome name="book" size={24} color="#007AFF" />
          <Text className="mt-2 text-gray-700">Read all SVIP stories</Text>
        </View>
        <View className="items-center">
          <FontAwesome name="ban" size={24} color="#007AFF" />
          <Text className="mt-2 text-gray-700">No ads</Text>
        </View>
        <View className="items-center">
          <FontAwesome name="download" size={24} color="#007AFF" />
          <Text className="mt-2 text-gray-700">Read All Stories</Text>
        </View>
      </View>

      <SubscriptionPlanDrawer
        subscriptionPlans={subscriptionPlans}
        selectedPlan={selectedPlan}
        showDrawer={showDrawer}
        setShowDrawer={setShowDrawer}
        setSelectedPlan={setSelectedPlan}
        onSubscribe={handleSubscribe}
      />
      <Pressable 
        className="bg-[#FF629A] p-4 rounded-lg mx-4 my-5"
        onPress={() => setShowDrawer(true)}
      >
        <Text className="text-white text-center text-base font-bold">
          Subscribe to Continue Reading
        </Text>
      </Pressable>

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
