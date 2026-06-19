import { useState, useEffect } from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import DeviceInfo from 'react-native-device-info';
import VersionCheck from 'react-native-version-check';
import { Logger } from '../utils/logger';

export type UpdateType = 'SOFT' | 'HARD' | null;

interface PlatformUpdateConfig {
  force_update_enabled: boolean;
  force_update_versions: string[];
  soft_update_enabled: boolean;
  soft_update_versions: string[];
}

interface AppUpdateConfig {
  android: PlatformUpdateConfig;
  ios: PlatformUpdateConfig;
  force_update_message: string;
  soft_update_message: string;
  store_urls: {
    android: string;
    ios: string;
  };
}

interface AppUpdateCheckResult {
  checking: boolean;
  updateType: UpdateType;
  storeUrl: string;
  updateMessage: string;
}

let updateCheckDone = false;

const DEFAULT_CONFIG: AppUpdateConfig = {
  android: {
    force_update_enabled: true,
    force_update_versions: [],
    soft_update_enabled: true,
    soft_update_versions: [],
  },
  ios: {
    force_update_enabled: true,
    force_update_versions: [],
    soft_update_enabled: true,
    soft_update_versions: [],
  },
  force_update_message: 'This version is no longer supported. Please update to continue using the app.',
  soft_update_message: 'We\'ve added new features and fixed some bugs. Update for the best experience.',
  store_urls: {
    android: 'https://play.google.com/store/apps/details?id=com.networkinternational.networkcommercial',
    ios: 'https://apps.apple.com/ae/app/network-commercial/id6761809664',
  },
};

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
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    if (updateCheckDone) return;
    updateCheckDone = true;

    const checkUpdate = async () => {
      try {
        await remoteConfig().setConfigSettings({
          minimumFetchIntervalMillis: 0,
        });

        await remoteConfig().setDefaults({
          app_update_config: JSON.stringify(DEFAULT_CONFIG),
        });

        const [, storeVersion] = await Promise.all([
          remoteConfig().fetchAndActivate(),
          VersionCheck.getLatestVersion(),
        ]);

        const raw = remoteConfig().getString('app_update_config');
        const config: AppUpdateConfig = JSON.parse(raw);

        const isAndroid = DeviceInfo.getSystemName() === 'Android';
        const platformConfig = isAndroid ? config.android : config.ios;
        const currentVersion = DeviceInfo.getVersion();
        const url = isAndroid ? config.store_urls.android : config.store_urls.ios;

        Logger.log('[AppUpdate] currentVersion:', currentVersion);
        Logger.log('[AppUpdate] storeVersion:', storeVersion);
        Logger.log('[AppUpdate] platformConfig:', platformConfig);

        if (!storeVersion || !compareVersions(currentVersion, storeVersion)) {
          return;
        }

        if (platformConfig.force_update_enabled && platformConfig.force_update_versions.includes(storeVersion) ) {
          setUpdateType('HARD');
          setStoreUrl(url);
          setUpdateMessage(config.force_update_message);
        } else if (platformConfig.soft_update_enabled && platformConfig.soft_update_versions.includes(storeVersion)) {
          setUpdateType('SOFT');
          setStoreUrl(url);
          setUpdateMessage(config.soft_update_message);
        }
      } catch (e) {
        Logger.error('[AppUpdate] error:', e);
      } finally {
        setChecking(false);
      }
    };

    checkUpdate();
  }, []);

  return { checking, updateType, storeUrl, updateMessage };
};

export default useAppUpdateCheck;
