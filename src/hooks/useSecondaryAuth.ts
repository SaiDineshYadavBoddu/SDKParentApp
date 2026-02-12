import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';
import { useSendOtpTokenMutation, useVerifyOtpTokenMutation } from '../network/otp/otp.api';

export interface SecondaryAuthOptions {
    onSuccess: (token: string) => Promise<void>;
    selectionTitle?: string;
    selectionSubtitle?: string;
    otpTitle?: string;
    otpSubtitle?: string;
    externalLoading?: boolean;
    skipNavigationOnSuccess?: boolean;
}

export const useSecondaryAuth = () => {
    const navigation = useNavigation<any>();
    const { t } = useTranslation();
    const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpTokenMutation();
    const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpTokenMutation();

    const handleVerifyOtp = async (code: string, type: 'EMAIL' | 'PHONE', options: SecondaryAuthOptions) => {
        try {
            const response = await verifyOtp({ code, type }).unwrap() as any;
            const token = response?.token || response?.authorizationToken || '';
            await options.onSuccess(token);
            if (!options.skipNavigationOnSuccess) {
                navigation.pop(2);
            }
        } catch (error: any) {
            console.error('OTP Verification failed:', error);
            // Alert.alert(t('common.error'), error?.data?.errorMessage || t('otp.invalidCode'));
            throw error;
        }
    };

    const handleSendOtp = async (type: 'EMAIL' | 'PHONE', maskedValue: string, options: SecondaryAuthOptions) => {
        try {
            const response = await sendOtp({ type }).unwrap();
            navigation.navigate('GenericOTPScreen', {
                title: options.otpTitle || 'otp.title',
                subtitle: options.otpSubtitle || 'otp.subtitle',
                target: maskedValue,
                onVerify: (code: string) => handleVerifyOtp(code, type, options),
                onResend: () => handleSendOtp(type, maskedValue, options),
                isLoading: isVerifyingOtp || options.externalLoading,
                retryAfter: response?.tryAgainIn,
            });
            return response;
        } catch (error) {
            console.error('Failed to send OTP:', error);
            Alert.alert(t('common.error'), t('otp.sendError'));
            throw error;
        }
    };

    const startAuthFlow = (options: SecondaryAuthOptions) => {
        navigation.navigate('GenericSelectionScreen', {
            headerTitle: '',
            title: options.selectionTitle || 'otp.selectionTitle',
            subtitle: options.selectionSubtitle || 'otp.selectionSubtitle',
            onContinue: (option: any) => {
                const type = option.id.toUpperCase() as 'EMAIL' | 'PHONE';
                return handleSendOtp(type, option.subtitle || '', options);
            },
            isLoading: isSendingOtp || options.externalLoading,
        });
    };

    return {
        startAuthFlow,
        isSendingOtp,
        isVerifyingOtp,
    };
};
