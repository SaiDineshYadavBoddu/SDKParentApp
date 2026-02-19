import React, { createContext, useState, useContext, ReactNode, useEffect, useRef, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { useAuth } from './AuthContext';
import SessionTimeoutModal from '../common/components/SessionTimeoutModal';
import { recordActivity, isInactiveForThreshold } from '../utils/sessionActivity';

// Constants
const SHOW_MODAL_BEFORE_EXPIRY = 60; // Show modal 1 minute before expiry

// Global functions for external use (api.config 401 handling)
let globalExpireSession: (() => Promise<void>) | null = null;
let globalTrySilentRefresh: (() => Promise<boolean>) | null = null;

export const expireSession = async () => {
    if (globalExpireSession) await globalExpireSession();
};

/** Try to refresh the access token silently. Returns true if refresh succeeded. */
export const trySilentRefresh = async (): Promise<boolean> => {
    if (globalTrySilentRefresh) return globalTrySilentRefresh();
    return false;
};


interface SessionTimeoutContextData {
    isModalVisible: boolean;
    remainingTime: number;
    handleStayLoggedIn: () => void;
    handleLogout: () => void;
}

const SessionTimeoutContext = createContext<SessionTimeoutContextData>({
    isModalVisible: false,
    remainingTime: 0,
    handleStayLoggedIn: () => { },
    handleLogout: () => { },
});

export const SessionTimeoutProvider = ({ children }: { children: ReactNode }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const modalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const screenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const { isAuthenticated, signOut, expirationDate, refreshAccessToken, setSessionExpired } = useAuth();

    const clearTimers = useCallback(() => {
        if (modalTimerRef.current) clearTimeout(modalTimerRef.current);
        if (screenTimerRef.current) clearTimeout(screenTimerRef.current);
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        modalTimerRef.current = null;
        screenTimerRef.current = null;
        countdownIntervalRef.current = null;
    }, []);

    // Session expiration handler
    const expireSessionImpl = useCallback(async (isAuto = false) => {
        setIsModalVisible(false);
        clearTimers();
        if (isAuto) {
            setSessionExpired(true);
        }
        await signOut();
    }, [clearTimers, signOut, setSessionExpired]);

    // Expose expireSessionImpl and trySilentRefresh globally
    useEffect(() => {
        globalExpireSession = expireSessionImpl;
        globalTrySilentRefresh = async () => await refreshAccessToken();
        return () => {
            globalExpireSession = null;
            globalTrySilentRefresh = null;
        };
    }, [expireSessionImpl, refreshAccessToken]);

    // Start session timers
    const startTimers = useCallback(() => {
        clearTimers();
        if (!expirationDate) return;

        const expiryTime = new Date(expirationDate).getTime();
        const currentTime = Date.now();
        const timeUntilExpiry = expiryTime - currentTime;

        if (timeUntilExpiry <= 0) {
            expireSessionImpl(true);
            return;
        }

        const modalTimeout = timeUntilExpiry - (SHOW_MODAL_BEFORE_EXPIRY * 1000);
        const screenTimeout = timeUntilExpiry;

        if (modalTimeout > 0) {
            modalTimerRef.current = setTimeout(async () => {
                if (isInactiveForThreshold()) {
                    setIsModalVisible(true);
                    setRemainingTime(SHOW_MODAL_BEFORE_EXPIRY);
                } else {
                    clearTimers();
                    await refreshAccessToken();
                }
            }, modalTimeout);
        } else {
            if (isInactiveForThreshold()) {
                const initialRemaining = Math.max(0, Math.floor(timeUntilExpiry / 1000));
                setRemainingTime(initialRemaining);
                setIsModalVisible(true);
            } else {
                clearTimers();
                refreshAccessToken();
            }
        }

        screenTimerRef.current = setTimeout(() => expireSessionImpl(true), screenTimeout);
    }, [clearTimers, expireSessionImpl, expirationDate, refreshAccessToken]);

    useEffect(() => {
        if (isModalVisible) {
            countdownIntervalRef.current = setInterval(() => {
                setRemainingTime(prev => Math.max(0, prev - 1));
            }, 1000);
        } else {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        }
        return () => {
            if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        };
    }, [isModalVisible]);

    const handleStayLoggedIn = useCallback(() => {
        setIsModalVisible(false);
        setRemainingTime(0);
        refreshAccessToken();
    }, [refreshAccessToken]);

    const handleLogout = useCallback(async () => {
        setIsModalVisible(false);
        clearTimers();
        await signOut();
    }, [clearTimers, signOut]);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
            if (nextAppState === 'active' && isAuthenticated) {
                recordActivity();
                startTimers();
            }
        });

        return () => {
            subscription.remove();
        };
    }, [isAuthenticated, startTimers]);

    useEffect(() => {
        if (isAuthenticated) {
            recordActivity();
            startTimers();
        } else {
            clearTimers();
            setIsModalVisible(false);
        }
        return clearTimers;
    }, [isAuthenticated, startTimers, clearTimers]);

    return (
        <SessionTimeoutContext.Provider value={{
            isModalVisible,
            remainingTime,
            handleStayLoggedIn,
            handleLogout
        }}>
            {children}
            <SessionTimeoutModal />
        </SessionTimeoutContext.Provider>
    );
};

export const useSessionTimeout = () => useContext(SessionTimeoutContext);
