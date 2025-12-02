import React, { createContext, useState, useContext, ReactNode } from 'react';
import { authorize, logout, AuthConfiguration } from 'react-native-app-auth';
import { keycloakConfig } from '../config/keycloakConfig';

interface AuthContextData {
    isAuthenticated: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    accessToken: string | null;
    idToken: string | null;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [idToken, setIdToken] = useState<string | null>(null);

    const signIn = async () => {
        try {
            const result = await authorize(keycloakConfig as AuthConfiguration);
            console.log('Login success:', result);
            setAccessToken(result.accessToken);
            setIdToken(result.idToken);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login failed:', error);
            // Handle error appropriately
        }
    };

    const signOut = async () => {
        try {
            if (idToken) {
                await logout(keycloakConfig as AuthConfiguration, {
                    idToken: idToken,
                    postLogoutRedirectUrl: keycloakConfig.redirectUrl,
                });
            }
        } catch (error) {
            console.error('Logout failed:', error);
        } finally {
            setAccessToken(null);
            setIdToken(null);
            setIsAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, signIn, signOut, accessToken, idToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
