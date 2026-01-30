import React, { useEffect } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { Linking, StyleSheet, View, BackHandler, Alert } from 'react-native';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../context/AuthContext';
import CustomImage from '../common/components/CustomImage';
import { ms } from 'react-native-size-matters';

import NoInternetToast from '../common/components/NoInternetToast';
import { SessionTimeoutProvider } from '../context/SessionTimeoutContext';
import { navigateToNoInternetScreen } from '../utils/navigationUtils';
import { initializeNavigationRef, getCurrentRouteName, goBack } from '../utils/navigationRefUtils';
import ScreenWrapper from '../common/components/ScreenWrapper';
import { useTheme } from '../theme/ThemeProvider';
import CustomWarning from '../common/components/CustomWarning';
import AccessRestrictedScreen from '../modules/Authentication/Screens/AccessRestrictedScreen';
import { Spacing } from '../theme/spacing';
import CustomLoader from '../common/components/CustomLoader';

const NavigationContent = () => {
  const { isAuthenticated, checkIsInternetConnected, isConnected, sessionExpired, setSessionExpired, isCardholder, signOut, isLoading } = useAuth();
  const navigationRef = useNavigationContainerRef();
  const { colors } = useTheme();
  const [hasLaunchCheckPassed, setHasLaunchCheckPassed] = React.useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    checkIsInternetConnected();
    initializeNavigationRef(navigationRef);
  }, [navigationRef]);

  useEffect(() => {
    if (isConnected === true) setHasLaunchCheckPassed(true);

    if (!navigationRef.isReady()) return;

    if (isConnected === false && !hasLaunchCheckPassed) {
      navigateToNoInternetScreen();
    } else if (isConnected === true && (getCurrentRouteName() === 'GenericInfoScreen' || getCurrentRouteName() === 'AuthInfoScreen')) {
      goBack();
    }
  }, [isConnected, hasLaunchCheckPassed, navigationRef]);

  useEffect(() => {
    const onBackPress = () => {
      if (!navigationRef.isReady()) return false;

      if (!navigationRef.canGoBack()) {
        Alert.alert(
          'Exit App',
          'Are you sure you want to close the app?', // Use translation if available, but hardcoded for now as requested
          [
            { text: 'Cancel', onPress: () => null, style: 'cancel' },
            { text: 'OK', onPress: () => signOut() },
          ]
        );
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => subscription.remove();
  }, [navigationRef]);

  useEffect(() => {
    if (sessionExpired) {
      const timer = setTimeout(() => {
        setSessionExpired(false);
      }, 5000); // Hide toast after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [sessionExpired, setSessionExpired]);

  const renderMainContent = () => {
    if (isLoading) {
      // Return null or a simple View during loading to prevent stacks from mounting/flashing
      return (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background }]} />
      );
    }
    if (isAuthenticated) {
      if (!isCardholder) {
        return <AccessRestrictedScreen />;
      }
      return <MainStack />;
    }
    return <AuthStack />;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <NavigationContainer ref={navigationRef}>
        <ScreenWrapper edges={['bottom']}>
          {renderMainContent()}
        </ScreenWrapper>
      </NavigationContainer>
      {hasLaunchCheckPassed && isConnected === false && (
        <View style={[styles.toastOverlay, { paddingBottom: insets.bottom }]}>
          <NoInternetToast visible={true} onRetry={checkIsInternetConnected} />
        </View>
      )}
      {sessionExpired && (
        <View style={styles.sessionExpiredToast}>
          <CustomWarning
            message="Session expired, signing out"
          />
        </View>
      )}
      <CustomLoader
        loading={isLoading}
        overlayStyle={{ backgroundColor: colors.background, opacity: 1 }}
      />
    </View>
  );
};

const RootNavigator = () => {
  return (
    <AuthProvider>
      <SessionTimeoutProvider>
        <NavigationContent />
      </SessionTimeoutProvider>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  toastOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    zIndex: 9999,
    justifyContent: 'flex-end',
  },
  sessionExpiredToast: {
    position: 'absolute',
    bottom: ms(40),
    left: Spacing.m,
    right: Spacing.m,
    zIndex: 10000,
  },
});

export default RootNavigator;
