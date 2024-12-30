import { Text, View, TouchableOpacity, } from 'react-native';
import { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '@/app/_layout';
import { supabase } from '@/lib/supabase';
import {
  Drawer,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerCloseButton,
  DrawerBody,
  DrawerFooter,
} from "@/components/ui/drawer"

type Plan = {
  id: string;
  days: number;
  price: number;
  label: string;
};

interface SubscriptionPlanDrawerProps {
  subscriptionPlans: Plan[];
  selectedPlan: string | null;
  showDrawer: boolean;
  setShowDrawer: (show: boolean) => void;
  setSelectedPlan: (planId: string) => void;
  onSubscribe: (plan: Plan) => Promise<void>;
}

export default function SubscriptionPlanDrawer({
  subscriptionPlans,
  selectedPlan,
  showDrawer,
  setShowDrawer,
  setSelectedPlan,
  onSubscribe
}: SubscriptionPlanDrawerProps) {
  
    useEffect(() => {
        if (subscriptionPlans.length > 0 && !selectedPlan) {
        setSelectedPlan(subscriptionPlans[0].id);
        }
    }, [subscriptionPlans, selectedPlan, setSelectedPlan]);

  return (
    <>
      {/* 订阅计划 */}
      <View className="p-4 flex-row flex-wrap justify-between gap-3">
        {subscriptionPlans.map((plan) => (
          <TouchableOpacity
            key={plan.id}
            className={`bg-white rounded-xl w-[48%] overflow-hidden border ${
              selectedPlan === plan.id ? 'border-[#FF629A] border-2 bg-[#FFF5F8]' : 'border-[#f2f2f2]'
            }`}
            activeOpacity={0.9}
            onPress={() => {
                // 设置选中计划
                setSelectedPlan(plan.id);
            //   setShowDrawer(true);
            }}>
            <View className="p-4 items-center">
              <Text className="text-base text-center mb-2 text-[#FF629A]">Read all SVIP stories</Text>
              <Text className="text-2xl font-bold text-black mb-1">${plan.price}</Text>
              <Text className={`text-base px-3 py-1 rounded ${
                selectedPlan === plan.id 
                ? 'bg-[#FF629A] text-white' 
                : 'bg-[#FFE5EE] text-[#FF629A]'
              }`}>{plan.label}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

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
            <Elements stripe={stripePromise}>
              <View className="border border-gray-200 rounded-lg p-3">
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
                  if (plan) onSubscribe(plan);
                }}>
                <Text className="text-white text-center font-bold">SVIP Member Recharge</Text>
              </TouchableOpacity>
            </Elements>
          </DrawerBody>
          <DrawerFooter />
        </DrawerContent>
      </Drawer>
    </>
  );
} 