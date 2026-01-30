import React, { useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Modal,
  View,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import { useTheme } from '../../theme/ThemeProvider';
import { Spacing } from '../../theme/spacing';
import CustomText, { TextType } from './CustomText';
import CloseSVG from '../../assets/svgs/CloseSVG';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface CustomBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string | React.ReactNode;
  children: React.ReactNode;
  maxHeight?: number;
}

const CustomBottomSheet: React.FC<CustomBottomSheetProps> = ({
  visible,
  onClose,
  title,
  children,
  maxHeight = SCREEN_HEIGHT * 0.9,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [showModal, setShowModal] = React.useState(visible);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowModal(false);
      });
    }
  }, [visible, translateY, opacity]);

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      visible={showModal}
      transparent={true}
      statusBarTranslucent={true}
      animationType="none"
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={handleClose}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
              },
            ]}
          />
        </TouchableWithoutFeedback>
        <Animated.View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              transform: [{ translateY }],
              maxHeight,
              paddingBottom: Math.max(insets.bottom, Spacing.l),
            },
          ]}
        >
          <View style={[styles.header, { borderBottomColor: colors.outline }]}>
            {title && (
              typeof title === 'string' ? (
                <CustomText type={TextType.SectionTitle}>{title}</CustomText>
              ) : (
                title
              )
            )}
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <CloseSVG width={ms(28)} height={ms(28)} color={colors.onBackground} />
            </TouchableOpacity>
          </View>
          <View style={styles.content}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    borderTopLeftRadius: ms(24),
    borderTopRightRadius: ms(24),
    minHeight: ms(200),
    elevation: 20,
    zIndex: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.l,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  closeButton: {
    padding: ms(4),
  },
  content: {
    padding: Spacing.l,
    flexShrink: 1,
  },
});

export default CustomBottomSheet;
