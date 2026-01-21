import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ms } from 'react-native-size-matters';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomButton from '../../../common/components/CustomButton';
import CustomTextInput from '../../../common/components/CustomTextInput';
import CloseCardSVG from '../../../assets/svgs/CloseCardSVG';
import CustomResultScreen from '../../../common/components/CustomResultScreen';
import CustomWarning from '../../../common/components/CustomWarning';
import CustomCardNumberDisplay from '../../../common/components/CustomCardNumberDisplay';

import { useCloseCardMutation } from '../../../network/card/card.api';
import CustomLoader from '../../../common/components/CustomLoader';
import CustomHeader from '../../../common/components/CustomHeader';

const CloseCardScreen = () => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { card } = route.params || {};
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const [closeCard, { isLoading }] = useCloseCardMutation();

    const handleCloseCard = async () => {
        if (!card?.cardIdentifier) return;
        try {
            const body = message ? { comment: message } : {};
            const result = await closeCard({ cardId: card.cardIdentifier, body }).unwrap();
            if (result?.status === 'PENDING_APPROVAL') {
                setIsSuccess(true);
            }
        } catch (error) {
            console.error('Failed to close card', error);
        }
    };

    if (isSuccess) {
        return (
            <CustomResultScreen
                title={t('closeCard.successTitle')}
                subtitle={t('closeCard.successSubtitle')}
                iconName="check"
                buttonTitle={t('common.done')}
                onButtonPress={() => navigation.goBack()}
            />
        );
    }

    return (
        <View style={[styles.container, {
            backgroundColor: colors.background,
        }]}>
            <CustomHeader
                title={''}
                onBackPress={() => navigation.goBack()}
            />
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? ms(100) : 0}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                    <View style={styles.iconContainer}>
                        <CloseCardSVG width={ms(40)} height={ms(40)} color={colors.primary} />
                    </View>

                    <CustomText type={TextType.ScreenHeadlineMedium} style={styles.title}>
                        {t('closeCard.title')}
                    </CustomText>

                    <CustomText type={TextType.ScreenDisplaySmall} style={styles.subtitle}>
                        {t('closeCard.subtitle')}
                    </CustomText>

                    <CustomCardNumberDisplay maskedPan={card?.maskedPan} />

                    <CustomWarning message={t('closeCard.warning')} style={{ marginBottom: ms(24) }} />

                    <CustomTextInput
                        label={t('common.message')}
                        multiline
                        numberOfLines={4}
                        placeholder={t('closeCard.reasonPlaceholder')}
                        value={message}
                        onChangeText={setMessage}
                        inputStyle={{ height: ms(80), textAlignVertical: 'top' }}
                    />
                </ScrollView>
            </KeyboardAvoidingView>

            <View style={styles.footer}>
                <CustomButton
                    title={t('common.continue')}
                    onPress={handleCloseCard}
                    style={{ width: '100%' }}
                    uppercase={false}
                />
            </View>
            <CustomLoader loading={isLoading} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Spacing.s,
    },
    scrollContent: {
        paddingHorizontal: Spacing.m,
        paddingBottom: ms(120), // Accommodation for fixed footer
    },
    iconContainer: {
        marginTop: ms(20),
        marginBottom: ms(20),
    },
    title: {
        marginBottom: ms(8),
    },
    subtitle: {
        marginBottom: ms(24),
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: Spacing.l,
    },
});

export default CloseCardScreen;
