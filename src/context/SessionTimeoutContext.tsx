import React, { createContext, useState, useContext, ReactNode, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import SessionTimeoutModal from '../common/components/SessionTimeoutModal';

// Constants
const SHOW_MODAL_BEFORE_EXPIRY = 60; // Show modal 1 minute before expiry

// Global function for external use (api.config 401 handling)
let globalExpireSession: (() => Promise<void>) | null = null;

export const expireSession = async () => {
    if (globalExpireSession) await globalExpireSession();
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

    // Expose expireSessionImpl globally
    useEffect(() => {
        globalExpireSession = expireSessionImpl;
        return () => {
            globalExpireSession = null;
        };
    }, [expireSessionImpl]);

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
            modalTimerRef.current = setTimeout(() => {
                setIsModalVisible(true);
                setRemainingTime(SHOW_MODAL_BEFORE_EXPIRY);
            }, modalTimeout);
        } else {
            // Already within 1 minute of expiry
            const initialRemaining = Math.max(0, Math.floor(timeUntilExpiry / 1000));
            setRemainingTime(initialRemaining);
            setIsModalVisible(true);
        }

        screenTimerRef.current = setTimeout(() => expireSessionImpl(true), screenTimeout);
    }, [clearTimers, expireSessionImpl, expirationDate]);

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
        if (isAuthenticated) {
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
