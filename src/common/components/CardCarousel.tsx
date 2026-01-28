import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { ms } from 'react-native-size-matters';
import { Spacing } from '../../theme/spacing';
import PaymentCard from './PaymentCard';
import { toggleInSet } from '../../utils/selectionUtils';
import { useGetCardDetails, type NIErrorResponse, NIThemeEnum } from '@networkinternational/ni-card-management-sdk'
import { TEST_INPUT } from '../../config/NISDKConfig';
import { useAuth } from '../../context/AuthContext';

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
}

const CardCarousel: React.FC<CardCarouselProps> = ({ data, onIndexChange, selectedIndex }) => {
  const { accessToken } = useAuth();
  const { result, error, onGetCardDetails } = useGetCardDetails();
  const [visibleCardIds, setVisibleCardIds] = useState<Set<string>>(new Set());
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<any>(null);

  console.log('NI SDK result:', result);
  console.log('NI SDK error:', error);

  useEffect(() => {
    if (selectedIndex !== undefined && selectedIndex >= 0 && selectedIndex < data.length) {
      flatListRef.current?.scrollToIndex({
        index: selectedIndex,
        animated: true,
      });
    }
  }, [selectedIndex, data.length]);

  const fetchCardSensitiveData = (cardIdentifierId: string) => {
    if (!accessToken) {
      console.warn('No access token available for fetching card details');
      return;
    }

    onGetCardDetails(
      TEST_INPUT(accessToken, cardIdentifierId),
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
      }
      }
    />
  );

  return (
    <View style={styles.cardListContainer}>
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.cardIdentifier}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={SNAP_INTERVAL}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: SIDE_SPACER,
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
            listener: (event: any) => {
              const offsetX = event.nativeEvent.contentOffset.x;
              const index = Math.round(offsetX / SNAP_INTERVAL);
              if (onIndexChange) {
                onIndexChange(index);
              }
            },
          },
        )}
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
        {data.map((_, i) => {
          const inputRange = [
            (i - 1) * SNAP_INTERVAL,
            i * SNAP_INTERVAL,
            (i + 1) * SNAP_INTERVAL,
          ];

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [ms(8), ms(40), ms(8)],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={i.toString()}
              style={[styles.dot, { width: dotWidth, opacity }]}
            />
          );
        })}
      </View>
    </View>
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
    height: ms(8),
    borderRadius: ms(4),
    marginHorizontal: ms(4),
    backgroundColor: '#00205b',
  },
});

export default CardCarousel;
