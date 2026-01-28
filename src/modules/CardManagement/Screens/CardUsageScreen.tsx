import React from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useGetCardRestrictionsQuery } from '../../../network/card/card.api';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, ScrollView } from 'react-native';
import { ms } from 'react-native-size-matters';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import SectionContainer, { SectionItem } from '../../../common/components/SectionContainer';
import CheckmarkSVG from '../../../assets/svgs/CheckmarkSVG';
import FailureSVG from '../../../assets/svgs/FailureSVG';
import CustomLoader from '../../../common/components/CustomLoader';
import CustomHeader from '../../../common/components/CustomHeader';

const CardUsageScreen = () => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { card } = route.params || {};

    const { data: restrictionsData, isLoading, isError, refetch, isFetching } = useGetCardRestrictionsQuery(card?.cardIdentifier, {
        skip: !card?.cardIdentifier,
    });

    React.useEffect(() => {
        if (isError) {
            navigation.navigate('GenericInfoScreen', {
                icon: <FailureSVG />,
                title: 'serverError.title',
                description: 'serverError.description',
                primaryButton: {
                    title: 'serverError.tryAgain',
                    onPress: async () => {
                        try {
                            await refetch().unwrap();
                            navigation.goBack();
                        } catch (err) {
                            console.error('Failed to retry restrictions fetch:', err);
                        }
                    },
                },
            });
        }
    }, [isError, navigation, refetch]);

    const isAllowed = (type: string) => {
        if (!restrictionsData?.restrictions) return false;
        const restriction = restrictionsData.restrictions.find((r: any) => r.restrictionType === type);
        return restriction ? restriction.isAllowed : false;
    };

    const usageItems: SectionItem[] = restrictionsData?.restrictions && restrictionsData.restrictions.length > 0 ? [
        {
            id: 'pos',
            top: <CustomText type={TextType.CardTitle}>{t('cardUsage.pos')}</CustomText>,
            end: isAllowed('PointOfSale') ? <CheckmarkSVG width={ms(20)} height={ms(20)} color={colors.primary} /> : null,
        },
        {
            id: 'online',
            top: <CustomText type={TextType.CardTitle}>{t('cardUsage.online')}</CustomText>,
            end: isAllowed('Ecommerce') ? <CheckmarkSVG width={ms(20)} height={ms(20)} color={colors.primary} /> : null,
        },
        {
            id: 'foreign',
            top: <CustomText type={TextType.CardTitle}>{t('cardUsage.foreign')}</CustomText>,
            end: isAllowed('International') ? <CheckmarkSVG width={ms(20)} height={ms(20)} color={colors.primary} /> : null,
        },
        {
            id: 'contactless',
            top: <CustomText type={TextType.CardTitle}>{t('cardUsage.contactless')}</CustomText>,
            end: isAllowed('Contactless') ? <CheckmarkSVG width={ms(20)} height={ms(20)} color={colors.primary} /> : null,
        },
        {
            id: 'atm',
            top: <CustomText type={TextType.CardTitle}>{t('cardUsage.atm')}</CustomText>,
            end: isAllowed('ATM') ? <CheckmarkSVG width={ms(20)} height={ms(20)} color={colors.primary} /> : null,
        },
    ] : [];

    return (
        <View style={[styles.container, {
            backgroundColor: colors.background,
        }]}>
            <CustomHeader
                title={t('cardUsage.title')}
                onBackPress={() => navigation.goBack()}
            />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <SectionContainer
                    items={usageItems}
                    loading={isLoading || isFetching}
                    emptyMessage={t('common.noDataAvailable')}
                />
            </ScrollView>
            <CustomLoader loading={isLoading || isFetching} />
        </View>
    );
};

export default CardUsageScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: Spacing.s,
    },
    scrollContent: {
        paddingHorizontal: Spacing.m,
        paddingBottom: Spacing.xxl,
    },
});
