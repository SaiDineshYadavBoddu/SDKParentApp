import { useState, useEffect } from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import DeviceInfo from 'react-native-device-info';

export type UpdateType = 'soft' | 'hard' | null;

interface AppUpdateCheckResult {
  checking: boolean;
  updateType: UpdateType;
  storeUrl: string;
}

let updateCheckDone = false;

const compareVersions = (current: string, target: string): boolean => {
  const c = current.split('.').map(Number);
  const t = target.split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const cv = c[i] ?? 0;
    const tv = t[i] ?? 0;
    if (cv < tv) return true;
    if (cv > tv) return false;
  }
  return false;
};

const useAppUpdateCheck = (): AppUpdateCheckResult => {
  const [checking, setChecking] = useState(!updateCheckDone);
  const [updateType, setUpdateType] = useState<UpdateType>(null);
  const [storeUrl, setStoreUrl] = useState('');

  useEffect(() => {
    if (updateCheckDone) return;
    updateCheckDone = true;

    const checkUpdate = async () => {
      try {
        await remoteConfig().setConfigSettings({
          minimumFetchIntervalMillis: 0, // always fetch fresh during development
        });

        await remoteConfig().setDefaults({
          latest_version: '0.0.0',
          update_type: 'soft',
          store_url_android: 'https://play.google.com/store/apps/details?id=com.networkinternational.networkcommercial',
          store_url_ios: 'https://apps.apple.com/ae/app/network-commercial/id6761809664',
        });

        await remoteConfig().fetchAndActivate();

        const latestVersion = remoteConfig().getString('latest_version');
        const type = remoteConfig().getString('update_type') as UpdateType;
        const currentVersion = DeviceInfo.getVersion();
        const androidUrl = remoteConfig().getString('store_url_android');
        const iosUrl = remoteConfig().getString('store_url_ios');
        const url = DeviceInfo.getSystemName() === 'Android' ? androidUrl : iosUrl;

        console.log('[AppUpdate] currentVersion:', currentVersion);
        console.log('[AppUpdate] latestVersion:', latestVersion);
        console.log('[AppUpdate] update_type:', type);
        console.log('[AppUpdate] needsUpdate:', compareVersions(currentVersion, latestVersion));

        if (compareVersions(currentVersion, latestVersion) && (type === 'soft' || type === 'hard')) {
          setUpdateType(type);
          setStoreUrl(url);
        }
      } catch (e) {
        console.log('[AppUpdate] error:', e);
      } finally {
        setChecking(false);
      }
    };

    checkUpdate();
  }, []);

  return { checking, updateType, storeUrl };
};

export default useAppUpdateCheck;
