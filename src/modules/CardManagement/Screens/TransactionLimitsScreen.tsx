import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import { ms } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomBackButton from '../../../common/components/CustomBackButton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const LimitProgress = ({ label, spent, total, currency }: { label: string, spent: number, total: number, currency: string }) => {
    const { colors } = useTheme();
    const progress = Math.min(spent / total, 1);

    return (
        <View style={styles.limitItem}>
            <View style={styles.limitHeader}>
                <CustomText type={TextType.CardTitle}>{label}</CustomText>
                <CustomText type={TextType.CardSubtitle}>
                    {`Spent: ${currency} ${spent.toLocaleString()}`}
                </CustomText>
            </View>
            <View style={[styles.progressBarContainer, { backgroundColor: '#F0F0F0' }]}>
                <View style={[styles.progressBar, { width: `${progress * 100}%`, backgroundColor: colors.primary }]} />
            </View>
            <View style={styles.limitFooter}>
                <CustomText type={TextType.CardSubtitle}>0</CustomText>
                <CustomText type={TextType.CardSubtitle}>{currency} {total.toLocaleString()}</CustomText>
            </View>
        </View>
    );
};

const TransactionLimitsScreen = () => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();

    const limits = [
        { id: 'daily', label: t('transactionLimits.daily'), spent: 856, total: 2500 },
        { id: 'weekly', label: t('transactionLimits.weekly'), spent: 4520, total: 10000 },
        { id: 'single', label: t('transactionLimits.single'), spent: 120, total: 5000 },
    ];

    const currency = t('transactionLimits.currency');

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

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={[styles.limitsCard, { backgroundColor: colors.surface || '#FFFFFF' }]}>
                    {limits.map((limit, index) => (
                        <React.Fragment key={limit.id}>
                            <LimitProgress
                                label={limit.label}
                                spent={limit.spent}
                                total={limit.total}
                                currency={currency}
                            />
                            {index < limits.length - 1 && <View style={styles.divider} />}
                        </React.Fragment>
                    ))}
                </View>
            </ScrollView>
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
    limitsCard: {
        borderRadius: ms(16),
        padding: Spacing.l,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    limitItem: {
        marginVertical: ms(12),
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
