import React from 'react';
import { Linking } from 'react-native';
import { ms } from 'react-native-size-matters';
import CustomImage from '../common/components/CustomImage';
import FailureSVG from '../assets/svgs/FailureSVG';
import { navigate, getNavigationRef } from './navigationRefUtils';

/**
 * Navigates to no internet connection screen
 */
export const navigateToNoInternetScreen = () => {
  navigate('GenericInfoScreen', {
    icon: React.createElement(CustomImage, {
      source: require('../assets/images/noInternet.gif'),
      style: { width: ms(160), height: ms(160) },
      resizeMode: 'contain',
    }),
    title: 'noInternet.title',
    description: 'noInternet.subtitle',
    primaryButton: {
      title: 'noInternet.primaryButton.title',
      onPress: () => { },
    },
    secondaryButton: {
      title: 'noInternet.secondaryButton.title',
      onPress: () => Linking.openSettings(),
    },
  });
};

/**
 * Navigates to server error screen when API returns 400 or 500 error
 */
export const navigateToServerErrorScreen = (onRetry?: () => void) => {
  const navigationRef = getNavigationRef();
  if (navigationRef?.isReady()) {
    navigate('GenericInfoScreen', {
      icon: React.createElement(FailureSVG, { width: ms(100), height: ms(100) }),
      title: 'serverError.title',
      description: 'serverError.description',
      primaryButton: {
        title: 'serverError.tryAgain',
        onPress: () => {
          if (onRetry) {
            onRetry();
          }
          if (navigationRef?.canGoBack()) {
            navigationRef.goBack();
          }
        },
      },
    });
  }
};

