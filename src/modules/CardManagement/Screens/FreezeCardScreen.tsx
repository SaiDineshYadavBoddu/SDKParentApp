import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, ScrollView } from 'react-native';
import { ms } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomDropdown from '../../../common/components/CustomDropdown';
import CustomBottomSheet from '../../../common/components/CustomBottomSheet';
import CustomRadioButton from '../../../common/components/CustomRadioButton';
import CustomButton from '../../../common/components/CustomButton';
import FreezeCardSVG from '../../../assets/svgs/FreezeCardSVG';
import SuccessSVG from '../../../assets/svgs/SuccessSVG';
import FailureSVG from '../../../assets/svgs/FailureSVG';
import { FREEZE_CARD_REASONS } from '../../../constants/appConstants';
import CustomWarning from '../../../common/components/CustomWarning';
import CustomCardNumberDisplay from '../../../common/components/CustomCardNumberDisplay';
import { useBlockCardMutation } from '../../../network/card/card.api';
import CustomLoader from '../../../common/components/CustomLoader';
import CustomHeader from '../../../common/components/CustomHeader';

const FreezeCardScreen = () => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation<any>();
    const route = useRoute<any>();
    const { card } = route.params || {};
    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [selectedReason, setSelectedReason] = useState<string | undefined>(undefined);
    const [tempReason, setTempReason] = useState<string | undefined>(undefined);

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
            navigation.navigate('GenericInfoScreen', {
                icon: <SuccessSVG />,
                title: 'freezeCard.successTitle',
                description: isPermanent ? 'freezeCard.successSubtitlePerm' : 'freezeCard.successSubtitleTemp',
                primaryButton: {
                    title: 'common.done',
                    onPress: () => navigation.navigate('BottomTabs', {
                        screen: 'My Cards',
                        params: { cardId: card.cardIdentifier },
                    }),
                },
            });
        } catch (error: any) {
            console.error('Failed to block card', error);
            navigation.navigate('GenericInfoScreen', {
                icon: <FailureSVG />,
                title: 'freezeCard.errorTitle',
                description: 'freezeCard.errorSubtitle',
                primaryButton: {
                    title: 'common.done',
                    onPress: () => navigation.navigate('BottomTabs', {
                        screen: 'My Cards',
                        params: { cardId: card.cardIdentifier },
                    }),
                },
            });
        }
    };



    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>

            <CustomHeader
                title={''}
                onBackPress={() => navigation.goBack()}
            />

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
                    required={true}
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

            <View style={styles.bottomButtonContainer}>
                <CustomButton
                    title={t('common.submit')}
                    onPress={handleSubmit}
                    disabled={!selectedReason}
                    style={{ width: '100%' }}
                />
            </View>

            <CustomBottomSheet
                visible={isBottomSheetVisible}
                onClose={() => setBottomSheetVisible(false)}
                title={t('freezeCard.title')}
            >
                <ScrollView
                    contentContainerStyle={styles.bottomSheetContent}
                    showsVerticalScrollIndicator={false}
                >
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
                </ScrollView>
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
