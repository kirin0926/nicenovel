import React, { useEffect } from 'react';
import { Platform, View } from 'react-native';

interface GoogleAdProps {
  slot: string;
  style?: object;
}

export function GoogleAd({ slot, style }: GoogleAdProps) {
  useEffect(() => {
    if (Platform.OS === 'web') {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, []);

  if (Platform.OS !== 'web') {
    return null;
  }

  return (
    <View style={style}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
        data-ad-client="ca-pub-7897104007345492"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </View>
  );
} 