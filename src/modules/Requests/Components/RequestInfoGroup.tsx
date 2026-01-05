import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ms } from 'react-native-size-matters';
import CustomText, { TextType } from '../../../common/components/CustomText';
import ClockSVG from '../../../assets/svgs/ClockSVG';
import RequestCheckMarkSVG from '../../../assets/svgs/RequestCheckMarkSVG';
import DatePickerSVG from '../../../assets/svgs/DatePickerSVG';
import ResolvedSVG from '../../../assets/svgs/ResolvedSVG';
import InProgressSVG from '../../../assets/svgs/InProgressSVG';
import { Spacing } from '../../../theme/spacing';

export type RequestDetail = {
    userName: string;
    userIconType: 'clock' | 'check';
    statusText?: string;
    dateText?: string;
};

interface RequestInfoGroupProps {
    details: RequestDetail[];
}

export const renderIcon = (type: string) => {
    switch (type) {
        case 'clock':
            return <ClockSVG width={ms(16)} height={ms(16)} />;
        case 'check':
            return <RequestCheckMarkSVG width={ms(16)} height={ms(16)} />;
        case 'calendar':
            return <DatePickerSVG width={ms(16)} height={ms(16)} />;
        default:
            return null;
    }
};

export const getProgressStatusIcon = (status: string) => {
    switch (status) {
        case 'In progress':
            return <InProgressSVG width={ms(16)} height={ms(16)} />;
        case 'Resolved':
            return <ResolvedSVG width={ms(16)} height={ms(16)} />;
        default:
            return null;
    }
};

export const getProgressStatusColor = (status: string) => {
    switch (status) {
        case 'In progress':
            return '#2E84BF';
        case 'Resolved':
            return '#2FBF71';
        default:
            return '#757575';
    }
};

export const getStatusColors = (status: string) => {
    switch (status) {
        case 'Activation':
            return { backgroundColor: '#F0E7F6', textColor: '#C09BD8' };
        case 'Card unblocking':
            return { backgroundColor: '#FFF1B8', textColor: '#C97A20' };
        default:
            return { backgroundColor: '#F5F7F9', textColor: '#757575' };
    }
};

const RequestInfoGroup: React.FC<RequestInfoGroupProps> = ({ details }) => {
    return (
        <View style={styles.detailsContainer}>
            {details.map((detail, index) => {
                const statusColor = detail.statusText ? getProgressStatusColor(detail.statusText) : '#757575';
                return (
                    <View key={index} style={styles.detailRow}>
                        {/* Left Column */}
                        <View style={styles.leftColumn}>
                            {renderIcon(detail.userIconType)}
                            <CustomText type={TextType.ScreenDisplaySmall} style={styles.detailText}>
                                {detail.userName}
                            </CustomText>
                        </View>

                        {/* Right Column */}
                        <View style={styles.rightColumn}>
                            {detail.statusText ? (
                                <>
                                    {getProgressStatusIcon(detail.statusText)}
                                    <CustomText
                                        type={TextType.ScreenDisplaySmall}
                                        style={[styles.statusText, { color: statusColor }]}
                                    >
                                        {detail.statusText}
                                    </CustomText>
                                </>
                            ) : detail.dateText ? (
                                <>
                                    {renderIcon('calendar')}
                                    <CustomText type={TextType.ScreenDisplaySmall} style={styles.detailText}>
                                        {detail.dateText}
                                    </CustomText>
                                </>
                            ) : null}
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    detailsContainer: {
        gap: Spacing.s,
        width: '100%',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
    },
    leftColumn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.s,
        width: '65%',
    },
    rightColumn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.s,
        width: '35%',
    },
    detailText: {
        color: '#616161',
        fontSize: ms(13),
    },
    statusText: {
        fontSize: ms(13),
        fontWeight: '600',
    },
});

export default RequestInfoGroup;
