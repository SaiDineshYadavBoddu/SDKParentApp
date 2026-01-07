import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity } from 'react-native';
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

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={[styles.calendarContainer, { backgroundColor: colors.background }]}>
                    <View style={styles.header}>
                        <CustomText type={TextType.SectionTitle}>{t('datePicker.selectRange')}</CustomText>
                    </View>

                    <Calendar
                        onDayPress={onDayPress}
                        markingType={'period'}
                        minDate={minDate}
                        maxDate={maxDate}
                        markedDates={markedDates}
                        theme={{
                            calendarBackground: colors.background,
                            textSectionTitleColor: '#b6c1cd',
                            selectedDayBackgroundColor: colors.primary,
                            selectedDayTextColor: '#ffffff',
                            todayTextColor: colors.primary,
                            dayTextColor: colors.onBackground,
                            textDisabledColor: '#d9e1e8',
                            dotColor: colors.primary,
                            selectedDotColor: '#ffffff',
                            arrowColor: colors.primary,
                            monthTextColor: colors.primary,
                            indicatorColor: colors.primary,
                            textDayFontWeight: '300',
                            textMonthFontWeight: 'bold',
                            textDayHeaderFontWeight: '300',
                            textDayFontSize: 16,
                            textMonthFontSize: 16,
                            textDayHeaderFontSize: 16,
                        }}
                    />

                    <View style={styles.footer}>
                        <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                            <CustomText type={TextType.Label} style={{ color: colors.onBackground }}>{t('common.cancel')}</CustomText>
                        </TouchableOpacity>
                        <CustomButton
                            title={t('common.apply')}
                            onPress={() => onApply(selectedStartDate, selectedEndDate)}
                            disabled={!selectedStartDate || !selectedEndDate}
                            style={styles.applyButton}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: ms(20),
    },
    calendarContainer: {
        borderRadius: ms(16),
        overflow: 'hidden',
        padding: ms(16),
    },
    header: {
        paddingBottom: ms(16),
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        marginBottom: ms(16),
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginTop: ms(16),
        gap: ms(16),
    },
    cancelButton: {
        padding: ms(10),
    },
    applyButton: {
        minWidth: ms(100),
    },
});

export default CustomDatePicker;
