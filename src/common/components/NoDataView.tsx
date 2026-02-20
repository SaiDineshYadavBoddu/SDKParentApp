import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ms } from 'react-native-size-matters';
import { useTheme } from '../../theme/ThemeProvider';
import CustomText, { TextType } from './CustomText';
import NoDataSVG from '../../assets/svgs/NoDataSVG';

interface NoDataViewProps {
  title?: string;
  description?: string;
  style?: StyleProp<ViewStyle>;
}

export default function NoDataView({
  title,
  description,
  style,
}: NoDataViewProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <View style={[styles.container, style]}>
      <NoDataSVG width={ms(120)} height={ms(120)} />
      <CustomText
        type={TextType.ScreenHeadlineMedium}
        style={[styles.title, { color: colors.onBackground }]}
      >
        {title ?? t('common.noDataAvailable')}
      </CustomText>
      <CustomText
        type={TextType.ScreenDisplaySmall}
        style={[styles.description, { color: colors.secondaryText }]}
      >
        {description ?? t('common.noDataDescription')}
      </CustomText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: ms(48),
    paddingHorizontal: ms(24),
  },
  title: {
    textAlign: 'center',
    marginTop: ms(24),
  },
  description: {
    textAlign: 'center',
    marginTop: ms(12),
    paddingHorizontal: ms(16),
  },
});
