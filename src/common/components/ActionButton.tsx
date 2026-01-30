import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { ms } from 'react-native-size-matters';
import CustomText, { TextType } from './CustomText';
import { useTheme } from '../../theme/ThemeProvider';
import { Spacing } from '../../theme/spacing';

interface Props {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  showLabel?: boolean;
  style?: any;
}

export default function ActionButton({
  title,
  icon,
  onPress,
  disabled = false,
  loading = false,
  showLabel = true,
  style,
}: Props) {
  const { colors } = useTheme();
  const isDisabled = disabled || loading;

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.9}
        style={[
          styles.square,
          { backgroundColor: colors.surface, opacity: isDisabled ? 0.5 : 1 },
        ]}
      >
        {loading ? (
          <View style={[styles.loader, { borderColor: colors.outline }]} />
        ) : (
          <>
            <View style={styles.iconWrapper}>{icon}</View>
            {showLabel && (
              <View style={{ marginTop: Spacing.s }}>
                <CustomText type={TextType.ScreenDisplaySmall}>
                  {title}
                </CustomText>
              </View>
            )}
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const ICON_SIZE = ms(20);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  square: {
    width: ms(84),
    height: ms(80),
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  iconWrapper: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    borderWidth: ms(2),
    borderTopColor: 'transparent',
  },
});
