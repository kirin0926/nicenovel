import * as amplitude from '@amplitude/analytics-react-native';

// 添加初始化函数
export const initializeAnalytics = () => {
  amplitude.init('5994c6ed6cabcba6f02a3d17ecb39d31');
};

export const Analytics = {
  trackPageView: (pageName: string, properties = {}) => {
    amplitude.track('Page View', {
      pageName,
      ...properties
    });
  },
  
  trackEvent: (eventName: string, properties = {}) => {
    amplitude.track(eventName, properties);
  },
  
  trackNovelClick: (novelId: string, novelTitle: string, novelAuthor: string) => {
    amplitude.track('Novel Click', {
      novelId,
      novelTitle,
      novelAuthor,
      timestamp: new Date().toISOString()
    });
  },
  
  setUserProperties: (properties: Record<string, any>) => {
    const identify = new amplitude.Identify();
    Object.entries(properties).forEach(([key, value]) => {
      identify.set(key, value);
    });
    amplitude.identify(identify);
  },
  
  trackLogin: (provider: 'google' | 'apple', success: boolean, error?: string) => {
    amplitude.track('User Login', {
      provider,
      success,
      error,
      timestamp: new Date().toISOString()
    });
  },
}; 