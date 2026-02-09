import React, { memo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ms } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../theme/ThemeProvider';
import CustomText, { TextType } from '../../../common/components/CustomText';
import { Spacing } from '../../../theme/spacing';
import { getStatusColors } from '../../../utils/requestUtils';
import { RequestItem } from '../../../network/requests/request.types';
import RequestInfoGroup from './RequestInfoGroup';

interface RequestListItemProps {
    item: RequestItem;
    onPress: (item: RequestItem) => void;
}

const RequestListItem: React.FC<RequestListItemProps> = ({ item, onPress }) => {
    const { colors } = useTheme();
    const { t } = useTranslation();

    const mainAction = item?.actions?.[0];
    const { backgroundColor, textColor } = getStatusColors(
        item.status === 'CANCELLED' || item.status === 'REJECTED' || item.status === 'FAILED'
            ? item.status
            : mainAction?.actionType || 'default',
        colors,
    );

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => onPress(item)}
            style={[styles.requestCard, { backgroundColor: colors.surface }]}
        >
            {/* Header Row */}
            <View style={styles.headerRow}>
                <CustomText
                    type={TextType.CardTitle}
                    style={[styles.requestID, { color: colors.onSurface }]}
                >
                    {t('requests.idPrefix')} {item.id}
                </CustomText>
                <View style={[styles.badge, { backgroundColor }]}>
                    <View style={[styles.badgeDot, { backgroundColor: textColor }]} />
                    <CustomText
                        type={TextType.CardSubtitle}
                        style={[styles.badgeText, { color: textColor }]}
                    >
                        {mainAction?.displayName || t(`requests.status.${item.status}`)}
                    </CustomText>
                </View>
            </View>

            {/* Details Rows */}
            <RequestInfoGroup item={item} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    requestCard: {
        borderRadius: ms(16),
        padding: ms(16),
        gap: Spacing.m,
        marginBottom: ms(12),
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    requestID: {
        fontWeight: '700',
        fontSize: ms(14),
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: ms(8),
        paddingVertical: ms(4),
        borderRadius: ms(12),
        gap: ms(4),
    },
    badgeDot: {
        width: ms(6),
        height: ms(6),
        borderRadius: ms(3),
    },
    badgeText: {
        fontSize: ms(11),
        fontWeight: '500',
    },
});

export default memo(RequestListItem);
