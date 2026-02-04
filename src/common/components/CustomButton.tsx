import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle,
  GestureResponderEvent,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import CustomText, { TextType } from './CustomText';
import { useTheme } from '../../theme/ThemeProvider';
import { Spacing } from '../../theme/spacing';

export type ButtonVariant = 'primary' | 'outlined' | 'text';

interface Props {
  title: string;
  onPress?: (e: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  uppercase?: boolean;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
}

export default function CustomButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  loading = false,
  uppercase = true,
  style,
  textColor: customTextColor,
}: Props) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  const backgroundColor = variant === 'primary'
    ? colors.primary
    : 'transparent';

  const borderColor = variant === 'outlined'
    ? (isDisabled ? '#E0E4E8' : colors.primary)
    : 'transparent';

  const borderWidth = variant === 'outlined' ? ms(1) : 0;

  const defaultTextColor = isDisabled
    ? (variant === 'primary' ? colors.onPrimary : colors.textColorDisabled)
    : variant === 'primary'
      ? colors.onPrimary
      : colors.primary;

  const textColor = customTextColor || defaultTextColor;

  const textType =
    variant === 'primary' ? TextType.Button : TextType.OutlinedButton;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.86}
      style={[
        styles.container,
        {
          backgroundColor,
          borderColor,
          borderWidth,
          opacity: isDisabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor} />
      ) : (
        <CustomText
          type={textType}
          uppercase={uppercase}
          style={{ color: textColor }}
        >
          {title}
        </CustomText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: ms(44),
    borderRadius: ms(8),
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.s,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
