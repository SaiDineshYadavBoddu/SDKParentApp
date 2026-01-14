import React from 'react';
import { Linking } from 'react-native';
import { ms } from 'react-native-size-matters';
import CustomImage from '../common/components/CustomImage';
import FailureSVG from '../assets/svgs/FailureSVG';
import { Typography } from '../theme/typography';
import { navigate, getNavigationRef } from './navigationRefUtils';
import i18next from 'i18next';

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
    title: i18next.t('noInternet.title'),
    description: i18next.t('noInternet.subtitle'),
    primaryButton: {
      title: i18next.t('noInternet.primaryButton.title'),
      onPress: () => {},
    },
    secondaryButton: {
      title: i18next.t('noInternet.secondaryButton.title'),
      onPress: () => Linking.openSettings(),
    },
  });
};

/**
 * Navigates to server error screen when API returns 500 error
 */
export const navigateToServerErrorScreen = () => {
  const navigationRef = getNavigationRef();
  if (navigationRef?.isReady()) {
    navigate('GenericInfoScreen', {
      icon: React.createElement(FailureSVG, { width: ms(80), height: ms(80) }),
      title: i18next.t('serverError.title'),
      description: i18next.t('serverError.description'),
      primaryButton: {
        title: i18next.t('serverError.tryAgain'),
        onPress: () => {
          if (navigationRef?.canGoBack()) {
            navigationRef.goBack();
          }
        },
      },
    });
  }
};

