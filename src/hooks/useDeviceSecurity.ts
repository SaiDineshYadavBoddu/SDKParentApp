import { useEffect, useState } from "react"
import { DeviceSecurityStatus, getDeviceSecurityStatus } from "../utils/deviceSecurityUtils"

export const useDeviceSecurity = () => {
    const [deviceSecurityStatus, setDeviceSecurityStatus] = useState<DeviceSecurityStatus | null>(null);
    const [isDeviceSecure, setIsDeviceSecure] = useState(false);

    useEffect(() => {
        const fetchDeviceSecurityStatus = async () => {
            const status = await getDeviceSecurityStatus()
            setDeviceSecurityStatus(status)
            const isCompromised = status.isJailbroken || status.isRooted || status.isEmulator || status.isDebuggerAttached || status.isMockLocation || status.isOnExternalStorage || status.isDevelopmentSettingsModeEnabled || status.isAdbEnabled
            setIsDeviceSecure(!isCompromised)
        }
        fetchDeviceSecurityStatus()
    }, [])

    return {
        deviceSecurityStatus,
        isDeviceSecure
    }
}