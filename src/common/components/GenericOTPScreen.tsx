import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
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
import { useSendOtpTokenMutation, useVerifyOtpTokenMutation } from '../../network/otp/otp.api';
import CustomLoader from './CustomLoader';

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
    useInternalOtp = false,
    onVerifySuccess,
    type,
  } = route.params || {};

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpTokenMutation();
  const [sendOtp, { isLoading: isResending }] = useSendOtpTokenMutation();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState(initialError);
  const [timer, setTimer] = useState(route.params?.retryAfter || 0);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // console.log('GenericOTPScreen Focused. Params retryAfter:', route.params?.retryAfter);
  //     // console.log('Current Timer State:', timer);

  //     if (route.params?.retryAfter !== undefined) {
  //       // console.log('Resetting timer to:', route.params.retryAfter);
  //       setTimer(route.params.retryAfter);
  //     } else {
  //       //  console.log('Resetting timer to 0 (params undefined)');
  //        setTimer(0);
  //     }
  //   }, [route.params?.retryAfter])
  // );

  useEffect(() => {
    if (Platform.OS === 'android') {
      RNOtpVerify.getOtp()
        .then(() => RNOtpVerify.addListener(otpHandler))
        .catch((err) => console.log('OTP Verify Error:', err));

      return () => RNOtpVerify.removeListener();
    }
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev: number) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timer]);

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

  const [localLoading, setLocalLoading] = useState(false);
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      setLocalLoading(true);
      try {
        if (useInternalOtp) {
          await verifyOtp({ code: otpString, type }).unwrap();
          await onVerifySuccess?.();
        } else {
          await onVerify?.(otpString);
        }
      } catch (err) {
        console.error('Verification failed:', err);
        setError(true);
      } finally {
        setLocalLoading(false);
      }
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <CustomHeader
          title={headerTitle}
          onBackPress={handleBack}
          titleStyle={{ fontWeight: Typography.headlineMedium.fontWeight }}
        />
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? ms(100) : 0}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.topSection}>
              <View style={styles.iconContainer}>
                <VerificationSVG stroke={colors.primary} width={ms(60)} height={ms(60)} />
              </View>
              <View style={{ gap: Spacing.xs }}>
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

              {timer > 0 ? (
                <View style={styles.resendButton}>
                  <CustomText type={TextType.ActionLabel} style={[styles.resendText, { color: colors.secondaryText }]}>
                    {t('otp.resendTimer', { seconds: timer })}
                  </CustomText>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={async () => {
                    if (useInternalOtp) {
                      try {
                        const response = await sendOtp({ type }).unwrap();
                        if (response?.tryAgainIn) {
                          setTimer(response.tryAgainIn);
                        }
                      } catch (err) {
                        console.error('Resend failed:', err);
                      }
                    } else {
                      const response = await onResend?.();
                      if (response?.tryAgainIn) {
                        setTimer(response.tryAgainIn);
                      }
                    }
                  }}
                  style={styles.resendButton}
                  disabled={isResending}
                >
                  <CustomText type={TextType.ActionLabel} style={[styles.resendText, { color: isResending ? colors.outline : colors.primary }]}>
                    {t('otp.resend')}
                  </CustomText>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={styles.bottomContainer}>
          <CustomButton
            title={t(verifyButtonText)}
            onPress={handleVerify}
            disabled={otp.join('').length < 6 || isLoading || localLoading || isVerifying}
            uppercase={false}
          />
        </View>
        <CustomLoader loading={isLoading || localLoading || isVerifying} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: Spacing.l,
      paddingBottom: ms(120), // Support fixed footer
      gap: Spacing.xl
    },
    topSection: {
      marginTop: Spacing.m,
      marginBottom: Spacing.xl,
      gap: Spacing.l
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
      fontWeight: '500'
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
      backgroundColor: 'transparent',
    },
    otpSection: {
      gap: Spacing.m
    }
  });
