import React, { createContext, useState, useContext, ReactNode } from 'react';
import { authorize, AuthConfiguration } from 'react-native-app-auth';
import { keycloakConfig } from '../config/keycloakConfig';

interface AuthContextData {
    isAuthenticated: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    accessToken: string | null;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const signIn = async () => {
        try {
            const result = await authorize(keycloakConfig as AuthConfiguration);
            console.log('Login success:', result);
            setAccessToken(result.accessToken);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login failed:', error);
            // Handle error appropriately
        }
    };

    const signOut = async () => {
        // Implement logout logic if needed, for now just clear local state
        setAccessToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, signIn, signOut, accessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
