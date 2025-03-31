import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDevBackendUrl } from './url';

const BACKEND_URL_KEY = 'EXPO_PUBLIC_BACKEND_URL';

export async function getBackendUrl() {
  try {
    // Lấy URL từ AsyncStorage
    const url = await AsyncStorage.getItem(BACKEND_URL_KEY);
    
    // Nếu có URL trong AsyncStorage, sử dụng nó
    if (url) {
      return url;
    }
    
    // Nếu không có URL trong AsyncStorage và không phải development mode
    if (!useDevBackendUrl()) {
      if (!process.env.EXPO_PUBLIC_BACKEND_URL) {
        throw new Error('EXPO_PUBLIC_BACKEND_URL not set in .env');
      }
      return process.env.EXPO_PUBLIC_BACKEND_URL;
    }
    
    // Nếu là development mode và không có URL, throw error
    throw new Error('Backend URL not configured');
  } catch (error) {
    console.error('Error getting backend URL:', error);
    throw error;
  }
}

export async function setBackendUrl(url) {
  try {
    await AsyncStorage.setItem(BACKEND_URL_KEY, url);
    return true;
  } catch (error) {
    console.error('Error setting backend URL:', error);
    return false;
  }
} 