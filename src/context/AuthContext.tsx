import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import { authorize, logout, refresh, AuthConfiguration } from 'react-native-app-auth';
import { Linking } from 'react-native';
import { keycloakConfig } from '../config/keycloakConfig';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch } from 'react-redux';
import { backendApi } from '../network/api.config';

interface AuthContextData {
  isAuthenticated: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  changePassword: () => Promise<void>;
  changeCompany: () => Promise<void>;
  checkIsInternetConnected: () => Promise<void>;
  isConnected: boolean | null;
  accessToken: string | null;
  idToken: string | null;
  refreshToken: string | null;
  expirationDate: string | null;
  refreshAccessToken: () => Promise<void>;
  sessionExpired: boolean;
  setSessionExpired: (value: boolean) => void;
}

let globalAccessToken: string | null = null;
let globalIsAuthenticated: boolean = false;
export const getAccessToken = () => globalAccessToken;
export const getIsAuthenticated = () => globalIsAuthenticated;

const AuthContext = createContext<AuthContextData>({
  isAuthenticated: false,
  signIn: async () => { },
  signOut: async () => { },
  changePassword: async () => { },
  changeCompany: async () => { },
  checkIsInternetConnected: async () => { },
  isConnected: null,
  accessToken: null,
  idToken: null,
  refreshToken: null,
  expirationDate: null,
  refreshAccessToken: async () => { },
  sessionExpired: false,
  setSessionExpired: () => { },
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [expirationDate, setExpirationDate] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const prevTokenRef = useRef<string | null>(null);

  // Reset API state when accessToken changes (e.g. after password change or company selection)
  useEffect(() => {
    if (accessToken && isAuthenticated) {
      // Only reset if we had a previous token and it changed
      // This skips the reset on the initial login which was causing AbortError
      if (prevTokenRef.current && prevTokenRef.current !== accessToken) {
        console.log('🚀 ~ accessToken changed, resetting API state...');
        dispatch(backendApi.util.resetApiState());
      }
      // Update the ref with the current token
      prevTokenRef.current = accessToken;
    }
  }, [accessToken, isAuthenticated, dispatch]);


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
      setRefreshToken(result.refreshToken);
      setExpirationDate(result.accessTokenExpirationDate);
      setIsAuthenticated(true);
      globalIsAuthenticated = true;
      setSessionExpired(false);
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
      setRefreshToken(null);
      setExpirationDate(null);
      setIsAuthenticated(false);
      globalIsAuthenticated = false;
      dispatch(backendApi.util.resetApiState());
    }
  };

  const changePassword = async () => {
    try {
      const result = await authorize({
        ...keycloakConfig,
        additionalParameters: {
          kc_action: 'UPDATE_PASSWORD',
        },
      } as AuthConfiguration);
      console.log('Change password success:', result);
      setAccessToken(result.accessToken);
      globalAccessToken = result.accessToken;
      setIdToken(result.idToken);
      setRefreshToken(result.refreshToken);
      setExpirationDate(result.accessTokenExpirationDate);
    } catch (error) {
      if (error instanceof Error &&
        (error.message === 'User cancelled' || error.message.includes('User cancelled flow'))) {
        console.log('User cancelled password update');
      } else {
        console.error('Change password failed:', error);
      }
    }
  };


  const changeCompany = async () => {
    try {
      const result = await authorize({
        ...keycloakConfig,
        additionalParameters: {
          kc_action: 'NI_ADMIN_COMPANY_SELECT',
        },
      } as AuthConfiguration);
      console.log('Change company success:', result);
      setAccessToken(result.accessToken);
      globalAccessToken = result.accessToken;
      setIdToken(result.idToken);
      setRefreshToken(result.refreshToken);
      setExpirationDate(result.accessTokenExpirationDate);
    } catch (error) {
      if (error instanceof Error &&
        (error.message === 'User cancelled' || error.message.includes('User cancelled flow'))) {
        console.log('User cancelled company update');
      } else {
        console.error('Change company failed:', error);
      }
    }
  };

  const refreshAccessToken = async () => {
    try {
      if (refreshToken) {
        const result = await refresh(keycloakConfig as AuthConfiguration, {
          refreshToken: refreshToken,
        });
        console.log('Token refresh success:', result);
        setAccessToken(result.accessToken);
        globalAccessToken = result.accessToken;
        setIdToken(result.idToken);
        setRefreshToken(result.refreshToken);
        setExpirationDate(result.accessTokenExpirationDate);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, sign out
      signOut();
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
        changeCompany,
        checkIsInternetConnected,
        isConnected,
        accessToken,
        idToken,
        refreshToken,
        expirationDate,
        refreshAccessToken,
        sessionExpired,
        setSessionExpired,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
