import React from 'react';
import { View, StyleSheet, Dimensions, BackHandler } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/ThemeProvider';
import CustomText, { TextType } from './CustomText';
import CustomButton from './CustomButton';
import WarningSVG from '../../assets/svgs/WarningSVG';
import { moderateScale } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

const DeviceInsecureScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const handleExit = () => {
    BackHandler.exitApp();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.contentContainer}>
        <WarningSVG width={width * 0.25} height={width * 0.25} />
        <View style={styles.textContainer}>
          <CustomText type={TextType.ScreenHeadlineMedium} style={styles.title}>
            {t('deviceSecurity.insecureTitle')}
          </CustomText>
          <CustomText type={TextType.ScreenDisplayMedium} style={styles.description}>
            {t('deviceSecurity.insecureMessage')}
          </CustomText>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <CustomButton title={t('deviceSecurity.exitApp')} uppercase={false} onPress={handleExit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(20),
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    marginTop: moderateScale(30),
    alignItems: 'center',
    gap: moderateScale(10),
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    paddingHorizontal: moderateScale(20),
  },
  buttonContainer: {
    paddingBottom: moderateScale(20),
    width: '100%',
  },
});

export default DeviceInsecureScreen;
