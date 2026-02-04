// components/SectionContainer.tsx
import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import CustomText, { TextType } from './CustomText';
import FlexibleCard from './FlexibleCard';
import { Spacing } from '../../theme/spacing';
import { useTheme } from '../../theme/ThemeProvider';
import CustomLoader from './CustomLoader';

export type SectionItem = {
  id: string;
  start?: React.ReactNode;
  top?: React.ReactNode;
  middle?: React.ReactNode;
  end?: React.ReactNode;
  body?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

interface Props {
  title?: string; // ... existing props
  rightTitle?: string;
  onRightTitlePress?: () => void;
  items: SectionItem[];
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  ListEmptyComponent?:
  | React.ComponentType<any>
  | React.ReactElement
  | null
  | undefined;
  ItemSeparatorComponent?: React.ComponentType<any> | null | undefined;
  emptyMessage?: string;
  loading?: boolean;
}

export default function SectionContainer({
  title,
  rightTitle,
  onRightTitlePress,
  items,
  style,
  contentStyle,
  ListEmptyComponent,
  ItemSeparatorComponent,
  emptyMessage,
  loading,
}: Props) {
  const { colors } = useTheme();

  const renderItem = ({ item }: ListRenderItemInfo<SectionItem>) => {
    return (
      <FlexibleCard
        start={item.start}
        top={item.top}
        middle={item.middle}
        end={item.end}
        body={item.body}
        onPress={item.onPress}
        style={[item.style, {shadowOpacity : 0}]}
        disabled={item.disabled}
      />
    );
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.surface }, style]}>
      {title ? (
        <View style={styles.headerRow}>
          <CustomText type={TextType.SectionTitle}>{title}</CustomText>
          {rightTitle && items.length > 0 && (
            <TouchableOpacity onPress={onRightTitlePress}>
              <CustomText
                type={TextType.ActionLabel}
                style={{ color: colors.primary }}
              >
                {rightTitle}
              </CustomText>
            </TouchableOpacity>
          )}
        </View>
      ) : null}

      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        ListEmptyComponent={
          loading ? (
            <View style={styles.emptyContainer}>
              <CustomLoader loading={true} />
            </View>
          ) : (
            ListEmptyComponent ??
            (emptyMessage ? (
              <View style={styles.emptyContainer}>
                <CustomText type={TextType.CardText} style={[styles.emptyText, { color: colors.secondaryText }]}>
                  {emptyMessage}
                </CustomText>
              </View>
            ) : null)
          )
        }
        ItemSeparatorComponent={
          ItemSeparatorComponent ??
          (() => <View style={{ height: Spacing.s }} />)
        }
        contentContainerStyle={[
          styles.content,
          contentStyle,
          items.length === 0 && { paddingVertical: Spacing.m },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    paddingVertical: ms(12),
    paddingHorizontal: ms(18),
    borderRadius: ms(20),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1,
  },
  headerRow: {
    paddingVertical: ms(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    width: '100%',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.m,
  },
  emptyText: {
    textAlign: 'center',
  },
});
