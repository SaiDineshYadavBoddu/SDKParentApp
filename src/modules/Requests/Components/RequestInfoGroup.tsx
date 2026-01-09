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
}

const RequestInfoGroup: React.FC<RequestInfoGroupProps> = ({ item }) => {
    const { t } = useTranslation();
    const { colors } = useTheme();

    const requesterStatusColor = getProgressStatusColor(item.status, colors);

    return (
        <View style={styles.detailsContainer}>
            {/* Requester Row */}
            <View style={styles.detailRow}>
                <View style={styles.leftColumn}>
                    {renderIcon('clock')}
                    <CustomText type={TextType.ScreenDisplaySmall} style={[styles.detailText, { color: colors.secondaryText }]}>
                        {item.requester}
                    </CustomText>
                </View>

                <View style={styles.rightColumn}>
                    {getProgressStatusIcon(item.status, colors)}
                    <CustomText
                        type={TextType.ScreenDisplaySmall}
                        style={[styles.statusText, { color: requesterStatusColor }]}
                    >
                        {t(`requests.status.${item.status}`)}
                    </CustomText>
                </View>
            </View>

            {/* Approver or Creation Row */}
            <View style={styles.detailRow}>
                {/* {item.approver ? (
                    <> */}
                        <View style={styles.leftColumn}>
                            {renderIcon('check')}
                            <CustomText type={TextType.ScreenDisplaySmall} style={[styles.detailText, { color: colors.secondaryText }]}>
                                {item.approver}
                            </CustomText>
                        </View>
                        <View style={styles.rightColumn}>
                            {renderIcon('calendar')}
                            <CustomText type={TextType.ScreenDisplaySmall} style={[styles.detailText, { color: colors.secondaryText }]}>
                                {new Date(item.approval?.approvedAt || item.lastModifiedAt).toLocaleDateString()}
                            </CustomText>
                        </View>
                    {/* </>
                ) : (
                    <>
                        <View style={styles.leftColumn}>
                            {renderIcon('clock')}
                            <CustomText type={TextType.ScreenDisplaySmall} style={[styles.detailText, { color: colors.secondaryText }]}>
                                {item.status === 'CANCELLED' ? t('requests.cancelledAt') : t('requests.createdAt')}
                            </CustomText>
                        </View>
                        <View style={styles.rightColumn}>
                            {renderIcon('calendar')}
                            <CustomText type={TextType.ScreenDisplaySmall} style={[styles.detailText, { color: colors.secondaryText }]}>
                                {new Date(item.status === 'CANCELLED' ? item.lastModifiedAt : item.createdAt).toLocaleDateString()}
                            </CustomText>
                        </View>
                    </>
                )} */}
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
