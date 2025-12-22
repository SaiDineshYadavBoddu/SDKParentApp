import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
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
import InfoSVG from '../../../assets/svgs/InfoSVG';
import { REPLACE_CARD_REASONS } from '../../../constants/appConstants';


const ReplaceCardScreen = () => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation();
    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [selectedReason, setSelectedReason] = useState<string | undefined>();
    const [tempReason, setTempReason] = useState<string | undefined>();
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
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <CustomIcon type="feather" name="arrow-left" size={ms(24)} color={colors.onBackground} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <CustomText type={TextType.ScreenHeadlineSmall} style={styles.title}>
                    {t('replaceCard.title')}
                </CustomText>
                <CustomText type={TextType.CardText} style={styles.subtitle}>
                    {t('replaceCard.description')}
                </CustomText>

                <CustomDropdown
                    label={t('replaceCard.selectReason')}
                    placeholder={t('common.select')}
                    selectedValue={selectedReason}
                    onPress={() => {
                        setTempReason(selectedReason);
                        setBottomSheetVisible(true);
                    }}
                    containerStyle={styles.dropdown}
                />

                {selectedReason && (
                    <View style={styles.infoBox}>
                        <View style={styles.infoIcon}>
                            <InfoSVG width={ms(20)} height={ms(20)} />
                        </View>
                        <CustomText type={TextType.CardText} style={styles.infoText}>
                            {t('replaceCard.feeAmount')}
                        </CustomText>
                    </View>
                )}
            </ScrollView>

            <View style={styles.bottomButtonContainer}>
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

                    <View style={styles.bottomSheetInfoBox}>
                        <View style={styles.infoIcon}>
                            <InfoSVG width={ms(20)} height={ms(20)} />
                        </View>
                        <CustomText type={TextType.CardText} style={styles.infoText}>
                            {t('replaceCard.feeAmount')}
                        </CustomText>
                    </View>

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
        paddingTop: ms(60),
        paddingHorizontal: Spacing.l,
    },
    backButton: {
        width: ms(40),
        height: ms(40),
        justifyContent: 'center',
    },
    scrollContent: {
        paddingHorizontal: Spacing.l,
        paddingTop: Spacing.m,
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
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#FFF9E6',
        padding: Spacing.m,
        borderRadius: ms(8),
        alignItems: 'flex-start',
    },
    bottomSheetInfoBox: {
        flexDirection: 'row',
        backgroundColor: '#FFF9E6',
        padding: Spacing.m,
        borderRadius: ms(8),
        alignItems: 'flex-start',
        marginTop: Spacing.m,
        marginBottom: ms(24),
    },
    infoIcon: {
        marginRight: Spacing.s,
        marginTop: ms(2),
    },
    infoText: {
        flex: 1,
        color: '#856404',
        lineHeight: ms(18),
    },
    bottomButtonContainer: {
        padding: Spacing.l,
        paddingBottom: ms(60),
    },
    submitButtonActive: {
        backgroundColor: '#0169B2',
    },
    submitButtonDisabled: {
        backgroundColor: '#EAEFF5',
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