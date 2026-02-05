import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ms } from 'react-native-size-matters';
import CustomText, { TextType } from '../../../common/components/CustomText';
import { Spacing } from '../../../theme/spacing';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../theme/ThemeProvider';
import { RequestItem } from '../../../network/requests/request.types';
import { getProgressStatusIcon, getProgressStatusColor, renderIcon } from '../../../utils/requestUtils';

interface RequestInfoGroupProps {
    item: RequestItem;
    dateUsage?: 'list' | 'detail';
}

const RequestInfoGroup: React.FC<RequestInfoGroupProps> = ({ item, dateUsage = 'list' }) => {
    const { t } = useTranslation();
    const { colors } = useTheme();

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        
        if (dateUsage === 'detail') {
             // Detail format: DD.MM.YYYY HH:MM:SS
            const hours = date.getHours().toString().padStart(2, '0');
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const seconds = date.getSeconds().toString().padStart(2, '0');
            return `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
        } else {
            // List format: Today, Yesterday, or DD.MM.YYYY
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            
            const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

            if (checkDate.getTime() === today.getTime()) {
                return 'Today'; // Should ideally use t('common.today')
            } else if (checkDate.getTime() === yesterday.getTime()) {
                return 'Yesterday'; // Should ideally use t('common.yesterday')
            } else {
                return `${day}.${month}.${year}`;
            }
        }
    };

    const getStatusToDisplay = () => {
        if (item.status === 'CANCELLED' || item.status === 'REJECTED') {
            return item.status;
        }
        if (item.resultStatus === 'FAILED') {
            return 'FAILED';
        }
        return item.status;
    };

    const statusToDisplay = getStatusToDisplay();
    const statusColor = getProgressStatusColor(statusToDisplay, colors);

    const isDetail = dateUsage === 'detail';
    const leftColumnStyle = [styles.leftColumn, isDetail ? { width: '55%' } : {}] as any;
    const rightColumnStyle = [styles.rightColumn, isDetail ? { width: '45%' } : {}] as any;

    return (
        <View style={styles.detailsContainer}>
            {/* Requester Row */}
            <View style={styles.detailRow}>
                <View style={leftColumnStyle}>
                    {renderIcon('clock')}
                    <CustomText type={TextType.ScreenDisplaySmall} style={[styles.detailText, { color: colors.secondaryText }]}>
                        {item.requester}
                    </CustomText>
                </View>

                <View style={rightColumnStyle}>
                    {getProgressStatusIcon(statusToDisplay, colors)}
                    <CustomText
                        type={TextType.ScreenDisplaySmall}
                        style={[styles.statusText, { color: statusColor }]}
                    >
                        {t(`requests.status.${statusToDisplay}`)}
                    </CustomText>
                </View>
            </View>

            {/* Approver or Creation Row */}
            <View style={styles.detailRow}>
                        <View style={leftColumnStyle}>
                            {renderIcon('check')}
                            <CustomText type={TextType.ScreenDisplaySmall} style={[styles.detailText, { color: colors.secondaryText }]}>
                                {item.approver}
                            </CustomText>
                        </View>
                        <View style={rightColumnStyle}>
                            {renderIcon('calendar')}
                            <CustomText type={TextType.ScreenDisplaySmall} style={[styles.detailText, { color: colors.secondaryText }]}>
                                {formatDate(item.createdAt)}
                            </CustomText>
                        </View>
            </View>
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
        width: '60%',
    },
    rightColumn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.s,
        width: '40%',
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