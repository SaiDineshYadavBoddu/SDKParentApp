import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, ScrollView, Switch } from 'react-native';
import { ms } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomBackButton from '../../../common/components/CustomBackButton';
import SectionContainer, { SectionItem } from '../../../common/components/SectionContainer';
import CheckmarkSVG from '../../../assets/svgs/CheckmarkSVG';

const CardUsageScreen = () => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();

    const [usage, setUsage] = useState({
        online: true,
        contactless: true,
        foreign: false,
    });

    const usageItems: SectionItem[] = [
        {
            id: 'online',
            top: <CustomText type={TextType.CardTitle}>{t('cardUsage.online')}</CustomText>,
            end: usage.online ? <CheckmarkSVG width={ms(20)} height={ms(20)} color={colors.primary} /> : null,
        },
        {
            id: 'contactless',
            top: <CustomText type={TextType.CardTitle}>{t('cardUsage.contactless')}</CustomText>,
            end: usage.contactless ? <CheckmarkSVG width={ms(20)} height={ms(20)} color={colors.primary} /> : null,
        },
        {
            id: 'foreign',
            top: <CustomText type={TextType.CardTitle}>{t('cardUsage.foreign')}</CustomText>,
            end: usage.foreign ? <CheckmarkSVG width={ms(20)} height={ms(20)} color={colors.primary} /> : null,
        },
    ];

    return (
        <View style={[styles.container, {
            backgroundColor: colors.background,
            paddingTop: insets.top,
        }]}>
            <View style={styles.header}>
                <CustomBackButton />
                <CustomText type={TextType.ScreenHeadlineSmall} style={styles.headerTitle}>
                    {t('cardUsage.title')}
                </CustomText>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <SectionContainer items={usageItems} />
            </ScrollView>
        </View>
    );
};

export default CardUsageScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Spacing.s,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: ms(20),
        paddingHorizontal: Spacing.m,
        marginBottom: ms(20),
    },
    headerTitle: {
        marginLeft: ms(8),
        fontSize: ms(18),
    },
    scrollContent: {
        paddingHorizontal: Spacing.m,
        paddingBottom: Spacing.xxl,
    },
});
