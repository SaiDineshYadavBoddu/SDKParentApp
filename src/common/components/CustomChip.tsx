import React from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { ms } from 'react-native-size-matters';
import { useTheme } from '../../theme/ThemeProvider';
import { Spacing } from '../../theme/spacing';
import CustomText, { TextType } from './CustomText';

interface CustomChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

const CustomChip: React.FC<CustomChipProps> = ({
  label,
  selected,
  onPress,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : '#F5F5F5',
        },
        style,
      ]}
      activeOpacity={0.7}
    >
      <CustomText
        type={TextType.CardText}
        style={{
          color: selected ? '#FFF' : '#666',
          fontWeight: selected ? '600' : '400',
        }}
      >
        {label}
      </CustomText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderRadius: ms(8),
  },
});

export default CustomChip;

