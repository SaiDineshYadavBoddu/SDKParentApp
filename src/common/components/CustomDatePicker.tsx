import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import CustomBottomSheet from './CustomBottomSheet';
import { Calendar } from 'react-native-calendars';
import { ms } from 'react-native-size-matters';
import { useTheme } from '../../theme/ThemeProvider';
import CustomText, { TextType } from './CustomText';
import CustomButton from './CustomButton';
import { useTranslation } from 'react-i18next';

interface CustomDatePickerProps {
    visible: boolean;
    onClose: () => void;
    onApply: (startDate: string, endDate: string) => void;
    initialStartDate?: string;
    initialEndDate?: string;
    minDate?: string;
    maxDate?: string;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
    visible,
    onClose,
    onApply,
    initialStartDate = '',
    initialEndDate = '',
    minDate,
    maxDate,
}) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const [selectedStartDate, setSelectedStartDate] = useState(initialStartDate);
    const [selectedEndDate, setSelectedEndDate] = useState(initialEndDate);

    useEffect(() => {
        if (visible) {
            setSelectedStartDate(initialStartDate);
            setSelectedEndDate(initialEndDate);
        }
    }, [visible, initialStartDate, initialEndDate]);

    const onDayPress = (day: any) => {
        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            setSelectedStartDate(day.dateString);
            setSelectedEndDate('');
        } else if (!selectedEndDate) {
            if (day.dateString < selectedStartDate) {
                setSelectedStartDate(day.dateString);
                setSelectedEndDate('');
            } else {
                setSelectedEndDate(day.dateString);
            }
        }
    };

    const markedDates: any = {};
    if (selectedStartDate) {
        markedDates[selectedStartDate] = {
            startingDay: true,
            color: colors.primary,
            textColor: '#fff',
            selected: true,
        };
    }
    if (selectedEndDate) {
        markedDates[selectedEndDate] = {
            endingDay: true,
            color: colors.primary,
            textColor: '#fff',
            selected: true,
        };

        // Mark dates between start and end
        let start = new Date(selectedStartDate);
        let end = new Date(selectedEndDate);
        let current = new Date(start);
        current.setDate(current.getDate() + 1);

        while (current < end) {
            const dateString = current.toISOString().split('T')[0];
            markedDates[dateString] = {
                color: colors.primary + '33', // 20% opacity
                textColor: colors.primary,
            };
            current.setDate(current.getDate() + 1);
        }
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    };

    const getDaysDifference = () => {
        if (!selectedStartDate || !selectedEndDate) return '';
        const start = new Date(selectedStartDate);
        const end = new Date(selectedEndDate);
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Include start day
        return `(${diffDays} Days)`;
    };

    const rangeText = selectedStartDate && selectedEndDate 
        ? `${formatDate(selectedStartDate)} - ${formatDate(selectedEndDate)} ${getDaysDifference()}`
        : selectedStartDate 
            ? formatDate(selectedStartDate)
            : t('datePicker.selectRange');

    return (
        <CustomBottomSheet visible={visible} onClose={onClose}>
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <Calendar
                    onDayPress={onDayPress}
                    markingType={'period'}
                    minDate={minDate}
                    maxDate={maxDate}
                    markedDates={markedDates}
                    theme={{
                        calendarBackground: colors.background,
                        textSectionTitleColor: colors.secondaryText,
                        selectedDayBackgroundColor: colors.primary,
                        selectedDayTextColor: '#ffffff',
                        todayTextColor: colors.primary,
                        dayTextColor: colors.onBackground,
                        textDisabledColor: '#d9e1e8',
                        dotColor: colors.primary,
                        selectedDotColor: '#ffffff',
                        arrowColor: colors.onBackground,
                        monthTextColor: colors.onBackground,
                        indicatorColor: colors.primary,
                        textDayFontWeight: '400',
                        textMonthFontWeight: '600',
                        textDayHeaderFontWeight: '400',
                        textDayFontSize: ms(14),
                        textMonthFontSize: ms(16),
                        textDayHeaderFontSize: ms(13),
                        ['stylesheet.calendar.header' as any]: {
                            header: {
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                paddingLeft: 10,
                                paddingRight: 10,
                                marginTop: 6,
                                alignItems: 'center',
                                marginBottom: 10
                            }
                        }
                    }}
                />

                <View style={styles.footer}>
                     <View style={styles.rangeInfo}>
                        <CustomText type={TextType.Label} style={{ textAlign: 'center', marginBottom: ms(8) }}>
                            {rangeText}
                        </CustomText>
                     </View>
                    <CustomButton
                        title={t('datePicker.selectRangeButton', { defaultValue: 'Select date range' })}
                        onPress={() => onApply(selectedStartDate, selectedEndDate)}
                        disabled={!selectedStartDate || !selectedEndDate}
                        style={styles.applyButton}
                    />
                </View>
            </View>
        </CustomBottomSheet>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: ms(16),
    },
    footer: {
        marginTop: ms(16),
        paddingHorizontal: ms(16),
    },
    rangeInfo: {
        marginBottom: ms(16),
        alignItems: 'center',
    },
    applyButton: {
        width: '100%',
    },
});

export default CustomDatePicker;
