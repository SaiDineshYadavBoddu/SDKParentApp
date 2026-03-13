import { NativeModules, Platform } from 'react-native';

const { SecureScreenManager } = NativeModules;

export const enableSecureScreen = () => {
  if (Platform.OS === 'ios') {
    if (SecureScreenManager) {
      SecureScreenManager.enableSecure();
    } else {
      console.warn('SecureScreenManager is not available. Please ensure native files are included in the build target.');
    }
  }
};