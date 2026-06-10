import { useState, useEffect } from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import DeviceInfo from 'react-native-device-info';
import { Logger } from '../utils/logger';

export type UpdateType = 'SOFT' | 'HARD' | null;

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
          android_latest_version: '0.0.0',
          ios_latest_version: '0.0.0',
          update_type: 'SOFT',
          store_url_android: 'https://play.google.com/store/apps/details?id=com.networkinternational.networkcommercial',
          store_url_ios: 'https://apps.apple.com/ae/app/network-commercial/id6761809664',
        });

        await remoteConfig().fetchAndActivate();

        const isAndroid = DeviceInfo.getSystemName() === 'Android';
        const latestVersion = isAndroid
          ? remoteConfig().getString('android_latest_version')
          : remoteConfig().getString('ios_latest_version');
        const type = remoteConfig().getString('update_type') as UpdateType;
        const currentVersion = DeviceInfo.getVersion();
        const url = isAndroid
          ? remoteConfig().getString('store_url_android')
          : remoteConfig().getString('store_url_ios');

        Logger.log('[AppUpdate] currentVersion:', currentVersion);
        Logger.log('[AppUpdate] latestVersion:', latestVersion);
        Logger.log('[AppUpdate] update_type:', type);
        Logger.log('[AppUpdate] needsUpdate:', compareVersions(currentVersion, latestVersion));

        if (compareVersions(currentVersion, latestVersion) && (type === 'SOFT' || type === 'HARD')) {
          setUpdateType(type);
          setStoreUrl(url);
        }
      } catch (e) {
        Logger.error('[AppUpdate] error:', e);
      } finally {
        setChecking(false);
      }
    };

    checkUpdate();
  }, []);

  return { checking, updateType, storeUrl };
};

export default useAppUpdateCheck;
