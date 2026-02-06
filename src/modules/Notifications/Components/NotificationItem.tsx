import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ms } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import { NotificationItem as NotificationType } from '../../../network/notification/notification.types';

interface NotificationItemProps {
  item: NotificationType;
  onPress?: () => void;
  onViewRequest?: () => void;
  onViewCard?: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ item, onPress, onViewRequest, onViewCard }) => {
  const { t } = useTranslation();
  const { colors } = useTheme();

  const getRelativeTime = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (checkDate.getTime() === today.getTime()) {
      return 'Today';
    } else if (checkDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    } else {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    }
  };

  const getBadgeColors = (type: string) => {
    switch (type) {
      case 'SUPPORT':
      case 'SUPPORT_REQUEST':
        return {
          bg: colors.onStatusSupport,
          dot: colors.statusSupport,
          text: colors.statusSupport,
        };
      case 'NEW_CARD':
        return {
          bg: colors.onStatusNewCard,
          dot: colors.statusNewCard,
          text: colors.statusNewCard,
        };
      case 'DISPUTE':
        return {
          bg: colors.onStatusNewCard,
          dot: colors.statusNewCard,
          text: colors.statusNewCard,
        };
      case 'ACTIVATE':
        return {
          bg: colors.onStatusActivation,
          dot: colors.statusActivation,
          text: colors.statusActivation,
        };
      case 'REPLACE':
        return {
          bg: colors.onStatusReplacement,
          dot: colors.statusReplacement,
          text: colors.statusReplacement,
        };
      case 'BLOCK':
        return {
          bg: colors.onStatusBlocked,
          dot: colors.statusBlocked,
          text: colors.statusBlocked,
        };
      case 'CLOSE':
        return {
          bg: colors.onStatusClosure,
          dot: colors.statusClosure,
          text: colors.statusClosure,
        };
      case 'CANCELLED':
        return {
          bg: colors.onStatusCancelled,
          dot: colors.statusCancelled,
          text: colors.statusCancelled,
        };
      case 'FAILED':
        return {
          bg: colors.onStatusFailed,
          dot: colors.statusFailed,
          text: colors.statusFailed,
        };
      default:
        // Generic fallback for other types
        return {
          bg: colors.outline + '20',
          dot: colors.secondaryText,
          text: colors.secondaryText,
        };
    }
  };

  const badgeColors = getBadgeColors(item.type);


  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: item.isRead ? colors.surface : colors.backgroundVariant }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {/* Line 1: ID and Date */}
        <View style={styles.headerRow}>
          <CustomText type={TextType.ScreenDisplaySmall} style={{ color: colors.secondaryText }}>
            {item.id}
          </CustomText>
          <View style={styles.rightInfo}>
            <CustomText type={TextType.ScreenDisplaySmall} style={{ color: colors.secondaryText }}>
              {getRelativeTime(item.createdAt)}
            </CustomText>
            {!item.isRead && <View style={[styles.unreadDot, { backgroundColor: colors.statusResolved }]} />}
          </View>
        </View>

        {/* Line 2: Message */}
        <CustomText type={TextType.Label} style={styles.title}>
          {item.title}
        </CustomText>

        {/* Line 3: Badge and View Request */}
        <View style={styles.footerRow}>
          <View style={[styles.badge, { backgroundColor: badgeColors.bg }]}>
            <View style={[styles.badgeDot, { backgroundColor: badgeColors.dot }]} />
            <CustomText type={TextType.CardSubtitle} style={[styles.badgeText, { color: badgeColors.text }]}>
              {item.typeDisplayName}
            </CustomText>
          </View>

          {item.subject?.toLowerCase() === "request" && (
            <TouchableOpacity onPress={onViewRequest}>
              <CustomText type={TextType.ScreenDisplaySmall} style={{ color: colors.primary, fontWeight: '600' }}>
                {t('notifications.viewRequest')}
              </CustomText>
            </TouchableOpacity>
          )}
          {item.subject?.toLowerCase() === "card" && (
            <TouchableOpacity onPress={onViewCard}>
              <CustomText type={TextType.ScreenDisplaySmall} style={{ color: colors.primary, fontWeight: '600' }}>
                {t('notifications.viewCard')}
              </CustomText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.m,
    borderRadius: ms(12),
    marginBottom: Spacing.m,
  },
  content: {
    gap: Spacing.s,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rightInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  unreadDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },
  title: {
    lineHeight: ms(20),
    fontWeight: '500',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(8),
    paddingVertical: ms(4),
    borderRadius: ms(4),
    gap: Spacing.xs,
  },
  badgeDot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
  },
  badgeText: {
    fontSize: ms(11),
    fontWeight: '600',
  },
});

export default NotificationItem;
