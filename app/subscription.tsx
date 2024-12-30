import { StyleSheet, Text, View, ScrollView, TouchableOpacity,Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { useStripe, useElements, CardElement,Elements,PaymentElement,
  CardNumberElement,
  CardExpiryElement, 
  CardCvcElement  } from '@stripe/react-stripe-js';
// Initialize Stripe
import { stripePromise } from '@/app/_layout';

import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  DrawerFooter,
} from "@/components/ui/drawer"

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

  useEffect(() => {
    fetchSubscriptionPlans();
  }, []);

  // 获取订阅计划
  const fetchSubscriptionPlans = async () => {
    try {
      
      let { data: stripe_prices, error } = await supabase
      .from('stripe_prices')
      .select('*')
              
      if (error) throw error;
      if (!stripe_prices) return;
      // console.log('stripe_prices', stripe_prices);
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
        Alert.alert(`Payment failed: ${stripeError.message}`);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // 3. 更新订阅状态
        const { data:subscriptionData, error } = await supabase
          .from('subscriptions')
          .insert([
            {
              user_id: (await supabase.auth.getUser()).data.user?.id,// 用户ID
              email: (await supabase.auth.getUser()).data.user?.email,// 用户邮箱
              plan_id: plan.id,// 订阅计划ID
              status: 'active',// 订阅状态
              start_date: new Date().toISOString(),// 开始日期
              end_date: new Date(Date.now() + plan.days * 24 * 60 * 60 * 1000).toISOString(),// 结束日期
              payment_intent_id: paymentIntent.id,// 支付意图ID
            },
          ]);

        if (error) {
          console.error('Error updating subscription:', error);
          Alert.alert('Payment successful but failed to update subscription. Please contact support.');
          return;
        }

        Alert.alert('Successfully subscribed!');
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('An error occurred during payment. Please try again.');
    }
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
          <Text style={styles.benefitText}>No ads</Text>
        </View>
        <View style={styles.benefitItem}>
          <FontAwesome name="download" size={24} color="#007AFF" />
          <Text style={styles.benefitText}>Read All Stories</Text>
        </View>
      </View>

      <View style={styles.plansContainer}>
        {subscriptionPlans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            style={styles.planCard}
            activeOpacity={0.9}
            onPress={() => setShowDrawer(true)}>
              {/* handleSubscribe(plan) */}
            <Text style={styles.planLabel}>{plan.label}</Text>
            <Text style={styles.planPrice}>${plan.price}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Drawer 
        isOpen={showDrawer} 
        onClose={() => setShowDrawer(false)} 
        size="md"
        anchor="bottom">
        <DrawerBackdrop />
        <DrawerContent>
          {/* 关闭按钮 */}
          <DrawerHeader>
            <DrawerCloseButton >
              <View>
                <Text>Cancel</Text>
              </View>
            </DrawerCloseButton>
          </DrawerHeader>
          {/* 支付方式 */}
          <DrawerBody>
            <Elements stripe={stripePromise}>
              
              <View style={[styles.cardElementWrapper]}>
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
            </Elements>
          </DrawerBody>
          
          {/* <DrawerBody /> */}
            
          <DrawerFooter />
        </DrawerContent>
      </Drawer>

      

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
  cardElementWrapper: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
  },
}); 
