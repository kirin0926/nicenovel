import { Text, View, TouchableOpacity, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '@/lib/supabase';
import { api } from '@/services/api';
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  DrawerFooter,
} from "@/components/ui/drawer"
import { useRouter } from 'expo-router';

type Plan = {
  id: string;
  days: number;
  price: number;
};

interface SubscriptionPlanDrawerProps {
  onSubscriptionSuccess?: () => void;
}

export default function SubscriptionPlanDrawer({ onSubscriptionSuccess }: SubscriptionPlanDrawerProps) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<Plan[]>([]);
  
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  useEffect(() => {
    if (subscriptionPlans.length > 0 && !selectedPlan) {
      setSelectedPlan(subscriptionPlans[0].id);
    }
  }, [subscriptionPlans, selectedPlan]);

  // 获取订阅计划
  const fetchSubscriptionPlans = async () => {
    try {
      const { data:stripe_prices, error } = await api.getSubscriptionPlans();
      if (error) throw error;
      if (!stripe_prices) return;
      const formattedPlans = stripe_prices.map(plan => ({
        id: plan.price_id,
        days: plan.interval_count,
        price: plan.unit_amount / 100,
      }));
      // console.log('formattedPlans:', formattedPlans);
      setSubscriptionPlans(formattedPlans);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
    }
  };

  // 订阅按钮
  const handleSubscribe = async (plan: Plan) => {
    console.log('plan:', plan);
    if (!stripe || !elements) {
      alert('Stripe has not been initialized');
      console.log('stripe:', stripe);
      console.log('elements:', elements);
      return;
    }
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
        console.error('CardElement has not been found.');
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
      console.log('data:', data);
      // 2. 确认支付
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        }
      );
      console.log('paymentIntent:', paymentIntent);
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
              current_period_start: new Date().toISOString(), // 转换为 ISO 字符串格式
              current_period_end: new Date(Date.now() + (plan.days * 24 * 60 * 60 * 1000)).toISOString(), // 转换为 ISO 字符串格式
            },
          ]);

        if (error) {
          console.error('Error updating subscription:', error);
          return;
        }
        
        if (!error) {
          onSubscriptionSuccess?.();
          setShowDrawer(false);
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePressSubscribe = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      // Redirect to login if user is not authenticated
      router.push('/login');
      return;
    }

    setShowDrawer(true);
  };

  return (
    <>
      {/* 订阅计划 */}
      <View className="p-4 flex-row flex-wrap justify-between gap-3">
        {subscriptionPlans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            className={`bg-white rounded-xl w-[48%] overflow-hidden border ${
              selectedPlan === plan.id ? 'border-[#FF629A] border-1 bg-[#FFF5F8]' : 'border-[#f2f2f2]'
            }`}
            activeOpacity={0.9}
            onPress={() => setSelectedPlan(plan.id)}>
            <View className="p-4 items-center">
              <Text className="text-base text-center mb-2 text-[#FF629A]">Read all SVIP stories</Text>
              <Text className="text-2xl font-bold text-black mb-1">${plan.price}</Text>
              <Text className={`text-base px-3 py-1 rounded ${
                selectedPlan === plan.id 
                ? 'bg-[#FF629A] text-white' 
                : 'bg-[#FFE5EE] text-[#FF629A]'
              }`}>{plan.days} days</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* 添加订阅按钮 */}
      <Pressable 
        className="bg-[#FF629A] p-4 rounded-lg mx-4 my-5"
        onPress={handlePressSubscribe}
      >
        <Text className="text-white text-center text-base font-bold">
          SVIP Member Recharge
        </Text>
      </Pressable>

      {/* 弹出框 */}
      <Drawer 
        isOpen={showDrawer} 
        onClose={() => setShowDrawer(false)} 
        size="md"
        anchor="bottom">
        <DrawerBackdrop />
        <DrawerContent>
          <DrawerHeader>
            <DrawerCloseButton>
              <View>
                <Text>Cancel</Text>
              </View>
            </DrawerCloseButton>
          </DrawerHeader>
          <DrawerBody>
            <View className="border border-gray-200 rounded-lg p-3">
              <Text className="text-base font-bold mb-2">Payment Method</Text>
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </View>
            <TouchableOpacity 
              className="bg-red-500 mt-6 p-4 rounded-md" 
              onPress={() => {
                const plan = subscriptionPlans.find(p => p.id === selectedPlan);
                if (plan) handleSubscribe(plan);
              }}>
              <Text className="text-white text-center font-bold">SVIP Member Recharge</Text>
            </TouchableOpacity>
          </DrawerBody>
          <DrawerFooter />
        </DrawerContent>
      </Drawer>
    </>
  );
} 