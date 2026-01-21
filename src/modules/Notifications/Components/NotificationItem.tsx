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
    const now = new Date();
    const date = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return t('notifications.relativeTime.justNow');
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;

    // Otherwise show date like "15 Sep"
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return date.toLocaleDateString('en-GB', options);
  };

  const getBadgeColors = (type: string) => {
    switch (type) {
      case 'SUPPORT_REQUEST':
        return {
          bg: colors.warningContainer,
          dot: colors.statusUnblocking,
          text: colors.statusUnblocking,
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
