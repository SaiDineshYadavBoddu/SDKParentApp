import { DeviceEventEmitter, NativeModules, Platform } from 'react-native';

const MintCreditSdk = NativeModules.MintCreditSdkModule;

export const MINT_CREDIT_SCREEN_EVENT = 'MintCreditSdkScreen';
export const MINT_CREDIT_DISMISSED_EVENT = 'MintCreditSdkDismissed';

export function openMintCreditSdk(headerHeight: number, footerHeight: number): void {
  if (Platform.OS !== 'android' || typeof MintCreditSdk?.show !== 'function') {
    return;
  }
  MintCreditSdk.show(headerHeight, footerHeight);
}

export function updateMintCreditSdkInsets(headerHeight: number, footerHeight: number): void {
  if (Platform.OS !== 'android' || typeof MintCreditSdk?.updateInsets !== 'function') {
    return;
  }
  MintCreditSdk.updateInsets(headerHeight, footerHeight);
}

export function goBackMintCreditSdk(): void {
  if (Platform.OS !== 'android' || typeof MintCreditSdk?.goBack !== 'function') {
    return;
  }
  MintCreditSdk.goBack();
}

export function closeMintCreditSdk(): void {
  if (Platform.OS !== 'android' || typeof MintCreditSdk?.close !== 'function') {
    return;
  }
  MintCreditSdk.close();
}

export function addMintCreditSdkListener(
  event: string,
  handler: (payload: { title?: string }) => void,
) {
  return DeviceEventEmitter.addListener(event, handler);
}
