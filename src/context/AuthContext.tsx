import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import { authorize, logout, refresh, AuthConfiguration } from 'react-native-app-auth';
import { Linking, AppState, AppStateStatus } from 'react-native';
import { keycloakConfig } from '../config/keycloakConfig';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch } from 'react-redux';
import { backendApi } from '../network/api.config';
import { hasRole, getBankCode, getBankId, getRole } from '../utils/jwtUtils';

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
  isCardholder: boolean;
  isLoading: boolean;
}

let globalAccessToken: string | null = null;
let globalIsAuthenticated: boolean = false;
let globalIsCardholder: boolean = false;
let globalBankCode: string | null = null;
let globalBankId: string | null = null;
let globalRole: string | null = null;

export const getAccessToken = () => globalAccessToken;
export const getIsAuthenticated = () => globalIsAuthenticated;
export const getIsCardholder = () => globalIsCardholder;
export const getGlobalBankCode = () => globalBankCode;
export const getGlobalBankId = () => globalBankId;
export const getGlobalRole = () => globalRole;

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
  isCardholder: false,
  isLoading: false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [expirationDate, setExpirationDate] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [isCardholder, setIsCardholder] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const isSigningIn = useRef(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      // If we are leaving the app during a sign-in operation, turn on the loader 
      // so it's ready when the user comes back.
      if ((nextAppState === 'background' || nextAppState === 'inactive') && isSigningIn.current) {
        setIsLoading(true);
      }

      // Also ensure it stays on if we return and sign-in is still pending
      if (nextAppState === 'active' && isSigningIn.current) {
        setIsLoading(true);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

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
    isSigningIn.current = true;
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

      const hasCardholderRole = hasRole(result.accessToken, 'cardholder', 'corporate-portal-api-sit');
      setIsCardholder(hasCardholderRole);
      globalIsCardholder = hasCardholderRole;

      // Extract and store bank claims
      globalBankCode = getBankCode(result.accessToken);
      globalBankId = getBankId(result.accessToken);
      globalRole = getRole(result.accessToken);
      console.log('🚀 ~ Bank Claims - bankCode:', globalBankCode, 'bankId:', globalBankId, 'role:', globalRole);

      setIsAuthenticated(true);
      globalIsAuthenticated = true;
      setSessionExpired(false);
    } catch (error) {
      console.error('Login failed:', error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
      isSigningIn.current = false;
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
      setIsCardholder(false);
      globalIsCardholder = false;
      prevTokenRef.current = null; // Reset prev token to avoid triggering resetApiState on next login
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

      // Extract and store updated bank claims
      globalBankCode = getBankCode(result.accessToken);
      globalBankId = getBankId(result.accessToken);
      globalRole = getRole(result.accessToken);
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

      // Extract and store updated bank claims
      globalBankCode = getBankCode(result.accessToken);
      globalBankId = getBankId(result.accessToken);
      globalRole = getRole(result.accessToken);
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

        // Extract and store updated bank claims
        globalBankCode = getBankCode(result.accessToken);
        globalBankId = getBankId(result.accessToken);
        globalRole = getRole(result.accessToken);
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
        isCardholder,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
