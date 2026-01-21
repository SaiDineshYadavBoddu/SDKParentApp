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
    handleStayLoggedIn: () => void;
    handleLogout: () => void;
}

const SessionTimeoutContext = createContext<SessionTimeoutContextData>({
    isModalVisible: false,
    handleStayLoggedIn: () => { },
    handleLogout: () => { },
});

export const SessionTimeoutProvider = ({ children }: { children: ReactNode }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const modalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const screenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const { isAuthenticated, signOut, expirationDate, refreshAccessToken, setSessionExpired } = useAuth();

    const clearTimers = useCallback(() => {
        if (modalTimerRef.current) clearTimeout(modalTimerRef.current);
        if (screenTimerRef.current) clearTimeout(screenTimerRef.current);
        modalTimerRef.current = null;
        screenTimerRef.current = null;
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
            modalTimerRef.current = setTimeout(() => setIsModalVisible(true), modalTimeout);
        } else {
            // Already within 1 minute of expiry
            setIsModalVisible(true);
        }

        screenTimerRef.current = setTimeout(() => expireSessionImpl(true), screenTimeout);
    }, [clearTimers, expireSessionImpl, expirationDate]);

    const handleStayLoggedIn = useCallback(() => {
        setIsModalVisible(false);
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
            handleStayLoggedIn,
            handleLogout
        }}>
            {children}
            <SessionTimeoutModal />
        </SessionTimeoutContext.Provider>
    );
};

export const useSessionTimeout = () => useContext(SessionTimeoutContext);
