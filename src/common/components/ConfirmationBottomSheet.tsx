import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ms } from 'react-native-size-matters';
import { useTheme } from '../../theme/ThemeProvider';
import { Spacing } from '../../theme/spacing';
import CustomBottomSheet from './CustomBottomSheet';
import CustomText, { TextType } from './CustomText';
import CustomButton from './CustomButton';

interface ConfirmationBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
  confirmButtonColor?: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const ConfirmationBottomSheet: React.FC<ConfirmationBottomSheetProps> = ({
  visible,
  onClose,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  confirmButtonColor,
  isLoading = false,
  icon,
}) => {
  const { colors } = useTheme();

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <CustomBottomSheet
      visible={visible}
      onClose={onClose}
      title={title}
    >
      <View style={styles.container}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <CustomText
          type={TextType.CardText}
          style={[styles.message, { color: colors.secondaryText }]}
        >
          {message}
        </CustomText>

        <View style={styles.buttonContainer}>
          {cancelText && (
            <CustomButton
              title={cancelText}
              onPress={handleCancel}
              variant="outlined"
              style={styles.button}
              disabled={isLoading}
            />
          )}
          <CustomButton
            title={confirmText}
            onPress={handleConfirm}
            style={[
              styles.button,
              { backgroundColor: confirmButtonColor || colors.primary }
            ]}
            loading={isLoading}
            disabled={isLoading}
          />
        </View>
      </View>
    </CustomBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: Spacing.s,
  },
  message: {
    fontSize: ms(14),
    lineHeight: ms(22),
    marginBottom: Spacing.xl,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: Spacing.m,
  },
  button: {
    flex: 1,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: Spacing.m,
  },
});

export default ConfirmationBottomSheet;
