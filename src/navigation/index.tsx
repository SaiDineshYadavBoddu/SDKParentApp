import React, { useEffect } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { Linking, StyleSheet, View } from 'react-native';
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

const NavigationContent = () => {
  const { isAuthenticated, checkIsInternetConnected, isConnected } = useAuth();
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
    } else if (isConnected === true && getCurrentRouteName() === 'GenericInfoScreen') {
      goBack();
    }
  }, [isConnected, hasLaunchCheckPassed, navigationRef]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <NavigationContainer ref={navigationRef}>
        <ScreenWrapper edges={['bottom']}>
          {isAuthenticated ? <MainStack /> : <AuthStack />}
        </ScreenWrapper>
      </NavigationContainer>
      {hasLaunchCheckPassed && isConnected === false && (
        <View style={[styles.toastOverlay, { paddingBottom: insets.bottom }]}>
          <NoInternetToast visible={true} onRetry={checkIsInternetConnected} />
        </View>
      )}
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
});

export default RootNavigator;
