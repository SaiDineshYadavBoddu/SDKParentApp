import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  runOnJS,
} from 'react-native-reanimated';
import { ms } from 'react-native-size-matters';
import { Spacing } from '../../theme/spacing';
import PaymentCard from './PaymentCard';
import { toggleInSet } from '../../utils/selectionUtils';
import { useTheme } from '../../theme/ThemeProvider';
import { useGetCardDetails, type NIErrorResponse } from '@networkinternational/ni-card-management-sdk'
import { TEST_INPUT } from '../../config/NISDKConfig';
import { useAuth, getGlobalBankId } from '../../context/AuthContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = ms(5);
const CARD_WIDTH = SCREEN_WIDTH * 0.85;
const SNAP_INTERVAL = CARD_WIDTH + CARD_MARGIN * 2;
const SIDE_SPACER = (SCREEN_WIDTH - SNAP_INTERVAL) / 2;

interface CardData {
  cardIdentifier: string;
  maskedPan: string;
  expiryDate: string;
  cardholderName: string;
  balance: number;
  currencyCode: string;
  cardStatus: string;
  statusCause?: string;
}

interface CardCarouselProps {
  data: CardData[];
  onIndexChange?: (index: number) => void;
  selectedIndex?: number;
  showEyeIcon?: boolean;
}

const CardCarousel: React.FC<CardCarouselProps> = ({ data, onIndexChange, selectedIndex, showEyeIcon }) => {
  const { colors } = useTheme();
  const { accessToken } = useAuth();
  const { result, error, onGetCardDetails } = useGetCardDetails();
  const [visibleCardIds, setVisibleCardIds] = useState<Set<string>>(new Set());
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(selectedIndex || 0);

  console.log('NI SDK result:', result);
  console.log('NI SDK error:', error);

  useEffect(() => {
    if (selectedIndex !== undefined && selectedIndex !== currentIndex && selectedIndex >= 0 && selectedIndex < data.length) {
      setCurrentIndex(selectedIndex);
      // Use requestAnimationFrame to ensure FlatList has measured or is ready
      requestAnimationFrame(() => {
        try {
          flatListRef.current?.scrollToIndex({
            index: selectedIndex,
            animated: true,
          });
        } catch (e) {
          // Silent catch for potential ref errors during unmount or rapid updates
        }
      });
    }
  }, [selectedIndex, data.length, currentIndex]);

  const fetchCardSensitiveData = (cardIdentifierId: string) => {
    if (!accessToken) {
      console.warn('No access token available for fetching card details');
      return;
    }

    const bankId = getGlobalBankId();
    if (!bankId) {
      console.warn('No bank ID available from token');
      return;
    }

    onGetCardDetails(
      TEST_INPUT(accessToken, cardIdentifierId, bankId),
      (error: NIErrorResponse | null, result: string | null) => {
        console.log('NI SDK error:', error);
        console.log('NI SDK result:', result);
      },
    );
  };

  const toggleCardVisibility = (cardIdentifier: string) => {
    const isBecomingVisible = !visibleCardIds.has(cardIdentifier);
    if (isBecomingVisible) {
      fetchCardSensitiveData(cardIdentifier);
    }
    setVisibleCardIds(prev => toggleInSet(prev, cardIdentifier));
  };

  const currentIndexRef = useRef(currentIndex);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const handleIndexChange = React.useCallback((index: number) => {
    if (index !== currentIndexRef.current) {
      setCurrentIndex(index);
      if (onIndexChange) {
        onIndexChange(index);
      }
    }
  }, [onIndexChange]);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
    onMomentumEnd: (event) => {
      const index = Math.round(event.contentOffset.x / SNAP_INTERVAL);
      runOnJS(handleIndexChange)(index);
    },
  });

  const renderItem = ({ item, index }: { item: CardData; index: number }) => (
    <PaymentCard
      item={item}
      index={index}
      scrollX={scrollX}
      snapInterval={SNAP_INTERVAL}
      cardWidth={CARD_WIDTH}
      cardMargin={CARD_MARGIN}
      isDetailsVisible={visibleCardIds.has(item.cardIdentifier)}
      onToggleVisibility={() => {
        toggleCardVisibility(item.cardIdentifier)
      }}
      showEyeIcon={showEyeIcon}
    />
  );

  return (
    <View style={styles.cardListContainer}>
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.cardIdentifier}
        initialScrollIndex={selectedIndex && selectedIndex > 0 ? selectedIndex : undefined}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="start"
        decelerationRate="fast"
        disableIntervalMomentum={true}
        contentContainerStyle={{
          paddingHorizontal: SIDE_SPACER,
        }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        removeClippedSubviews={false}
        getItemLayout={(_, index) => ({
          length: SNAP_INTERVAL,
          offset: SNAP_INTERVAL * index,
          index,
        })}
        style={{ overflow: 'visible' }}
      />
      <View style={styles.paginatorContainer}>
        {data.map((_, i) => (
          <Dot i={i} scrollX={scrollX} colors={colors} key={i.toString()} />
        ))}
      </View>
    </View>
  );
};

const Dot = ({ i, scrollX, colors }: { i: number; scrollX: any; colors: any }) => {
  const animatedDotStyle = useAnimatedStyle(() => {
    const baseOffset = i * SNAP_INTERVAL;
    const dotScaleX = interpolate(
      scrollX.value,
      [baseOffset - SNAP_INTERVAL, baseOffset, baseOffset + SNAP_INTERVAL],
      [1, 2, 1],
      Extrapolation.CLAMP
    );

    const backgroundColorValue = interpolate(
      scrollX.value,
      [baseOffset - SNAP_INTERVAL, baseOffset, baseOffset + SNAP_INTERVAL],
      [0, 1, 0], // Map to numeric values for color interpolation
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scaleX: dotScaleX }],
      backgroundColor: backgroundColorValue > 0.5 ? colors.onPrimary : colors.primaryContainer,
    };
  });

  return (
    <Animated.View
      style={[
        styles.dot,
        animatedDotStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  cardListContainer: {
    marginBottom: Spacing.xl,
  },
  paginatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.l,
  },
  dot: {
    width: ms(12),
    height: ms(8),
    borderRadius: ms(4),
    marginHorizontal: ms(4),
  },
});

export default CardCarousel;
