import React, { useEffect, useRef, useState } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Animated,
  StyleProp,
  ViewStyle,
  Easing,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import CustomText, { TextType } from './CustomText';
import { Spacing } from '../../theme/spacing';
import { useTheme } from '../../theme/ThemeProvider';
import { useTranslation } from 'react-i18next';

interface CustomLoaderProps {
  loading: boolean;
  title?: string;
  subtitle?: string;
  overlayStyle?: StyleProp<ViewStyle>;
}

const CapsuleIndicator = ({ colors }: { colors: any }) => {
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [rotation]);

  const numCapsules = 8;
  const radius = ms(20);

  return (
    <View style={styles.indicatorContainer}>
      {Array.from({ length: numCapsules }).map((_, i) => {
        const angle = (i * 360) / numCapsules;
        const normalizedIndex = i / numCapsules;
        
        // Color trailing effect matching image: Black outlines, white inside, one light blue active
        const backgroundColor = rotation.interpolate({
          inputRange: [
            0,
            Math.max(0, (i - 1) / numCapsules),
            i / numCapsules,
            1
          ],
          outputRange: [colors.surface, colors.surface, colors.primaryContainer, colors.surface],
          extrapolate: 'clamp',
        });

        return (
          <Animated.View
            key={i}
            style={[
              styles.capsule,
              {
                backgroundColor,
                borderColor: colors.onBackground,
                transform: [
                  { rotate: `${angle}deg` },
                  { translateY: -radius },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const CustomLoader: React.FC<CustomLoaderProps> = ({
  loading,
  title,
  subtitle,
  overlayStyle,
}) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={loading}
      onRequestClose={() => { }}
      statusBarTranslucent={true}
    >
      <View style={styles.container}>
        <View style={[styles.overlay, { backgroundColor: colors.inverseSurface + '80' }, overlayStyle]} />
        <View style={[styles.card, { width: '90%', backgroundColor: colors.surface }]}>
          <CapsuleIndicator colors={colors} />
          
          <View style={styles.textContainer}>
            <CustomText type={TextType.ScreenHeadlineSmall} style={[styles.titleText, { color: colors.onBackground }]}>
              {title ?? t('loader.title')}
            </CustomText>
            <CustomText type={TextType.CardText} style={[styles.subtitleText, { color: colors.secondaryText }]}>
              {subtitle ?? t('loader.subtitle')}
            </CustomText>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  card: {
    padding: ms(40),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: ms(16),
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    gap: ms(32),
  },
  indicatorContainer: {
    width: ms(70),
    height: ms(70),
    justifyContent: 'center',
    alignItems: 'center',
  },
  capsule: {
    position: 'absolute',
    width: ms(13),
    height: ms(7),
    borderRadius: ms(3.5),
    borderWidth: ms(2),
  },
  textContainer: {
    alignItems: 'center',
    gap: ms(12),
  },
  titleText: {
    fontSize: ms(24),
    fontWeight: '700',
  },
  subtitleText: {
    textAlign: 'center',
    fontSize: ms(14),
    lineHeight: ms(20),
    paddingHorizontal: ms(20),
  },
});

export default CustomLoader;

