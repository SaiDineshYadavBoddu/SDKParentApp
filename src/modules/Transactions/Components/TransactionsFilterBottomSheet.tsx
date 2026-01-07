import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ms } from 'react-native-size-matters';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomRadioButton from '../../../common/components/CustomRadioButton';
import CustomButton from '../../../common/components/CustomButton';
import CustomBottomSheet from '../../../common/components/CustomBottomSheet';
import CustomDropdown from '../../../common/components/CustomDropdown';
import CustomTextInput from '../../../common/components/CustomTextInput';
import CalendarSVG from '../../../assets/svgs/CalendarSVG';
import CustomCalendarBottomSheet from './CustomCalendarBottomSheet';
import { useTranslation } from 'react-i18next';

interface TransactionsFilterBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    onApply: (filters: any) => void;
    initialFilters: any;
}

const TransactionsFilterBottomSheet: React.FC<TransactionsFilterBottomSheetProps> = ({
    visible,
    onClose,
    onApply,
    initialFilters,
}) => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    const [dateRange, setDateRange] = useState(initialFilters.dateRange || '');
    const [status, setStatus] = useState(initialFilters.status || 'Approved');
    const [sortBy, setSortBy] = useState(initialFilters.sortBy || 'newest');
    const [isCalendarVisible, setIsCalendarVisible] = useState(false);

    const handleReset = () => {
        setDateRange('');
        setStatus('Approved');
        setSortBy('newest');
    };

    const handleApply = () => {
        onApply({ dateRange, status, sortBy });
        onClose();
    };

    return (
        <CustomBottomSheet
            visible={visible}
            onClose={onClose}
            title={t('transactions.filters')}
        >
            <View style={styles.container}>
                <View style={styles.section}>
                    <CustomText type={TextType.Label}>{t('transactions.selectDateRange')}</CustomText>
                    <CustomTextInput
                        placeholder="18/06/2025 - 19/06/2025"
                        value={dateRange}
                        onChangeText={setDateRange}
                        onPress={() => setIsCalendarVisible(true)}
                        editable={false}
                        rightIcon={<TouchableOpacity onPress={() => setIsCalendarVisible(true)}>
                            <CalendarSVG width={ms(20)} height={ms(20)} color={colors.onSurface} />
                        </TouchableOpacity>}
                    />
                </View>

                <View style={styles.section}>
                    <CustomText type={TextType.Label}>{t('transactions.transactionStatus')}</CustomText>
                    <CustomDropdown
                        selectedValue={status}
                        onPress={() => { }} // Placeholder for status selection logic
                        placeholder="Select Status"
                    />
                </View>

                <View style={styles.section}>
                    <CustomText type={TextType.Label} style={{ marginBottom: Spacing.m }}>{t('transactions.sortBy')}</CustomText>
                    <View style={styles.radioGroup}>
                        <TouchableOpacity onPress={() => setSortBy('newest')} style={styles.radioItem}>
                            <CustomText type={TextType.CardText}>{t('transactions.newestToOldest')}</CustomText>
                            <CustomRadioButton
                                selected={sortBy === 'newest'}
                                onPress={() => setSortBy('newest')}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSortBy('oldest')} style={styles.radioItem}>
                            <CustomText type={TextType.CardText}>{t('transactions.oldestToNewest')}</CustomText>
                            <CustomRadioButton
                                selected={sortBy === 'oldest'}
                                onPress={() => setSortBy('oldest')}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.footer}>
                    <CustomButton
                        title={t('transactions.reset')}
                        onPress={handleReset}
                        variant="outlined"
                        style={styles.footerButton}
                    />
                    <CustomButton
                        title={t('transactions.applyFilters')}
                        onPress={handleApply}
                        style={styles.footerButton}
                    />
                </View>
            </View>
            <CustomCalendarBottomSheet
                visible={isCalendarVisible}
                onClose={() => setIsCalendarVisible(false)}
                onSelectRange={(start, end) => {
                    if (start && end) {
                        setDateRange(`${start} - ${end}`);
                    } else {
                        setDateRange(start);
                    }
                }}
                initialStartDate={dateRange.split(' - ')[0]}
                initialEndDate={dateRange.split(' - ')[1]}
            />
        </CustomBottomSheet>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: Spacing.m,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    radioGroup: {
        gap: Spacing.m,
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.s,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: Spacing.m,
        marginTop: Spacing.m,
    },
    footerButton: {
        flex: 1,
    },
});

export default TransactionsFilterBottomSheet;
