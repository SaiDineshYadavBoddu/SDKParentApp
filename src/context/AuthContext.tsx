import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from 'react';
import { authorize, logout, AuthConfiguration } from 'react-native-app-auth';
import { Linking } from 'react-native';
import { keycloakConfig } from '../config/keycloakConfig';
import NetInfo from '@react-native-community/netinfo';

interface AuthContextData {
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  changePassword: () => Promise<void>;
  checkIsInternetConnected: () => Promise<void>;
  isConnected: boolean | null;
  accessToken: string | null;
  idToken: string | null;
}

let globalAccessToken: string | null = null;
export const getAccessToken = () => globalAccessToken;

const AuthContext = createContext<AuthContextData>({
  isAuthenticated: false,
  signIn: async () => {},
  signOut: async () => {},
  changePassword: async () => {},
  checkIsInternetConnected: async () => {},
  isConnected: null,
  accessToken: null,
  idToken: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => {
      unsubscribe();
    };
  }, []);


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
      globalAccessToken = result.accessToken;
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
          idToken: idToken,
          postLogoutRedirectUrl: keycloakConfig.redirectUrl,
        });
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setAccessToken(null);
      globalAccessToken = null;
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

  const checkIsInternetConnected = async () => {
    const state = await NetInfo.fetch();
    setIsConnected(state.isConnected);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        signIn,
        signOut,
        changePassword,
        checkIsInternetConnected,
        isConnected,
        accessToken,
        idToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
