import React, { useCallback, useState } from 'react';
import { NativeSyntheticEvent, StyleSheet, View } from 'react-native';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import CustomHeader from '../../../common/components/CustomHeader';
import { useTheme } from '../../../theme/ThemeProvider';
import {
  BnplEventPayload,
  BnplLauncher,
  closeMintCreditSdk,
  mintCreditSdkConfig,
} from '../../../native/mintCreditSdk';

const LOG_TAG = '[BNPL]';

const BnplScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const [screenTitle, setScreenTitle] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
      console.log(`${LOG_TAG} focused, mounting BnplLauncher`);
      return () => {
        console.log(`${LOG_TAG} blurred, closing SDK`);
        closeMintCreditSdk();
        setScreenTitle(null);
      };
    }, []),
  );

  const onBnplEvent = useCallback(
    ({ nativeEvent }: NativeSyntheticEvent<BnplEventPayload>) => {
      console.log(`${LOG_TAG} event`, JSON.stringify(nativeEvent));
      switch (nativeEvent.type) {
        case 'result':
          if (nativeEvent.outcome?.screen) {
            setScreenTitle(nativeEvent.outcome.screen);
          }
          break;
        case 'dismissed':
          navigation.navigate('My Cards');
          break;
        case 'error':
          console.error(`${LOG_TAG} error ${nativeEvent.error?.code}: ${nativeEvent.error?.message}`);
          break;
      }
    },
    [navigation],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader
        title={screenTitle ?? 'cardList.bnpl'}
        rawTitle={screenTitle != null}
        onBackPress={() => navigation.navigate('My Cards')}
      />
      <View
        style={[styles.content, { backgroundColor: colors.background }]}
        onLayout={({ nativeEvent }) =>
          console.log(`${LOG_TAG} launcher area ${nativeEvent.layout.width}x${nativeEvent.layout.height}`)
        }
      >
        {isFocused && (
          <BnplLauncher
            config={mintCreditSdkConfig}
            style={styles.content}
            onBnplEvent={onBnplEvent}
          />
        )}
      </View>
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
