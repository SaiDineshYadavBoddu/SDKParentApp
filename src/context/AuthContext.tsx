import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
  useRef,
} from 'react';
import { authorize, logout, refresh, AuthConfiguration } from 'react-native-app-auth';
import { Linking, AppState, AppStateStatus, ToastAndroid, Platform, Alert } from 'react-native';
import { keycloakConfig } from '../config/keycloakConfig';
import NetInfo from '@react-native-community/netinfo';
import { useDispatch } from 'react-redux';
import { backendApi } from '../network/api.config';
import { hasRole, getBankCode, getBankId, getRole } from '../utils/jwtUtils';
import { isSslPinningError, reportSslPinningFailure } from '../utils/sslPinningError';

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
  refreshAccessToken: () => Promise<boolean>;
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
  refreshAccessToken: async () => false,
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

  const showSignInToast = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.LONG);
    } else {
      Alert.alert('Sign In Failed', message);
    }
  };


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

      // If user moves app to background, we preserve the session
      // to permit returning to it later. Accuracy is handled by SessionTimeoutContext.
      if (nextAppState === 'background' && isAuthenticated) {
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isAuthenticated]); // Removed refreshToken dependency since silentLogout is gone

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const prevClaimsRef = useRef<string | null>(null);

  // Reset API state when context/claims change (e.g. after password change or company selection)
  useEffect(() => {
    if (accessToken && isAuthenticated) {
      // Create a unique key for the current company/role context
      const currentClaims = `${globalBankId}-${globalBankCode}-${globalRole}`;

      // Only reset if we had previous claims and they are different from current
      if (prevClaimsRef.current && prevClaimsRef.current !== currentClaims) {
        dispatch(backendApi.util.resetApiState());
      }

      // Update the ref with current context
      prevClaimsRef.current = currentClaims;
    }
  }, [accessToken, isAuthenticated, dispatch]);


  const signIn = async () => {
    isSigningIn.current = true;
    try {
      const result = await authorize({
        ...keycloakConfig,
        additionalParameters: {
          prompt: 'login select_account',
        } as any,
      } as AuthConfiguration);
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

      setIsAuthenticated(true);
      globalIsAuthenticated = true;
      setSessionExpired(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (isSslPinningError(message)) {
        reportSslPinningFailure();
      } else if (
        message !== 'User cancelled' &&
        !message.includes('User cancelled flow') &&
        !message.toLowerCase().includes('cancelled')
      ) {
        // showSignInToast(message);
      }
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
      prevClaimsRef.current = null; // Reset prev claims to avoid triggering resetApiState on next login
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
      } else {
        console.error('Change password failed:', error);
      }
    }
  };


  const changeCompany = async () => {
    setIsLoading(true);
    // Defer Keycloak so the loading view paints first and we never show Profile during transition
    await new Promise<void>(resolve => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
    try {
      const result = await authorize({
        ...keycloakConfig,
        additionalParameters: {
          kc_action: 'NI_ADMIN_COMPANY_SELECT',
        },
      } as AuthConfiguration);

      // Set cardholder role first, then tokens, then loading false in one batch so navigator never shows MainStack with old role
      const hasCardholderRole = hasRole(result.accessToken, 'cardholder', 'corporate-portal-api-sit');
      setIsCardholder(hasCardholderRole);
      globalIsCardholder = hasCardholderRole;

      setAccessToken(result.accessToken);
      globalAccessToken = result.accessToken;
      setIdToken(result.idToken);
      setRefreshToken(result.refreshToken);
      setExpirationDate(result.accessTokenExpirationDate);

      globalBankCode = getBankCode(result.accessToken);
      globalBankId = getBankId(result.accessToken);
      globalRole = getRole(result.accessToken);

      setIsLoading(false);
    } catch (error) {
      if (error instanceof Error &&
        (error.message === 'User cancelled' || error.message.includes('User cancelled flow'))) {
      } else {
        console.error('Change company failed:', error);
      }
      setIsLoading(false);
    }
  };

  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      if (refreshToken) {
        const result = await refresh(keycloakConfig as AuthConfiguration, {
          refreshToken: refreshToken,
        });
        setAccessToken(result.accessToken);
        globalAccessToken = result.accessToken;
        setIdToken(result.idToken);
        setRefreshToken(result.refreshToken);
        setExpirationDate(result.accessTokenExpirationDate);

        // Extract and store updated bank claims
        globalBankCode = getBankCode(result.accessToken);
        globalBankId = getBankId(result.accessToken);
        globalRole = getRole(result.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      signOut();
      return false;
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
