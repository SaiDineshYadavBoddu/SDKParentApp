import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, ScrollView, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ms } from 'react-native-size-matters';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomButton from '../../../common/components/CustomButton';
import CustomTextInput from '../../../common/components/CustomTextInput';
import CustomImage from '../../../common/components/CustomImage';
import CloseCardSVG from '../../../assets/svgs/CloseCardSVG';
import CustomBackButton from '../../../common/components/CustomBackButton';
import CustomResultScreen from '../../../common/components/CustomResultScreen';
import CustomWarning from '../../../common/components/CustomWarning';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const CloseCardScreen = () => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { card } = route.params || {};
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

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
            paddingTop: insets.top, // Use safe area inset for top
            // paddingHorizontal removed to avoid double padding with children
        }]}>
            <View style={styles.header}>
                <CustomBackButton />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.iconContainer}>
                    <CloseCardSVG width={ms(40)} height={ms(40)} color={colors.primary} />
                </View>

                <CustomText type={TextType.ScreenHeadlineMedium} style={styles.title}>
                    {t('closeCard.title')}
                </CustomText>

                <CustomText type={TextType.ScreenDisplaySmall} style={styles.subtitle}>
                    {t('closeCard.subtitle')}
                </CustomText>

                <View style={styles.cardItemContainer}>
                    <View style={styles.cardIcon}>
                        <CustomImage source={require('../../../assets/images/SmallCard.png')} style={{ width: ms(34), height: ms(24) }} resizeMode="contain" />
                    </View>
                    <CustomText type={TextType.CardTitle}>
                        {card?.maskedPan}
                    </CustomText>
                </View>

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

            <View style={[styles.footer, { paddingBottom: Math.max(Spacing.l, insets.bottom) }]}>
                <CustomButton
                    title={t('common.continue')}
                    onPress={() => setIsSuccess(true)}
                    style={{ width: '100%' }}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Spacing.s,
    },
    header: {
        paddingTop: ms(20),
        paddingHorizontal: Spacing.m,
    },
    backButton: {
        paddingHorizontal: Spacing.xs,
    },
    scrollContent: {
        paddingHorizontal: Spacing.m,
        paddingBottom: Spacing.xxl,
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
    cardItemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.m,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: ms(12),
        marginBottom: ms(24),
    },
    cardIcon: {
        marginRight: Spacing.m,
    },
    maskedPan: {
        fontWeight: '500',
    },
    footer: {
        padding: Spacing.m,
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
    },
});

export default CloseCardScreen;
