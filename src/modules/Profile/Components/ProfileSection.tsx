import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ms } from 'react-native-size-matters';
import SectionContainer, {
  SectionItem,
} from '../../../common/components/SectionContainer';
import CustomText, { TextType } from '../../../common/components/CustomText';
import ChevronSVG from '../../../assets/svgs/ChevronSVG';
import { Spacing } from '../../../theme/spacing';
import { useTheme } from '../../../theme/ThemeProvider';

export interface ProfileItemProps {
  id: string;
  title: string;
  subtitle?: string;
  Icon: React.ElementType; // Renamed to Icon for clarity as Component
  onPress?: () => void;
}

interface Props {
  title?: string;
  items: ProfileItemProps[];
}

export default function ProfileSection({ title, items }: Props) {
  const { colors } = useTheme();

  const renderIcon = (Icon: React.ElementType) => (
    <View style={[styles.iconContainer, { backgroundColor: colors.filterButtonBg }]}>
      <Icon width={ms(24)} height={ms(24)} />
    </View>
  );

  const renderText = (title: string, subtitle?: string) => (
    <View style={styles.textContainer}>
      <CustomText type={TextType.CardTitle}>{title}</CustomText>
      {subtitle && (
        <CustomText
          type={TextType.CardText}
          style={{ color: colors.secondaryText, marginTop: ms(2) }}
        >
          {subtitle}
        </CustomText>
      )}
    </View>
  );

  const renderChevron = () => (
    <View style={styles.chevron}>
      <ChevronSVG width={ms(16)} height={ms(16)} color={colors.primary} />
    </View>
  );

  return (
    <View style={styles.container}>
      {title && (
        <CustomText type={TextType.ScreenDisplaySmall} style={styles.header}>
          {title}
        </CustomText>
      )}

      {items.map(item => {
        const sectionItems: SectionItem[] = [
          {
            id: item.id,
            start: renderIcon(item.Icon),
            middle: renderText(item.title, item.subtitle),
            end: renderChevron(),
            onPress: item.onPress,
          },
        ];

        return (
          <View key={item.id} style={{ marginBottom: Spacing.m }}>
            <SectionContainer
              items={sectionItems}
              contentStyle={styles.content}
              style={styles.card}
            />
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: Spacing.l,
    paddingBottom: Spacing.l,
  },
  header: {
    marginBottom: Spacing.m,
    paddingLeft: ms(4),
    fontWeight: '500',
  },
  content: {
    paddingVertical: 0,
  },
  card: {
    paddingVertical: ms(8),
  },
  iconContainer: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevron: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    gap: ms(4),
  },
});
