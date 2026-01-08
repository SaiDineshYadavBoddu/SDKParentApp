import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { ms } from 'react-native-size-matters';
import CustomText, { TextType } from './CustomText';
import CustomIcon from './CustomIcon';
import CustomImage from './CustomImage';
import { Spacing } from '../../theme/spacing';

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
  scrollX: Animated.Value;
  snapInterval: number;
  cardWidth: number;
  cardMargin: number;
  isDetailsVisible: boolean;
  onToggleVisibility: (id: string) => void;
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
}) => {
  const inputRange = [
    (index - 1) * snapInterval,
    index * snapInterval,
    (index + 1) * snapInterval,
  ];

  const scale = scrollX.interpolate({
    inputRange,
    outputRange: [0.8, 1, 0.8],
    extrapolate: 'clamp',
  });

  const translateX = scrollX.interpolate({
    inputRange,
    outputRange: [-ms(40), 0, ms(40)],
    extrapolate: 'clamp',
  });

  const zIndex = scrollX.interpolate({
    inputRange,
    outputRange: [0, 1, 0],
    extrapolate: 'clamp',
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
          {
            transform: [{ scale }, { translateX }],
            zIndex,
          },
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

        <TouchableOpacity
          onPress={() => onToggleVisibility(item.cardIdentifier)}
          style={styles.toggle}
        >
          <CustomIcon
            type="feather"
            name={isDetailsVisible ? 'eye' : 'eye-off'}
            size={ms(24)}
            color="white"
          />
        </TouchableOpacity>

        <View style={styles.cardDetails}>
          <CustomText
            type={TextType.ImageLarge}
            style={{ paddingBottom: Spacing.s }}
          >
            {isDetailsVisible
              ? item.cardIdentifier
              : (() => {
                let masked = item.maskedPan || '';
                if (masked.length >= 6) {
                  // Mask 5th and 6th characters (index 4 and 5)
                  masked =
                    masked.substring(0, 4) + '**' + masked.substring(6);
                }
                // Basic formatting: grouping by 4 if possible, otherwise just return
                return masked.replace(/(.{4})/g, '$1 ').trim();
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
                if (!isDetailsVisible) return '**/**';
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
              {'***'}
            </CustomText>
          </View>

          <CustomText type={TextType.ImageSmall}>
            {item.cardholderName}
          </CustomText>
        </View>

        <CustomImage
          source={require('../../assets/images/MastercardLogo.png')}
          style={styles.mastercardLogo}
          resizeMode="contain"
        />

        {(item.cardStatus === 'Blocked' && item.statusCause === 'TempBlocked') && (
          <View style={styles.blockOverlay} />
        )}
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
    right: Spacing.xl,
    top: Spacing.xl,
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
  blockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    zIndex: 10,
  },
});

export default PaymentCard;
