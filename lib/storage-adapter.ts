import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

class WebStorage {
  private getLocalStorage() {
    if (typeof window !== 'undefined') {
      return window.localStorage;
    }
    return null;
  }

  async getItem(key: string) {
    const storage = this.getLocalStorage();
    return storage ? storage.getItem(key) : null;
  }

  async setItem(key: string, value: string) {
    const storage = this.getLocalStorage();
    if (storage) {
      return storage.setItem(key, value);
    }
  }

  async removeItem(key: string) {
    const storage = this.getLocalStorage();
    if (storage) {
      return storage.removeItem(key);
    }
  }
}

export const storage = Platform.OS === 'web' ? new WebStorage() : AsyncStorage; 