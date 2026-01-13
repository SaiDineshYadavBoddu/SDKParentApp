import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import { authorize, logout, AuthConfiguration } from 'react-native-app-auth';
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
}

let globalAccessToken: string | null = null;
export const getAccessToken = () => globalAccessToken;

const AuthContext = createContext<AuthContextData>({
  isAuthenticated: false,
  signIn: async () => {},
  signOut: async () => {},
  changePassword: async () => {},
  changeCompany: async () => {},
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
    } catch (error) {
      if (error instanceof Error && 
          (error.message === 'User cancelled' || error.message.includes('User cancelled flow'))) {
        console.log('User cancelled company update');
      } else {
        console.error('Change company failed:', error);
      }
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
