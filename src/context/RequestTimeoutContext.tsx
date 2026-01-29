import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { registerTimeoutListener, unregisterTimeoutListener } from '../utils/timeoutUtils';

interface RequestTimeoutContextData {
    isRequestTimedOut: boolean;
    setRequestTimedOut: (value: boolean) => void;
}

const RequestTimeoutContext = createContext<RequestTimeoutContextData>({
    isRequestTimedOut: false,
    setRequestTimedOut: () => { },
});

export const RequestTimeoutProvider = ({ children }: { children: ReactNode }) => {
    const [isRequestTimedOut, setIsRequestTimedOut] = useState(false);

    useEffect(() => {
        const handleTimeout = () => {
            setIsRequestTimedOut(true);
        };

        registerTimeoutListener(handleTimeout);

        return () => {
            unregisterTimeoutListener();
        };
    }, []);

    return (
        <RequestTimeoutContext.Provider value={{ isRequestTimedOut, setRequestTimedOut: setIsRequestTimedOut }}>
            {children}
        </RequestTimeoutContext.Provider>
    );
};

export const useRequestTimeout = () => useContext(RequestTimeoutContext);
