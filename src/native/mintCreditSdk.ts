import { Buffer } from 'buffer';
import { MintCredit } from '@rokaTokenVault/react-native-mc-bnpl';
import type { BnplLauncherConfig } from '@rokaTokenVault/react-native-mc-bnpl';

export { BnplLauncher } from '@rokaTokenVault/react-native-mc-bnpl';
export type { BnplEventPayload } from '@rokaTokenVault/react-native-mc-bnpl';

const PARENT_BACKGROUND = '#FFFFFF';
// Gateway client values from the mc-sdk sample app (mint-credit/services/mc-sdk/android/sample).
// With all of them set the SDK routes via the gateway offer check; without them it falls back
// to a session lookup on baseUrl, which fails with `lookup_failed` against the placeholder BFF.
const GATEWAY_HOST = 'https://mc-uat-credit-gw.mintdigital.io/';
const BUNDLE_ID = 'com.mintcredit';
const EXTERNAL_USER_ID = 'usr_ext_01';
const TENANT_ID = 'tenant_01';
const MOBILE = '971500000001';

function base64Url(value: string): string {
  return Buffer.from(value, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function clientAssertion(): string {
  const header = base64Url('{}');
  const payload = base64Url(JSON.stringify({ source: 'android', tenant: TENANT_ID }));
  return `${header}.${payload}.signature`;
}

export const mintCreditSdkConfig: BnplLauncherConfig = {
  request: {
    baseUrl: 'https://sdk-bff.example/',
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
    clientAssertion: clientAssertion(),
    customerId: 'C1',
    cif: 'CIF-100',
    mobile: MOBILE,
    nationalId: '784199012345671',
    customerType: 'individual',
    userDetails: {
      fullName: 'Customer C1',
      firstName: 'Customer',
      lastName: 'C1',
      email: 'c1@bank.example',
      gender: 'unspecified',
      mobile: MOBILE,
    },
    style: {
      primary: '#0069B1',
      onPrimary: '#FFFFFF',
      background: PARENT_BACKGROUND,
      onBackground: '#000000',
      surface: PARENT_BACKGROUND,
      onSurface: '#1A1C1E',
      secondary: '#707070',
      onSecondary: '#FFFFFF',
      cornerRadiusDp: 20,
      danger: '#BA1A1A',
      success: '#2FBF71',
      warning: '#C97A20',
    },
    tenantId: TENANT_ID,
    externalUserId: EXTERNAL_USER_ID,
    locale: 'en',
    clientId: 'omH6VhOKh52wBuJf9SSv5A',
    clientSecret: 'S3P-9NVoKnhToUsMkXKJGY10aDip8HDy5J00ACg1w3A',
    bundleId: BUNDLE_ID,
    gatewayHost: GATEWAY_HOST,
  },
};

export function closeMintCreditSdk(): void {
  MintCredit.clearSession();
}
