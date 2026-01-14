import React, { useEffect } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { View, StyleSheet } from 'react-native';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { SessionTimeoutProvider } from '../context/SessionTimeoutContext';
import { initializeNavigationRef, getCurrentRouteName, goBack } from '../utils/navigationRefUtils';
import { navigateToNoInternetScreen } from '../utils/navigationUtils';
import NoInternetToast from '../common/components/NoInternetToast';

const NavigationContent = () => {
  const { isAuthenticated, checkIsInternetConnected, isConnected } = useAuth();
  const navigationRef = useNavigationContainerRef();
  const [hasLaunchCheckPassed, setHasLaunchCheckPassed] = React.useState(false);

  useEffect(() => {
    checkIsInternetConnected();
  }, []);

  useEffect(() => {
    initializeNavigationRef(navigationRef);
  }, [navigationRef]);

  useEffect(() => {
    if (isConnected === true) {
      setHasLaunchCheckPassed(true);
    }
  }, [isConnected]);

  useEffect(() => {
    if (!navigationRef.isReady()) return;

    if (isConnected === false && !hasLaunchCheckPassed) {
      navigateToNoInternetScreen();
    } else if (isConnected === true && getCurrentRouteName() === 'GenericInfoScreen') {
      goBack();
    }
  }, [isConnected, hasLaunchCheckPassed, navigationRef, checkIsInternetConnected]);

  return (
    <View style={styles.container}>
      <NavigationContainer ref={navigationRef}>
        {isAuthenticated ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
      {hasLaunchCheckPassed && isConnected === false && (
        <View style={styles.toastOverlay}>
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
  },
  toastOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 10,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    zIndex: 9999,
  },
});

export default RootNavigator;
