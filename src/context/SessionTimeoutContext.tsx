import React, { createContext, useState, useContext, ReactNode, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import SessionTimeoutModal from '../common/components/SessionTimeoutModal';
import { navigateToSessionExpiredScreen } from '../utils/navigationUtils';

// Constants
const SESSION_TIMEOUT_DURATION = 300; // 5 minutes in seconds
const SHOW_MODAL_AT_REMAINING = 120; // Show modal when 2 minutes are remaining
const SHOW_SCREEN_AT_REMAINING = 20;  // Navigate to screen when 20 seconds are remaining

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
    const { isAuthenticated, signOut, signIn } = useAuth();

    const clearTimers = useCallback(() => {
        if (modalTimerRef.current) clearTimeout(modalTimerRef.current);
        if (screenTimerRef.current) clearTimeout(screenTimerRef.current);
        modalTimerRef.current = null;
        screenTimerRef.current = null;
    }, []);

        // Session expiration handler
    const expireSessionImpl = useCallback(async () => {
        setIsModalVisible(false);
        clearTimers();
        await signOut();
        navigateToSessionExpiredScreen(async () => await signIn());
    }, [clearTimers, signOut, signIn]);

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
        const modalTimeout = (SESSION_TIMEOUT_DURATION - SHOW_MODAL_AT_REMAINING) * 1000;
        const screenTimeout = (SESSION_TIMEOUT_DURATION - SHOW_SCREEN_AT_REMAINING) * 1000;

        modalTimerRef.current = setTimeout(() => setIsModalVisible(true), modalTimeout);
        screenTimerRef.current = setTimeout(() => expireSessionImpl(), screenTimeout);
    }, [clearTimers, expireSessionImpl]);

    const handleStayLoggedIn = useCallback(() => {
        setIsModalVisible(false);
    }, []);

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
