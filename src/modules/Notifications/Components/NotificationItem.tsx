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
}

const NotificationItem: React.FC<NotificationItemProps> = ({ item, onPress, onViewRequest }) => {
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

  const getInitial = (title: string) => {
    return title.charAt(0).toUpperCase();
  };

  return (
    <TouchableOpacity 
        style={[styles.container, { backgroundColor: item.isRead ? colors.surface : colors.backgroundVariant }]} 
        onPress={onPress}
        activeOpacity={0.8}
    >
      <View style={styles.contentRow}>
        <View style={styles.textContainer}>
          <CustomText type={TextType.Label} style={styles.title}>
            {item.title}
          </CustomText>
          
          <View style={styles.footerRow}>
             {item.type === 'SUPPORT_REQUEST' ? (
                <View style={[styles.badge, { backgroundColor: colors.warningContainer }]}>
                    <View style={[styles.badgeDot, { backgroundColor: colors.statusUnblocking }]} />
                    <CustomText type={TextType.CardSubtitle} style={[styles.badgeText, { color: colors.statusUnblocking }]}>
                        {item.typeDisplayName}
                    </CustomText>
                </View>
             ) : <View />}
          </View>
        </View>

        <View style={styles.rightColumn}>
          <View style={styles.rightInfo}>
            <CustomText type={TextType.ScreenDisplaySmall} style={{ color: colors.secondaryText }}>
              {getRelativeTime(item.createdAt)}
            </CustomText>
            {!item.isRead && <View style={[styles.unreadDot, { backgroundColor: colors.statusResolved }]} />}
          </View>
          
          <View style={{ flex: 1 }} />

          <TouchableOpacity onPress={onViewRequest}>
              <CustomText type={TextType.ScreenDisplaySmall} style={{ color: colors.primary, fontWeight: '600' }}>
                  {t('notifications.viewRequest')}
              </CustomText>
          </TouchableOpacity>
        </View>

        {!item.isRead && (
            <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                <CustomText type={TextType.Button} style={{ color: colors.onPrimary, fontSize: ms(16) }}>
                    {getInitial(item.title)}
                </CustomText>
            </View>
        )}
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
  rightInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    justifyContent: 'flex-end',
  },
  unreadDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'stretch', // Allow right column to take full height
    gap: Spacing.m,
  },
  textContainer: {
    flex: 1,
  },
  rightColumn: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    minWidth: ms(80),
  },
  title: {
    marginBottom: Spacing.s,
    lineHeight: ms(20),
    fontWeight: '500',
    paddingRight: ms(20), // Leave space for time/avatar if needed
  },
  avatar: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: -Spacing.s,
    top: -ms(10),
    // shadow for pop effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
