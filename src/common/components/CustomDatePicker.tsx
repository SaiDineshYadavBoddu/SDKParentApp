import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import CustomBottomSheet from './CustomBottomSheet';
import { Calendar } from 'react-native-calendars';
import { ms } from 'react-native-size-matters';
import { useTheme } from '../../theme/ThemeProvider';
import CustomText, { TextType } from './CustomText';
import CustomButton from './CustomButton';
import { useTranslation } from 'react-i18next';
import ChevronLeftSVG from '../../assets/svgs/ChevronLeftSVG';
import CheveronDownSVG from '../../assets/svgs/CheveronDownSVG';

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
    const [currentMonth, setCurrentMonth] = useState(initialStartDate || new Date().toISOString().split('T')[0]);
    const [isYearPickerVisible, setIsYearPickerVisible] = useState(false);

    useEffect(() => {
        if (visible) {
            setSelectedStartDate(initialStartDate);
            setSelectedEndDate(initialEndDate);
            setCurrentMonth(initialStartDate || new Date().toISOString().split('T')[0]);
        }
    }, [visible, initialStartDate, initialEndDate]);

    const changeMonth = (increment: number) => {
        const date = new Date(currentMonth);
        date.setMonth(date.getMonth() + increment);
        setCurrentMonth(date.toISOString().split('T')[0]);
    };

    const changeYear = (year: number) => {
        const date = new Date(currentMonth);
        date.setFullYear(year);
        setCurrentMonth(date.toISOString().split('T')[0]);
        setIsYearPickerVisible(false);
    };

    const getYears = () => {
        const currentYear = new Date().getFullYear();
        const minYear = minDate ? new Date(minDate).getFullYear() : currentYear - 50;
        const maxYear = maxDate ? new Date(maxDate).getFullYear() : currentYear + 20;
        const years = [];
        for (let i = minYear; i <= maxYear; i++) {
            years.push(i);
        }
        return years.reverse();
    };

    const renderCustomHeader = () => {
        const date = new Date(currentMonth);
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();

        return (
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => changeMonth(-1)} style={styles.arrowButton}>
                    <ChevronLeftSVG width={ms(24)} height={ms(24)} stroke={colors.onBackground}/>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={() => setIsYearPickerVisible(!isYearPickerVisible)} style={styles.yearSelector}>
                    <CustomText type={TextType.CardTitle} style={{ marginRight: ms(8), color: colors.onBackground }}>
                        {month} {year}
                    </CustomText>
                    <CheveronDownSVG width={ms(16)} height={ms(16)} stroke={colors.onBackground} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => changeMonth(1)} style={styles.arrowButton}>
                    <View style={{ transform: [{ rotate: '180deg' }] }}>
                        <ChevronLeftSVG width={ms(24)} height={ms(24)} stroke={colors.onBackground}/>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    const onDayPress = (day: any) => {
        if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
            setSelectedStartDate(day.dateString);
            setSelectedEndDate('');
        } else if (!selectedEndDate) {
            if (day.dateString < selectedStartDate) {
                setSelectedEndDate(selectedStartDate);
                setSelectedStartDate(day.dateString);
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
                {renderCustomHeader()}

                {isYearPickerVisible ? (
                    <View style={[styles.yearPickerContainer, { backgroundColor: colors.background }]}>
                         <CustomText type={TextType.ScreenHeadlineSmall} style={{textAlign:'center', paddingVertical: ms(10)}}>
                            Select Year
                         </CustomText>
                        <FlatList
                            data={getYears()}
                            keyExtractor={(item) => item.toString()}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={[
                                        styles.yearItem, 
                                        { backgroundColor: new Date(currentMonth).getFullYear() === item ? colors.primaryContainer : 'transparent' }
                                    ]}
                                    onPress={() => changeYear(item)}
                                >
                                    <CustomText 
                                        type={TextType.CardTitle} 
                                        style={{ 
                                            color: new Date(currentMonth).getFullYear() === item ? colors.onPrimaryContainer : colors.onBackground 
                                        }}
                                    >
                                        {item}
                                    </CustomText>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                ) : (
                    <Calendar
                        current={currentMonth}
                        key={currentMonth}
                        onDayPress={onDayPress}
                        onMonthChange={(month: any) => setCurrentMonth(month.dateString)}
                        markingType={'period'}
                        minDate={minDate}
                        maxDate={maxDate}
                        markedDates={markedDates}
                        hideArrows={true}
                        renderHeader={() => null}
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
                        }}
                    />
                )}

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
        height: ms(450),
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: ms(16),
        paddingVertical: ms(10),
    },
    arrowButton: {
        padding: ms(8),
    },
    yearSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: ms(8),
        borderRadius: ms(8),
    },
    yearPickerContainer: {
        height: 300,
        justifyContent: 'center',
    },
    yearItem: {
        paddingVertical: ms(12),
        paddingHorizontal: ms(32),
        marginVertical: ms(4),
        alignItems: 'center',
        borderRadius: ms(8),
        alignSelf: 'center',
        width: '60%',
    },
    footer: {
        marginTop: 'auto',
        paddingHorizontal: ms(16),
    },
    rangeInfo: {
        marginBottom: ms(16),
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: ms(20),
    },
    applyButton: {
        width: '100%',
    },
});

export default CustomDatePicker;
