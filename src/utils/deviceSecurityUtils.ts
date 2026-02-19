import JailMonkey from 'jail-monkey';
import { Platform } from 'react-native';

export type DeviceSecurityStatus = {
    isJailbroken: boolean;
    isRooted: boolean;
    isEmulator: boolean;
    isDebuggerAttached: boolean;
    isMockLocation: boolean;
    isOnExternalStorage: boolean;
    isDevelopmentSettingsModeEnabled: boolean;
    isAdbEnabled: boolean;
}
export const getDeviceSecurityStatus = async (): Promise<DeviceSecurityStatus> => {
    const isJailbroken = JailMonkey.isJailBroken();
    return {
        isJailbroken,
        isRooted : isJailbroken,
        isEmulator : JailMonkey.isOnExternalStorage(),
        isDebuggerAttached : await JailMonkey.isDebuggedMode(),
        isMockLocation : Platform.OS === 'android' ? JailMonkey.canMockLocation?.() : false,
        isOnExternalStorage : JailMonkey.isOnExternalStorage(),
        isDevelopmentSettingsModeEnabled : await JailMonkey.isDevelopmentSettingsMode(),
        isAdbEnabled : Platform.OS === 'android' ? JailMonkey.AdbEnabled?.() : false,
    };
};