import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import { ms } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomBackButton from '../../../common/components/CustomBackButton';
import SectionContainer from '../../../common/components/SectionContainer';

import { useNavigation, useRoute } from '@react-navigation/native';
import { useGetCardLimitsQuery } from '../../../network/card/card.api';
import CustomLoader from '../../../common/components/CustomLoader';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const LimitProgress = ({ label, spent, total, currency }: { label: string, spent: number, total: number, currency: string }) => {
    const { colors } = useTheme();
    const isUnlimited = total === 0;
    const progress = isUnlimited ? 0 : Math.min(spent / total, 1);
    const remaining = Math.max(0, total - spent);

    return (
        <View style={styles.limitItem}>
            <View style={styles.limitHeader}>
                <CustomText type={TextType.CardTitle}>{label}</CustomText>
                <CustomText type={TextType.CardText}>
                    {isUnlimited ? `Remaining: Unlimited` : `Remaining: ${remaining.toLocaleString('en-IN')}`}
                </CustomText>
            </View>
            <View style={[styles.progressBarContainer, { backgroundColor: '#F0F0F0' }]}>
                <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: colors.primary }]} />
            </View>
            <View style={styles.limitFooter}>
                <CustomText type={TextType.CardText}>0</CustomText>
                {spent > 0 && (
                    <CustomText type={TextType.CardText}>
                        {spent.toLocaleString('en-IN')}
                    </CustomText>
                )}
                <CustomText type={TextType.CardText}>
                    {isUnlimited ? `Unlimited` : total.toLocaleString('en-IN')}
                </CustomText>
            </View>
        </View>
    );
};

const TransactionLimitsScreen = () => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
    const route = useRoute<any>();
    const { card } = route.params || {};

    const { data: limitsData, isLoading } = useGetCardLimitsQuery(card?.cardIdentifier, {
        skip: !card?.cardIdentifier,
    });

    const limitItems = React.useMemo(() => {
        if (!limitsData?.limits) return [];
        return limitsData.limits.map((limit: any) => {
            let labelKey = 'transactionLimits.daily';
            if (limit.limitType === 'MONTHLY') labelKey = 'transactionLimits.monthly';
            if (limit.limitType === 'SINGLE_AMOUNT') labelKey = 'transactionLimits.single';

            const spent = limit.currentAmount || 0;
            const total = limit.maxAmount || 0;
            const currency = limit.currency || 'AED';

            return {
                id: limit.limitType,
                body: (
                    <LimitProgress
                        label={t(labelKey)}
                        spent={spent}
                        total={total}
                        currency={currency}
                    />
                ),
            };
        });
    }, [limitsData, t]);



    return (
        <View style={[styles.container, {
            backgroundColor: colors.background,
            paddingTop: insets.top,
        }]}>
            <View style={styles.header}>
                <CustomBackButton />
                <CustomText type={TextType.ScreenHeadlineSmall} style={styles.headerTitle}>
                    {t('transactionLimits.title')}
                </CustomText>
            </View>
            <SectionContainer
                title={t('transactionLimits.title')}
                items={limitItems}
                ItemSeparatorComponent={() => <View style={styles.divider} />}
                loading={isLoading}
            />
            <CustomLoader loading={isLoading} />
        </View>
    );
};

export default TransactionLimitsScreen;

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
    limitItem: {
        width: '100%',
    },
    limitHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: ms(8),
    },
    progressBarContainer: {
        height: ms(8),
        borderRadius: ms(4),
        width: '100%',
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: ms(4),
    },
    limitFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: ms(4),
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: ms(8),
    }
});
