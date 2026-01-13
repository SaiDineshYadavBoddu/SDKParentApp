import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ms } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import CustomText, { TextType } from './CustomText';
import WifiOffSVG from '../../assets/svgs/WifiOffSVG';
import { Spacing } from '../../theme/spacing';
import { useTheme } from '../../theme/ThemeProvider';

interface Props {
  visible: boolean;
  onRetry: () => void;
}

const NoInternetToast = ({ visible, onRetry }: Props) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  if (!visible) return null;

  return (
    <View style={[styles.container, { padding: Math.max(insets.bottom, Spacing.m), backgroundColor: colors.inverseSurface }]}>
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <WifiOffSVG color={colors.inverseOnSurface} />
          <View style={styles.textContainer}>
            <CustomText type={TextType.CardTitle} style={[styles.title, { color: colors.inverseOnSurface }]}>
              {t('noInternet.toast.title')}
            </CustomText>
            <CustomText type={TextType.CardSubtitle} style={{ color: colors.inverseOnSurface }}>
              {t('noInternet.toast.subtitle')}
            </CustomText>
          </View>
        </View>
        <TouchableOpacity onPress={onRetry}>
          <CustomText type={TextType.ActionLabel} style={[styles.retryButton, { color: colors.inversePrimary }]}>
            {t('noInternet.toast.primaryButton')}
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.m,
    zIndex: 1000,
    margin: ms(16),
    borderRadius: ms(8),
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.s,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.s,
    flex: 1,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: '600',
    marginBottom: 2,
  },
  retryButton: {
    fontWeight: '600',
  },
});

export default NoInternetToast;
