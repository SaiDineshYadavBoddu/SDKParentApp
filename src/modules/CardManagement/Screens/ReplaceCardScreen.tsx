import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ms } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomIcon from '../../../common/components/CustomIcon';
import CustomDropdown from '../../../common/components/CustomDropdown';
import CustomBottomSheet from '../../../common/components/CustomBottomSheet';
import CustomRadioButton from '../../../common/components/CustomRadioButton';
import CustomButton from '../../../common/components/CustomButton';
import CustomResultScreen from '../../../common/components/CustomResultScreen';
import CurrencySVG from '../../../assets/svgs/CurrencySVG';
import ReplaceCardScreenSVG from '../../../assets/svgs/ReplaceCardScreenSVG';
import CustomBackButton from '../../../common/components/CustomBackButton';
import { REPLACE_CARD_REASONS } from '../../../constants/appConstants';
import CustomWarning from '../../../common/components/CustomWarning';


const ReplaceCardScreen = () => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [selectedReason, setSelectedReason] = useState<string | undefined>("");
    const [tempReason, setTempReason] = useState<string | undefined>("");
    const [isSuccess, setIsSuccess] = useState(false);

    const handleConfirm = () => {
        setSelectedReason(tempReason);
        setBottomSheetVisible(false);
    };

    const handleSubmit = () => {
        setIsSuccess(true);
    };

    if (isSuccess) {
        return (
            <CustomResultScreen
                title={t('replaceCard.successTitle')}
                subtitle={t('replaceCard.successSubtitle')}
                iconName="check"
                buttonTitle={t('common.done')}
                onButtonPress={() => navigation.goBack()}
            />
        );
    }

    return (
        <View style={[styles.container, {
            backgroundColor: colors.background,
            paddingTop: Math.max(ms(20), insets.top), // Ensure minimum padding or safe area
            paddingHorizontal: Spacing.l
        }]}>
            <View style={styles.header}>
                <CustomBackButton style={styles.backButton} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.iconContainer}>
                    <ReplaceCardScreenSVG width={ms(48)} height={ms(48)} color={colors.primary} />
                </View>
                <CustomText type={TextType.ScreenHeadlineSmall} style={styles.title}>
                    {t('replaceCard.title')}
                </CustomText>
                <CustomText type={TextType.CardText} style={styles.subtitle}>
                    {t('replaceCard.description')}
                </CustomText>

                <CustomDropdown
                    label={t('replaceCard.selectReasonForReplacement')}
                    placeholder={t('common.select')}
                    selectedValue={selectedReason ? t(`replaceCard.reasons.${selectedReason}`) : undefined}
                    onPress={() => {
                        setTempReason(selectedReason);
                        setBottomSheetVisible(true);
                    }}
                    containerStyle={styles.dropdown}
                />

                {selectedReason && (
                    <CustomWarning>
                        <CustomText type={TextType.CardText} style={styles.infoText}>
                            {t('replaceCard.feePrefix')}
                            <CurrencySVG width={ms(18)} height={ms(10)} color="#856404" />
                            {t('replaceCard.feeSuffix')}
                        </CustomText>
                    </CustomWarning>
                )}
            </ScrollView>

            <View style={[styles.bottomButtonContainer, { paddingBottom: Math.max(ms(60), insets.bottom + Spacing.l) }]}>
                <CustomButton
                    title={t('replaceCard.submit')}
                    onPress={handleSubmit}
                    disabled={!selectedReason}
                    style={selectedReason ? styles.submitButtonActive : styles.submitButtonDisabled}
                />
            </View>

            <CustomBottomSheet
                visible={isBottomSheetVisible}
                onClose={() => setBottomSheetVisible(false)}
                title={t('replaceCard.selectReason')}
            >
                <View style={styles.bottomSheetContent}>
                    {REPLACE_CARD_REASONS.map((reason) => (
                        <View
                            key={reason}
                            style={[
                                styles.radioItemContainer,
                                {
                                    borderColor: tempReason === reason ? colors.primary : '#E0E0E0',
                                    borderWidth: tempReason === reason ? ms(1) : ms(0.5),
                                }
                            ]}
                        >
                            <CustomRadioButton
                                label={t(`replaceCard.reasons.${reason}`)}
                                selected={tempReason === reason}
                                onPress={() => setTempReason(reason)}
                                containerStyle={styles.radioButton}
                            />
                        </View>
                    ))}

                    <CustomWarning style={{ marginTop: Spacing.m, marginBottom: ms(24) }}>
                        <CustomText type={TextType.CardText} style={styles.infoText}>
                            {t('replaceCard.feeAmount')}
                        </CustomText>
                    </CustomWarning>

                    <CustomButton
                        title={t('common.confirm')}
                        onPress={handleConfirm}
                        disabled={!tempReason}
                        style={styles.confirmButton}
                    />
                </View>
            </CustomBottomSheet>
        </View>
    );
};

export default ReplaceCardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        // Padding handled by container
    },
    backButton: {
        width: ms(40),
        height: ms(40),
        justifyContent: 'center',
    },
    scrollContent: {
        paddingTop: Spacing.m,
        paddingBottom: Spacing.xl,
    },
    iconContainer: {
        marginBottom: Spacing.m,
    },
    title: {
        fontSize: ms(24),
        fontWeight: 'bold',
        marginBottom: Spacing.xs,
    },
    subtitle: {
        color: '#757575',
        marginBottom: ms(32),
    },
    dropdown: {
        marginBottom: ms(24),
    },
    // Removed infoBox, bottomSheetInfoBox, infoIcon as they are replaced by CustomWarning styles
    infoText: {
        flex: 1,
        color: '#856404',
        lineHeight: ms(18),
    },
    bottomButtonContainer: {
        paddingTop: Spacing.l,
        // Padding bottom handled dynamically in style prop or add safe area here if strictly using style
    },
    submitButtonActive: {
        backgroundColor: '#0169B2',
    },
    submitButtonDisabled: {
        backgroundColor: '#E0E0E0',
    },
    bottomSheetContent: {
        width: '100%',
    },
    radioItemContainer: {
        borderRadius: ms(12),
        marginBottom: Spacing.m,
        paddingHorizontal: Spacing.m,
        height: ms(56),
        justifyContent: 'center',
    },
    radioButton: {
        marginVertical: 0,
    },
    confirmButton: {
        width: '100%',
    }
});