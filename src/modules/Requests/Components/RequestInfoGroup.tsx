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
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../theme/ThemeProvider';

export type RequestDetail = {
    userName: string;
    userIconType: 'clock' | 'check';
    status?: string;
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
        case 'inProgress':
            return <InProgressSVG width={ms(16)} height={ms(16)} />;
        case 'resolved':
            return <ResolvedSVG width={ms(16)} height={ms(16)} />;
        default:
            return null;
    }
};

export const getProgressStatusColor = (status: string, colors: any) => {
    switch (status) {
        case 'inProgress':
            return colors.statusInProgress;
        case 'resolved':
            return colors.statusResolved;
        default:
            return colors.tertiaryText;
    }
};

export const getStatusColors = (status: string, colors: any) => {
    switch (status) {
        case 'activation':
            return { backgroundColor: colors.onStatusActivation, textColor: colors.statusActivation };
        case 'cardUnblocking':
            return { backgroundColor: colors.onStatusUnblocking, textColor: colors.statusUnblocking };
        default:
            return { backgroundColor: colors.screenBackground, textColor: colors.tertiaryText };
    }
};

const RequestInfoGroup: React.FC<RequestInfoGroupProps> = ({ details }) => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    return (
        <View style={styles.detailsContainer}>
            {details.map((detail, index) => {
                const statusColor = detail.status ? getProgressStatusColor(detail.status, colors) : colors.tertiaryText;
                return (
                    <View key={index} style={styles.detailRow}>
                        {/* Left Column */}
                        <View style={styles.leftColumn}>
                            {renderIcon(detail.userIconType)}
                            <CustomText type={TextType.ScreenDisplaySmall} style={[styles.detailText, { color: colors.secondaryText }]}>
                                {detail.userName}
                            </CustomText>
                        </View>

                        {/* Right Column */}
                        <View style={styles.rightColumn}>
                            {detail.status ? (
                                <>
                                    {getProgressStatusIcon(detail.status)}
                                    <CustomText
                                        type={TextType.ScreenDisplaySmall}
                                        style={[styles.statusText, { color: statusColor }]}
                                    >
                                        {t(`requests.status.${detail.status}`)}
                                    </CustomText>
                                </>
                            ) : detail.dateText ? (
                                <>
                                    {renderIcon('calendar')}
                                    <CustomText type={TextType.ScreenDisplaySmall} style={[styles.detailText, { color: colors.secondaryText }]}>
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
        fontSize: ms(13),
    },
    statusText: {
        fontSize: ms(13),
        fontWeight: '600',
    },
});

export default RequestInfoGroup;
