import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ms } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomDropdown from '../../../common/components/CustomDropdown';
import CustomBottomSheet from '../../../common/components/CustomBottomSheet';
import CustomRadioButton from '../../../common/components/CustomRadioButton';
import CustomButton from '../../../common/components/CustomButton';
import CustomResultScreen from '../../../common/components/CustomResultScreen';
import FreezeCardSVG from '../../../assets/svgs/FreezeCardSVG';
import CustomBackButton from '../../../common/components/CustomBackButton';
import { FREEZE_CARD_REASONS } from '../../../constants/appConstants';
import CustomWarning from '../../../common/components/CustomWarning';
import CustomImage from '../../../common/components/CustomImage';
import CustomCardNumberDisplay from '../../../common/components/CustomCardNumberDisplay';
import { useBlockCardMutation } from '../../../network/card/card.api';
import CustomLoader from '../../../common/components/CustomLoader';

const FreezeCardScreen = () => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { card } = route.params || {};
    const insets = useSafeAreaInsets();
    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [selectedReason, setSelectedReason] = useState<string | undefined>(undefined);
    const [tempReason, setTempReason] = useState<string | undefined>(undefined);
    const [isSuccess, setIsSuccess] = useState(false);

    const [blockCard, { isLoading }] = useBlockCardMutation();

    const isPermanent = selectedReason && selectedReason !== 'Temp';
    const tempIsPermanent = tempReason && tempReason !== 'Temp';

    const handleConfirm = () => {
        setSelectedReason(tempReason);
        setBottomSheetVisible(false);
    };

    const handleSubmit = async () => {
        if (!card?.cardIdentifier || !selectedReason) return;
        try {
            await blockCard({ cardId: card.cardIdentifier, reason: selectedReason }).unwrap();
            setIsSuccess(true);
        } catch (error) {
            console.error('Failed to block card', error);
        }
    };

    if (isSuccess) {
        return (
            <CustomResultScreen
                title={t('freezeCard.successTitle')}
                subtitle={isPermanent ? t('freezeCard.successSubtitlePerm') : t('freezeCard.successSubtitleTemp')}
                iconName="check"
                buttonTitle={t('common.done')}
                onButtonPress={() => navigation.goBack()}
            />
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
            <View style={styles.header}>
                <CustomBackButton />
            </View>

            <CustomLoader loading={isLoading} />

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.iconContainer}>
                    <FreezeCardSVG width={ms(40)} height={ms(40)} color={colors.primary} />
                </View>
                <CustomText type={TextType.ScreenHeadlineMedium} style={styles.title}>
                    {t('freezeCard.title')}
                </CustomText>
                <CustomText type={TextType.ScreenDisplaySmall} style={styles.subtitle}>
                    {t('freezeCard.subtitle')}
                </CustomText>

                <CustomCardNumberDisplay maskedPan={card?.maskedPan} />

                <CustomDropdown
                    label={t('freezeCard.reasonLabel')}
                    placeholder={t('common.select')}
                    selectedValue={selectedReason ? t(`freezeCard.reasons.${selectedReason}`) : undefined}
                    onPress={() => {
                        setTempReason(selectedReason);
                        setBottomSheetVisible(true);
                    }}
                    containerStyle={styles.dropdown}
                />

                {selectedReason && (
                    <CustomWarning
                        style={{ marginTop: Spacing.m }}
                        message={isPermanent ? t('freezeCard.warningPerm') : t('freezeCard.warningTemp')}
                    />
                )}
            </ScrollView>

            <View style={[styles.bottomButtonContainer, { paddingBottom: Math.max(Spacing.l, insets.bottom) }]}>
                <CustomButton
                    title={t('common.submit')}
                    onPress={handleSubmit}
                    disabled={!selectedReason}
                    style={selectedReason ? styles.submitButtonActive : styles.submitButtonDisabled}
                />
            </View>

            <CustomBottomSheet
                visible={isBottomSheetVisible}
                onClose={() => setBottomSheetVisible(false)}
                title={t('freezeCard.title')}
            >
                <View style={styles.bottomSheetContent}>
                    {FREEZE_CARD_REASONS.map((reason) => (
                        <CustomRadioButton
                            key={reason}
                            label={t(`freezeCard.reasons.${reason}`)}
                            selected={tempReason === reason}
                            onPress={() => setTempReason(reason)}
                            containerStyle={[
                                styles.radioButton,
                                {
                                    borderColor: tempReason === reason ? colors.primary : colors.outline,
                                    borderWidth: tempReason === reason ? ms(1.5) : ms(1),
                                }
                            ]}
                        />
                    ))}

                    {tempReason && (
                        <CustomWarning
                            style={{ marginTop: Spacing.m, marginBottom: ms(24) }}
                            message={tempIsPermanent ? t('freezeCard.warningPerm') : t('freezeCard.warningTemp')}
                        />
                    )}

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

export default FreezeCardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Spacing.s,
    },
    header: {
        paddingTop: ms(20),
        paddingHorizontal: Spacing.m,
    },
    scrollContent: {
        paddingHorizontal: Spacing.m,
        paddingBottom: Spacing.xxl,
        paddingTop: ms(20),
    },
    iconContainer: {
        marginBottom: ms(20),
    },
    title: {
        marginBottom: ms(8),
    },
    subtitle: {
        marginBottom: ms(24),
    },
    dropdown: {
        marginBottom: ms(24),
    },
    bottomButtonContainer: {
        padding: Spacing.m,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
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
        // borderRadius: ms(12),
        // marginBottom: Spacing.m,
    },
    radioButton: {
        marginVertical: 0,
        height: ms(56),
        paddingHorizontal: Spacing.m,
        width: '100%',
        borderRadius: ms(12),
        marginBottom: Spacing.m,
    },
    confirmButton: {
        width: '100%',
    }
});
