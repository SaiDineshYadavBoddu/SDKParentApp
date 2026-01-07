import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation } from '@react-navigation/native';
import RNOtpVerify from 'react-native-otp-verify';
import { useTheme } from '../../theme/ThemeProvider';
import { Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';
import CustomHeader from './CustomHeader';
import CustomText, { TextType } from './CustomText';
import CustomButton from './CustomButton';
import VerificationSVG from '../../assets/svgs/VerificationSVG';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GenericOTPScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const {
    headerTitle = '',
    title = 'otp.title',
    subtitle = 'otp.subtitle',
    target = '+91-XXXX-XXX23', // Default or from params
    onVerify,
    onResend,
    onBackPress,
    verifyButtonText = 'otp.verify',
    isLoading = false,
    initialError = false,
  } = route.params || {};

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(initialError);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (Platform.OS === 'android') {
      RNOtpVerify.getOtp()
        .then(() => RNOtpVerify.addListener(otpHandler))
        .catch((err) => console.log('OTP Verify Error:', err));

      return () => RNOtpVerify.removeListener();
    }
  }, []);

  const otpHandler = (message: string) => {
    const otpMatch = /(\d{6})/g.exec(message);
    if (otpMatch && otpMatch[1]) {
      const otpArray = otpMatch[1].split('');
      setOtp(otpArray);
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(false);

    // Auto-focus next field
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    // Auto-focus prev field on deletion
    if (!value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      onVerify?.(otpString);
    } else {
      setError(true);
    }
  };

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader
        title={headerTitle}
        onBackPress={handleBack}
        titleStyle={{ fontWeight: Typography.headlineMedium.fontWeight }}
      />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.topSection}>
                <View style={styles.iconContainer}>
                    <VerificationSVG stroke={colors.primary} width={ms(60)} height={ms(60)} />
                </View>
                <View style={{gap : Spacing.xs}}>
                    <CustomText type={TextType.ScreenHeadlineMedium} style={styles.title}>
                        {t(title)}
                    </CustomText>
                    <CustomText type={TextType.ScreenDisplaySmall} style={[styles.subtitle, { color: colors.secondaryText }]}>
                        {t(subtitle, { target })}
                    </CustomText>
                </View>
                </View>

                {error && (
                <CustomText type={TextType.Error} style={styles.errorText}>
                    {t('otp.error')}
                </CustomText>
                )}

                <View style={styles.otpSection}>
                    <View style={styles.otpContainer}>
                    
                    {otp.map((digit, index) => (
                        <TextInput
                        key={index}
                        ref={(ref) => {
                            inputRefs.current[index] = ref;
                        }}
                        style={[
                            styles.otpInput,
                            {
                            borderColor: error ? colors.error : colors.outline,
                            color: colors.onSurface,
                            backgroundColor: colors.surface,
                            },
                        ]}
                        maxLength={1}
                        keyboardType="number-pad"
                        value={digit}
                        onChangeText={(value) => handleOtpChange(value, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                        textAlign="center"
                        secureTextEntry={true}
                        selectionColor="transparent"
                        cursorColor={colors.primary}
                        selectTextOnFocus={false}
                    />
                    ))}
                    </View>

                    <TouchableOpacity onPress={onResend} style={styles.resendButton}>
                    <CustomText type={TextType.ActionLabel} style={styles.resendText}>
                        {t('otp.resend')}
                    </CustomText>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <View style={styles.bottomContainer}>
                <CustomButton
                title={t(verifyButtonText)}
                onPress={handleVerify}
                loading={isLoading}
                disabled={otp.join('').length < 6 || isLoading}
                uppercase={false}
                />
            </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.l,
    paddingBottom: ms(100),
    gap : Spacing.xl
  },
  topSection: {
    marginTop: Spacing.m,
    marginBottom: Spacing.xl,
    gap : Spacing.l
  },
  iconContainer: {
    marginBottom: Spacing.l,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    lineHeight: ms(20),
  },
  errorText: {
    textAlign: 'center',
    fontWeight : '500'
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  otpInput: {
    width: ms(45),
    height: ms(55),
    borderWidth: 1,
    borderRadius: ms(8),
    fontSize: ms(20),
    fontWeight: '600',
  },
  resendButton: {
    alignSelf: 'center',
    marginTop: Spacing.m,
  },
  resendText: {
    fontWeight: '500',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.l,
    paddingBottom: ms(24),
    backgroundColor: 'transparent',
  },
  otpSection:{
    gap : Spacing.m
  }
});
