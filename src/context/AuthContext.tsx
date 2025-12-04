import React, { createContext, useState, useContext, ReactNode } from 'react';
import { authorize, logout, AuthConfiguration } from 'react-native-app-auth';
import { Linking } from 'react-native';
import { keycloakConfig } from '../config/keycloakConfig';

interface AuthContextData {
    isAuthenticated: boolean;
    signIn: () => Promise<void>;
    signOut: () => Promise<void>;
    changePassword: () => Promise<void>;
    accessToken: string | null;
    idToken: string | null;
}

const AuthContext = createContext<AuthContextData>({
    isAuthenticated: false,
    signIn: async () => { },
    signOut: async () => { },
    changePassword: async () => { },
    accessToken: null,
    idToken: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [idToken, setIdToken] = useState<string | null>(null);

    const signIn = async () => {
        try {
            const result = await authorize({
                ...keycloakConfig,
                additionalParameters: {
                    prompt: 'login',
                },
            } as AuthConfiguration);
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
                // Cast to any to avoid type error with idTokenToHint
                await logout(keycloakConfig as any, {
                    idToken: "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJCVFJIQk1Kdnd0Q21TOFh0dDhiUUYzREV0enJUczR5ZGVxandaWm1HMkk0In0.eyJleHAiOjE3NjQ3NDcwNzEsImlhdCI6MTc2NDc0Njc3MSwiYXV0aF90aW1lIjoxNzY0NzQ2NzcwLCJqdGkiOiI5NTMwZGI2MC05OWZiLTRjN2YtOTA2MC02NjBhM2RmMzZlZmUiLCJpc3MiOiJodHRwczovL2tleWNsb2FrLmNvcnBvcmF0ZS51bi5pbmZyYWRldi53NC5hei5uZXR3b3JrLmFlL2F1dGgvcmVhbG1zL05ldHdvcmsiLCJhdWQiOlsiY29ycG9yYXRlLXBvcnRhbC11aS1zaXQiLCJjb3Jwb3JhdGUtcG9ydGFsLWFwaSJdLCJzdWIiOiIxN2U3MGI1NC0xYjYwLTRkY2UtYTExNi0xNmM4ZmEyYTMwMWQiLCJ0eXAiOiJJRCIsImF6cCI6ImNvcnBvcmF0ZS1wb3J0YWwtdWktc2l0Iiwibm9uY2UiOiJiMGQ2NWFjZC1iM2RmLTRlMjItYmNmZi1jYzU2ZjBlOTYyMTciLCJzZXNzaW9uX3N0YXRlIjoiMDkxZWMwYzMtODk2ZC00MTM1LTljYTYtZDdhY2FkZjY0MTBlIiwiYXRfaGFzaCI6IjBYM1IxdVNfdHphME0zbllWRF8tcmciLCJhY3IiOiIxIiwic2lkIjoiMDkxZWMwYzMtODk2ZC00MTM1LTljYTYtZDdhY2FkZjY0MTBlIiwidXBuIjoic2hhcm1pbDIwMCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwibmFtZSI6IlNoYXJtaWwgcGFuYXlhbiIsInByZWZlcnJlZF91c2VybmFtZSI6InNoYXJtaWwyMDAiLCJnaXZlbl9uYW1lIjoiU2hhcm1pbCIsImZhbWlseV9uYW1lIjoicGFuYXlhbiIsImVtYWlsIjoic2hhcm1pbDIwMEB5b3BtYWlsLmNvbSJ9.psDSn2MiEUvM3TgH7NPJWWIMEOuVa4HqiGgxyyga5Ete7t3xIgIPI3RAgDn4GPBymFxQiMFfnYiF7gOce8WvKGdHdPYqeOWjgEIPCDiilbZHsta-8ogVFdpLyHBLI3H2J01S1mo6dYcomBvFJuXSB4vMcibopRs_3hcLqI0Mn8jQ2O-TWQZ-IZTN8J3_q8OTsCu2NP9s0quyP1ck8LzhyPV17yX8QBo6CAHmFLKR0iHtbl0i5tuxASxDamBaV5jbXj5KqvB1gqni9Ii_ho0IUOd7Nurx1XNMZFQjuwkoSyWO01qANavCZKTrji_NiaE2Q292KRVxzLg-9Jl23AHX7A",
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

    const changePassword = async () => {
        try {
            // Construct the account management URL
            // Ensure issuer ends with / if not present, but keycloakConfig usually has it
            const issuer = keycloakConfig.issuer.endsWith('/')
                ? keycloakConfig.issuer
                : `${keycloakConfig.issuer}/`;
            const changePasswordUrl = `${issuer}account/password`;

            const supported = await Linking.canOpenURL(changePasswordUrl);
            if (supported) {
                await Linking.openURL(changePasswordUrl);
            } else {
                console.error("Don't know how to open URI: " + changePasswordUrl);
            }
        } catch (error) {
            console.error('Change password failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, signIn, signOut, changePassword, accessToken, idToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
