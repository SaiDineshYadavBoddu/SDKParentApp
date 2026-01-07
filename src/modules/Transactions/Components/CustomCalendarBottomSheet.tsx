import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { ms } from 'react-native-size-matters';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomButton from '../../../common/components/CustomButton';
import CustomBottomSheet from '../../../common/components/CustomBottomSheet';
import { useTranslation } from 'react-i18next';

interface CustomCalendarBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    onSelectRange: (startDate: string, endDate: string) => void;
    initialStartDate?: string;
    initialEndDate?: string;
}

const CustomCalendarBottomSheet: React.FC<CustomCalendarBottomSheetProps> = ({
    visible,
    onClose,
    onSelectRange,
    initialStartDate = '',
    initialEndDate = '',
}) => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);

    const onDayPress = (day: DateData) => {
        if (!startDate || (startDate && endDate)) {
            setStartDate(day.dateString);
            setEndDate('');
        } else if (startDate && !endDate) {
            if (day.dateString < startDate) {
                setStartDate(day.dateString);
                setEndDate('');
            } else {
                setEndDate(day.dateString);
            }
        }
    };

    const markedDates = useMemo(() => {
        const marks: any = {};
        if (startDate) {
            marks[startDate] = {
                startingDay: true,
                color: colors.primary,
                textColor: 'white',
                selected: true,
            };
        }
        if (endDate) {
            marks[endDate] = {
                endingDay: true,
                color: colors.primary,
                textColor: 'white',
                selected: true,
            };

            // Fill in between
            let start = new Date(startDate);
            let end = new Date(endDate);
            let current = new Date(start);
            current.setDate(current.getDate() + 1);

            while (current < end) {
                const dateString = current.toISOString().split('T')[0];
                marks[dateString] = {
                    color: '#E3F2FD', // Light blue fill
                    textColor: colors.onSurface,
                };
                current.setDate(current.getDate() + 1);
            }
        }
        return marks;
    }, [startDate, endDate, colors]);

    const handleApply = () => {
        onSelectRange(startDate, endDate);
        onClose();
    };

    return (
        <CustomBottomSheet
            visible={visible}
            onClose={onClose}
            title={t('transactions.selectDateRange')}
        >
            <View style={styles.container}>
                <Calendar
                    onDayPress={onDayPress}
                    markingType={'period'}
                    markedDates={markedDates}
                    theme={{
                        calendarBackground: 'transparent',
                        textSectionTitleColor: '#666',
                        selectedDayBackgroundColor: colors.primary,
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: colors.primary,
                        dayTextColor: colors.onSurface,
                        textDisabledColor: '#D9E1E8',
                        dotColor: colors.primary,
                        arrowColor: colors.primary,
                        monthTextColor: colors.onSurface,
                        textDayFontWeight: '500',
                        textMonthFontWeight: '700',
                        textDayHeaderFontWeight: '600',
                        textDayFontSize: ms(14),
                        textMonthFontSize: ms(18),
                        textDayHeaderFontSize: ms(12),
                    }}
                    style={styles.calendar}
                />

                <View style={styles.footer}>
                    <CustomButton
                        title={t('common.cancel')}
                        onPress={onClose}
                        variant="outlined"
                        style={styles.footerButton}
                    />
                    <CustomButton
                        title={t('common.apply')}
                        onPress={handleApply}
                        disabled={!startDate || !endDate}
                        style={styles.footerButton}
                    />
                </View>
            </View>
        </CustomBottomSheet>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: Spacing.m,
    },
    calendar: {
        borderRadius: ms(8),
        marginBottom: Spacing.m,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: Spacing.m,
        marginTop: Spacing.m,
    },
    footerButton: {
        paddingHorizontal: Spacing.m,
    },
});

export default CustomCalendarBottomSheet;
