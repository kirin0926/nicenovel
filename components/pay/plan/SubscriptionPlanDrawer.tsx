import { Text, View, TouchableOpacity, Pressable } from 'react-native';
import { useState, useEffect, useRef, useCallback } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { supabase } from '@/lib/supabase';
import { api, backendapi } from '@/services/api';
import { useToast, Toast, ToastTitle, ToastDescription } from '@/components/ui/toast';

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
import useStore from '@/store/useStore';

type Plan = {
  id: string;
  days: number;
  price: number;
};

interface SubscriptionPlanDrawerProps {
  onSubscriptionSuccess?: () => void;// 订阅成功回调
}

export default function SubscriptionPlanDrawer({ onSubscriptionSuccess }: SubscriptionPlanDrawerProps) {
  const [showDrawer, setShowDrawer] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<Plan[]>([]);
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const setSubscription = useStore((state) => state.setSubscription);
  const cardElementRef = useRef<any>(null);
  const [isThrottled, setIsThrottled] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const toast = useToast();

  useEffect(() => {
    // 获取订阅计划
    fetchSubscriptionPlans();
  }, []);

  useEffect(() => {
    // 如果订阅计划不为空，且没有选择计划，则选择第一个计划
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
      setSubscriptionPlans(formattedPlans);
    } catch (error) {
      console.error('Error fetching subscription plans:', error);
    }
  };

  // 订阅按钮
  const handleSubscribe = async (plan: Plan) => {
    if (!stripe || !elements) {
      console.log('Stripe has not been initialized');
      return;
    }

    if (!cardElementRef.current) {
      console.error('CardElement has not been initialized.');
      return;
    }

    try {
      // 1.创建支付意图 - Using backendapi instead of direct fetch
      const { data, error: subscriptionError } = await backendapi.createSubscription(plan);
      
      if (subscriptionError) {
        console.error('Subscription creation failed:', subscriptionError);
        // 检查是否是已订阅的错误
        if (subscriptionError.code === 'PGRST116') {
          toast.show({
            placement: "top",
            render:({id})=>{
              return (<Toast id={id} className="bg-green-500 text-white">
                <ToastTitle>Subscription successful</ToastTitle>
                <ToastDescription>You already have an active subscription</ToastDescription>
              </Toast>)
            }
          });
        } else {
          toast.show({
            placement: "top",
            render:({id})=>{
              return (<Toast id={id} className="bg-red-500 text-white">
                <ToastTitle>Subscription failed</ToastTitle>
                <ToastDescription>Subscription creation failed, please try again later</ToastDescription>
              </Toast>)
            }
          });
        }
        return;
      }

      // 2. 确认支付
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: cardElementRef.current,
          },
        }
      );
      // console.log('paymentIntent:', paymentIntent);
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
              current_period_end: new Date(Date.now() + (plan.days * 24 * 60 * 60 * 1000)).toISOString(),
            },
          ]);

        if (error) {
          console.error('Error updating subscription:', error);
          return;
        }
        
        if (!error) {
          // 更新 Zustand store 中的订阅状态
          setSubscription({
            status: 'active',
            expiryDate: new Date(Date.now() + (plan.days * 24 * 60 * 60 * 1000)).toISOString(),
          });
          
          onSubscriptionSuccess?.();// 订阅成功回调
          setShowDrawer(false);// 关闭弹出框
          toast.show({
            placement: 'top',
            render:({id})=>{
              return (<Toast id={id} className="bg-green-500 text-white">
                <ToastTitle>Subscription successful</ToastTitle>
                <ToastDescription>You are now a SVIP member</ToastDescription>
              </Toast>)
            }
          });
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handlePressSubscribe = useCallback(async () => {
    if (isThrottled) return;
    
    setIsThrottled(true);
    setTimeout(() => setIsThrottled(false), 2000); // 2秒内不能重复点击

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      router.push('/login');
      return;
    }

    setShowDrawer(true);
  }, [isThrottled, router]);

  const handleSubscribeClick = useCallback(async () => {
    if (isSubscribing) return;
    
    setIsSubscribing(true);
    const plan = subscriptionPlans.find(p => p.id === selectedPlan);
    if (plan) {
      await handleSubscribe(plan);
    }
    setTimeout(() => setIsSubscribing(false), 2000);
  }, [isSubscribing, selectedPlan, subscriptionPlans, handleSubscribe]);

  return (
    <>
      {/* 订阅计划 */}
      <View className="flex-row flex-wrap justify-between gap-3 p-2">
        {subscriptionPlans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            className={`bg-white rounded-xl w-[48%] overflow-hidden border ${
              selectedPlan === plan.id ? 'border-[#FF629A] border-1 bg-[#FFF5F8]' : 'border-[#f2f2f2]'
            }`}
            activeOpacity={0.9}
            onPress={() => setSelectedPlan(plan.id)}>
            <View className="p-4 items-center">
              <Text className="text-base text-center text-[#FF629A]">Read all SVIP stories</Text>
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
        className={`bg-[#FF629A] p-4 rounded-lg mx-4 my-5 ${isThrottled ? 'opacity-50' : ''}`}
        onPress={handlePressSubscribe}
        disabled={isThrottled}
      >
        <Text className="text-white text-center text-base font-bold">
          {isThrottled ? 'Processing...' : 'SVIP Member Recharge'}
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
          <DrawerHeader className="flex flex-row justify-end">
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
                onReady={(element) => cardElementRef.current = element}
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
              className={`bg-red-500 mt-6 p-4 rounded-md ${isSubscribing ? 'opacity-50' : ''}`}
              onPress={handleSubscribeClick}
              disabled={isSubscribing}
            >
              <Text className="text-white text-center font-bold">
                {isSubscribing ? 'Processing...' : 'SVIP Member Recharge'}
              </Text>
            </TouchableOpacity>
          </DrawerBody>
          <DrawerFooter />
        </DrawerContent>
      </Drawer>
    </>
  );
} 