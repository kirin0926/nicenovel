import React, { useEffect } from 'react';
import { Platform } from 'react-native';

export function GoogleAdsense() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Create script element
      const script = document.createElement('script');
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7897104007345492";
      script.async = true;
      script.crossOrigin = "anonymous";
      
      // Append to document head
      document.head.appendChild(script);
    }
  }, []);

  // Return null since this component doesn't render anything
  return null;
} 