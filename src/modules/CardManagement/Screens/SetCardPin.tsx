import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ms } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';

import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomHeader from '../../../common/components/CustomHeader';
import CustomTextInput from '../../../common/components/CustomTextInput';
import CustomButton from '../../../common/components/CustomButton';
import CustomIcon from '../../../common/components/CustomIcon';
import ResetPinSVG from '../../../assets/svgs/ResetPinSVG';
import { Spacing } from '../../../theme/spacing';
import { useTheme } from '../../../theme/ThemeProvider';
import SuccessSVG from '../../../assets/svgs/SuccessSVG';
import FailureSVG from '../../../assets/svgs/FailureSVG';
import { useSecondaryAuth } from '../../../hooks/useSecondaryAuth';
import { useChangePin, useSetPin, type NIErrorResponse, NIThemeEnum } from '@networkinternational/ni-card-management-sdk'
import { useAuth } from '../../../context/AuthContext';
import { TEST_INPUT } from '../../../config/NISDKConfig';

const SetCardPin = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { card } = route.params || {};
  const { colors } = useTheme();
  const { accessToken } = useAuth();
  // const {onChangePin, isLoading: isChangingPin} = useChangePin()
  const { result, error, onSetPin, isLoading: isSettingPin } = useSetPin();
  console.log('NI SDK result:', result);
  console.log('NI SDK error:', error);
  const { startAuthFlow } = useSecondaryAuth();
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const [errors, setErrors] = useState({
    mismatch: '',
    newPin: '',
    confirmPin: '',
  });

  const validateNewPin = (text: string, currentConfirmPin: string) => {
    let newPinError = '';
    let mismatchError = '';

    if (text.length > 0 && text.length < 4) {
      newPinError = t('setPin.errorShort');
    } else if (currentConfirmPin.length === 4 && text.length === 4 && text !== currentConfirmPin) {
      mismatchError = t('setPin.errorMismatch');
    }

    setErrors(prev => ({
      ...prev,
      newPin: newPinError,
      mismatch: mismatchError
    }));
  };

  const validateConfirmPin = (text: string, currentNewPin: string) => {
    let confirmError = '';
    let mismatchError = '';

    if (text.length > 0 && text.length < 4) {
      confirmError = t('setPin.errorShort');
    } else if (text.length === 4 && currentNewPin.length === 4 && text !== currentNewPin) {
      mismatchError = t('setPin.errorMismatch');
    }

    setErrors(prev => ({
      ...prev,
      confirmPin: confirmError,
      mismatch: mismatchError
    }));
  };

  const handleUpdateCardPIN = (cardIdentifierId: string) => {
    return new Promise<void>((resolve, reject) => {
      if (!accessToken) {
        console.warn('No access token available for fetching card details');
        reject(new Error('No access token'));
        return;
      }

      console.log('accessToken', accessToken);
      console.log('cardIdentifierId', cardIdentifierId);
      console.log('pin', confirmPin);
      console.log('input', TEST_INPUT(accessToken, cardIdentifierId));
      onSetPin(
        confirmPin,
        TEST_INPUT(accessToken, cardIdentifierId),
        (error: NIErrorResponse | null, result: string | null) => {
          console.log('NI SDK set PIN error:', error);
          console.log('NI SDK set PIN result:', result);
          if (error) {
            navigation.navigate('GenericInfoScreen', {
              icon: <FailureSVG />,
              title: error.message || 'setPin.failureMessage',
              description: 'common.tryAgain',
              primaryButton: {
                title: 'common.tryAgain',
                onPress: () => navigation.goBack(),
              },
            });
            reject(error);
          } else {
            navigation.navigate('GenericInfoScreen', {
              icon: <SuccessSVG />,
              title: 'common.success',
              description: 'setPin.successMessage',
              primaryButton: {
                title: 'common.ok',
                onPress: () => navigation.navigate('ManageCard'),
              },
            });
            resolve();
          }
        },
      );
    });
  };

  const handleContinue = () => {
    if (newPin.length === 4 && confirmPin.length === 4 && newPin === confirmPin) {
      startAuthFlow({
        onSuccess: async () => {
          await handleUpdateCardPIN(card?.cardIdentifier);
        },
        externalLoading: isSettingPin,
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <CustomHeader
          title=""
          onBackPress={() => navigation.goBack()}
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
            <View style={styles.headerSection}>
              <ResetPinSVG width={ms(48)} height={ms(48)} />
              <CustomText type={TextType.ScreenHeadlineMedium}>
                {t('setPin.title')}
              </CustomText>
              <CustomText type={TextType.CardText} style={[styles.description, { color: colors.secondaryText }]}>
                {t('setPin.description')}
              </CustomText>
            </View>

            {errors.mismatch ? (
              <View style={styles.mismatchErrorContainer}>
                <CustomText type={TextType.Error} style={styles.mismatchErrorText}>
                  {errors.mismatch}
                </CustomText>
              </View>
            ) : null}

            <View style={styles.formSection}>
              <CustomTextInput
                label={t('setPin.enterNewPin')}
                value={newPin}
                onChangeText={(text) => {
                  const numericText = text.replace(/[^0-9]/g, '');
                  setNewPin(numericText);
                  validateNewPin(numericText, confirmPin);
                }}
                placeholder="****"
                secureTextEntry={!showNewPin}
                keyboardType="numeric"
                maxLength={4}
                error={errors.newPin}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowNewPin(!showNewPin)}>
                    <CustomIcon
                      type="feather"
                      name={showNewPin ? 'eye' : 'eye-off'}
                      size={ms(20)}
                      color={colors.outline}
                    />
                  </TouchableOpacity>
                }
              />

              <CustomTextInput
                label={t('setPin.confirmNewPin')}
                value={confirmPin}
                onChangeText={(text) => {
                  const numericText = text.replace(/[^0-9]/g, '');
                  setConfirmPin(numericText);
                  validateConfirmPin(numericText, newPin);
                }}
                placeholder="****"
                secureTextEntry={!showConfirmPin}
                keyboardType="numeric"
                maxLength={4}
                error={errors.confirmPin}
                rightIcon={
                  <TouchableOpacity onPress={() => setShowConfirmPin(!showConfirmPin)}>
                    <CustomIcon
                      type="feather"
                      name={showConfirmPin ? 'eye' : 'eye-off'}
                      size={ms(20)}
                      color={colors.outline}
                    />
                  </TouchableOpacity>
                }
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={[styles.footer, { backgroundColor: colors.background }]}>
          <CustomButton
            title={t('common.continue')}
            onPress={handleContinue}
            uppercase={false}
            disabled={newPin.length !== 4 || confirmPin.length !== 4 || newPin !== confirmPin}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.l,
    paddingBottom: ms(120), // Support fixed footer
    gap: Spacing.xl,
  },
  headerSection: {
    marginTop: Spacing.m,
    marginBottom: Spacing.xl,
    gap: Spacing.xl
  },
  description: {
    lineHeight: ms(20),
  },
  mismatchErrorContainer: {
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
  mismatchErrorText: {
    textAlign: 'center',
  },
  formSection: {
    gap: Spacing.l,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.l,
  },
});

export default SetCardPin;
