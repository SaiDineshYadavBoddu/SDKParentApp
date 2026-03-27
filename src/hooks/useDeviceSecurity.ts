import { useEffect, useState } from "react"
import { DeviceSecurityStatus, getDeviceSecurityStatus } from "../utils/deviceSecurityUtils"

export const useDeviceSecurity = () => {
    const [deviceSecurityStatus, setDeviceSecurityStatus] = useState<DeviceSecurityStatus | null>(null);

    useEffect(() => {
        const fetchDeviceSecurityStatus = async () => {
            const status = await getDeviceSecurityStatus()
            setDeviceSecurityStatus(status)
        }
        fetchDeviceSecurityStatus()
    }, [])

    const isDeviceSecure = !deviceSecurityStatus ? true : !(
        deviceSecurityStatus.isJailbroken ||
        deviceSecurityStatus.isRooted ||
        deviceSecurityStatus.isEmulator ||
        deviceSecurityStatus.isDebuggerAttached ||
        deviceSecurityStatus.isMockLocation ||
        deviceSecurityStatus.isOnExternalStorage ||
        deviceSecurityStatus.isDevelopmentSettingsModeEnabled ||
        deviceSecurityStatus.isAdbEnabled
    );

    return {
        deviceSecurityStatus,
        isDeviceSecure
    }
}