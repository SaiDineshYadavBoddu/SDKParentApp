import React, { useCallback, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomHeader from '../../../common/components/CustomHeader';
import { useTheme } from '../../../theme/ThemeProvider';
import {
  MINT_CREDIT_DISMISSED_EVENT,
  MINT_CREDIT_SCREEN_EVENT,
  addMintCreditSdkListener,
  closeMintCreditSdk,
  goBackMintCreditSdk,
  openMintCreditSdk,
  updateMintCreditSdkInsets,
} from '../../../native/mintCreditSdk';

const TAB_BAR_HEIGHT = 60;

const BnplScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const headerHeightRef = useRef(0);
  const openedRef = useRef(false);
  const [screenTitle, setScreenTitle] = useState<string | null>(null);
  const footerHeight = TAB_BAR_HEIGHT + insets.bottom;

  const showSdk = useCallback((headerHeight: number) => {
    if (headerHeight <= 0) {
      return;
    }
    if (openedRef.current) {
      updateMintCreditSdkInsets(headerHeight, footerHeight);
      return;
    }
    openedRef.current = true;
    openMintCreditSdk(headerHeight, footerHeight);
  }, [footerHeight]);

  useFocusEffect(
    useCallback(() => {
      showSdk(headerHeightRef.current);
      const titleSubscription = addMintCreditSdkListener(MINT_CREDIT_SCREEN_EVENT, event => {
        if (event?.title) {
          setScreenTitle(event.title);
        }
      });
      const dismissSubscription = addMintCreditSdkListener(MINT_CREDIT_DISMISSED_EVENT, () => {
        navigation.navigate('My Cards');
      });
      return () => {
        titleSubscription.remove();
        dismissSubscription.remove();
        openedRef.current = false;
        closeMintCreditSdk();
        setScreenTitle(null);
      };
    }, [navigation, showSdk]),
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View
        onLayout={event => {
          const nextHeight = event.nativeEvent.layout.height;
          headerHeightRef.current = nextHeight;
          if (isFocused) {
            showSdk(nextHeight);
          }
        }}
      >
        <CustomHeader
          title={screenTitle ?? 'cardList.bnpl'}
          rawTitle={screenTitle != null}
          onBackPress={goBackMintCreditSdk}
        />
      </View>
      <View style={[styles.content, { backgroundColor: colors.background }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});

export default BnplScreen;
