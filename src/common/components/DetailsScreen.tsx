import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { ms } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import SectionContainer, { SectionItem } from './SectionContainer';
import CustomHeader from './CustomHeader';
import CustomText, { TextType } from './CustomText';
import { useTheme } from '../../theme/ThemeProvider';
import { Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';

export interface DetailItem {
  id: string;
  label: string;
  value?: string | null;
  actionLabel?: string;
  onActionPress?: () => void;
  rightContent?: React.ReactNode;
}

export interface DetailsSection {
  title?: string;
  items: DetailItem[];
}

interface Props {
  title: string;
  sections: DetailsSection[];
  onBackPress?: () => void;
  children?: React.ReactNode;
}

export default function DetailsScreen({ title, sections, onBackPress, children }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const Separator = () => (
    <View
      style={{
        height: 1,
        backgroundColor: colors.outline,
        marginHorizontal: Spacing.l,
      }}
    />
  );

  const renderLabel = (label: string) => (
    <CustomText type={TextType.CardTitle} style={{ marginBottom: ms(4), color: colors.onSurface }}>
      {t(label)}
    </CustomText>
  );

  const renderValue = (value?: string | null) => (
    <CustomText
      type={TextType.CardText}
      style={{ color: value ? colors.secondaryText : colors.textColor }}
    >
      {value ?? '-'}
    </CustomText>
  );

  const renderAction = (label: string, onPress?: () => void) => (
    <CustomText
      type={TextType.ActionLabel}
      onPress={onPress}
      style={{ color: colors.primary, fontWeight: '500' }}
    >
      {t(label)}
    </CustomText>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader
        title={title}
        onBackPress={onBackPress}
        titleStyle={{ fontWeight: Typography.headlineMedium.fontWeight }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {children}
        {sections.map((section, index) => {
          const sectionItems: SectionItem[] = section.items.map(item => ({
            id: item.id,
            top: renderLabel(item.label),
            middle: item.value !== null ? renderValue(item.value) : undefined,
            end: item.rightContent ? (
              item.rightContent
            ) : item.actionLabel ? (
              renderAction(item.actionLabel, item.onActionPress)
            ) : undefined,
            style: styles.innerCard,
          }));

          return (
            <View key={index} style={{ marginBottom: Spacing.m }}>
              {section.title && (
                <CustomText
                  type={TextType.SectionTitle}
                  style={{
                    marginBottom: Spacing.s,
                    paddingHorizontal: Spacing.l,
                  }}
                >
                  {t(section.title)}
                </CustomText>
              )}
              <SectionContainer
                items={sectionItems}
                style={styles.card}
                contentStyle={[styles.cardContent, { backgroundColor: colors.surface }]}
                ItemSeparatorComponent={Separator}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  card: {
    borderRadius: 0,
    paddingHorizontal: 0,
    paddingVertical: 0,
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: 'transparent',
  },
  cardContent: {
    paddingVertical: ms(16),
  },
  rightButton: {
    padding: ms(6),
    marginRight: -ms(6),
  },
  innerCard: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    paddingHorizontal: Spacing.l, 
    paddingVertical: Spacing.l
  },
});
