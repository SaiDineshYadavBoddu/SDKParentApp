import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';
import { ms } from 'react-native-size-matters';
import CustomText, { TextType } from './CustomText';
import CustomImage from './CustomImage';
import { Spacing } from '../../theme/spacing';
import { useTheme } from '../../theme/ThemeProvider';
import EyeSVG from '../../assets/svgs/EyeSVG';
import EyeOffSVG from '../../assets/svgs/EyeOffSVG';

interface CardData {
  cardIdentifier: string;
  maskedPan: string;
  expiryDate: string;
  cardholderName: string;
  balance: number;
  currencyCode: string;
  cardStatus: string;
  statusCause?: string;
  brand?: string;
}

interface PaymentCardProps {
  item: CardData;
  index: number;
  scrollX: any; // Reanimated SharedValue
  snapInterval: number;
  cardWidth: number;
  cardMargin: number;
  isDetailsVisible: boolean;
  onToggleVisibility: (id: string) => void;
  showEyeIcon?: boolean;
  sensitiveData?: any;
}

const PaymentCard: React.FC<PaymentCardProps> = ({
  item,
  index,
  scrollX,
  snapInterval,
  cardWidth,
  cardMargin,
  isDetailsVisible,
  onToggleVisibility,
  showEyeIcon = false,
  sensitiveData,
}) => {
  const { colors } = useTheme();
  const scaledTranslate = ms(40);

  const formatPAN = (pan?: string) => {
    if (!pan) return '**** **** **** ****';
    const clean = pan.replace(/[\s-]/g, '');
    const chunks = clean.match(/.{1,4}/g) || [];
    return chunks.join(' ');
  };

  const formatExpiry = (expiry?: string) => {
    if (!expiry || expiry.length !== 4) return '--/--';
    const mm = expiry.slice(2);
    const yy = expiry.slice(0, 2);
    return `${mm}/${yy}`;
  };

  const animatedStyle = useAnimatedStyle(() => {
    const baseOffset = index * snapInterval;
    const inputRange = [
      baseOffset - snapInterval,
      baseOffset,
      baseOffset + snapInterval,
    ];

    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8, 1, 0.8],
      Extrapolation.CLAMP
    );

    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [-scaledTranslate, 0, scaledTranslate],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }, { translateX }],
    };
  });

  return (
    <View
      style={[
        styles.cardWrapper,
        {
          width: cardWidth,
          marginHorizontal: cardMargin,
          zIndex: isDetailsVisible ? 999 : 0,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.card,
          animatedStyle,
        ]}
      >
        <CustomImage
          source={require('../../assets/images/cardbackground.png')}
          resizeMode="cover"
        />

        <CustomImage
          source={require('../../assets/images/LogoDefault.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {showEyeIcon && (
          <TouchableOpacity
            onPress={() => onToggleVisibility(item.cardIdentifier)}
            style={[styles.toggle, { zIndex: 20 }]}
          >
            {isDetailsVisible ? <EyeOffSVG /> : <EyeSVG />}
          </TouchableOpacity>
        )}

        <View style={styles.cardDetails}>
          <CustomText
            type={TextType.ImageLarge}
            style={{ paddingBottom: Spacing.s }}
          >
            {isDetailsVisible && sensitiveData?.clearPan
              ? formatPAN(sensitiveData.clearPan)
              : (() => {
                const masked = item.maskedPan || '';
                const clean = masked.replace(/[\s-]/g, '');
                if (clean.length < 12) return clean;
                const first = clean.slice(0, 4);
                const last = clean.slice(-4);
                return `${first} **** **** ${last}`;
              })()}
          </CustomText>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingBottom: Spacing.xl,
            }}
          >
            <CustomText type={TextType.ImageSmall}>
              {(() => {
                  const date = item.expiryDate || '';
                  const parts = date.split('-');
                  if (parts.length >= 2) {
                    const year = parts[0].slice(-2);
                    const month = parts[1];
                    return `${month}/${year}`;
                  }
                  return date;
                })()}
            </CustomText>
            <CustomText
              type={TextType.ImageSmall}
              style={{ marginLeft: ms(15) }}
            >
              {isDetailsVisible && sensitiveData?.clearCVV2
                ? sensitiveData.clearCVV2
                : '***'}
            </CustomText>
          </View>

          <CustomText type={TextType.ImageSmall}>
            {sensitiveData?.cardholderName || item.cardholderName}
          </CustomText>
        </View>

        <CustomImage
          source={require('../../assets/images/MastercardLogo.png')}
          style={styles.mastercardLogo}
          resizeMode="contain"
        />

      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardWrapper: {
    // Wrapper for spacing
  },
  card: {
    borderRadius: ms(16),
    overflow: 'hidden',
    height: ms(200),
    width: '100%',
  },
  toggle: {
    position: 'absolute',
    right: Spacing.xs,
    top: Spacing.xs,
  },
  logo: {
    position: 'absolute',
    left: Spacing.xl,
    top: Spacing.xl,
    width: ms(90),
    height: ms(24),
  },
  mastercardLogo: {
    position: 'absolute',
    right: Spacing.xl,
    bottom: Spacing.xl,
    width: ms(44),
    height: ms(26),
  },
  cardDetails: {
    position: 'absolute',
    left: Spacing.xl,
    bottom: Spacing.xl,
  },
});

export default PaymentCard;
