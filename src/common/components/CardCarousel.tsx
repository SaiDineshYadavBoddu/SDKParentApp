import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { View, StyleSheet, Dimensions, AppState } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
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
import ConfirmationBottomSheet from './ConfirmationBottomSheet';
import FailureSVG from '../../assets/svgs/FailureSVG';
import CustomLoader from './CustomLoader';
import { useTheme } from '../../theme/ThemeProvider';
import { useGetCardDetails, type NIErrorResponse } from '@networkinternational/ni-card-management-sdk'
import { TEST_INPUT } from '../../config/NISDKConfig';
import { useAuth, getGlobalBankId } from '../../context/AuthContext';
import { useSecondaryAuth } from '../../hooks/useSecondaryAuth';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_MARGIN = ms(5);
const CARD_WIDTH = SCREEN_WIDTH * 0.9;
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
  refreshing?: boolean;
}

const CardCarousel: React.FC<CardCarouselProps> = ({ data, onIndexChange, selectedIndex, showEyeIcon, refreshing }) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { accessToken } = useAuth();
  const { startAuthFlow } = useSecondaryAuth();
  const { result, error, onGetCardDetails } = useGetCardDetails();
  const [visibleCardIds, setVisibleCardIds] = useState<Set<string>>(new Set());
  const [fetchingCardId, setFetchingCardId] = useState<string | null>(null);
  const [showErrorSheet, setShowErrorSheet] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<any>(null);
  const [currentIndex, setCurrentIndex] = useState(selectedIndex || 0);
  const isFocused = useIsFocused();

  // console.log("Ni SDK result log", result)
  // console.log("Ni SDK error log", error)

  // Reset visibility when screen loses focus
  useEffect(() => {
    if (!isFocused) {
      setVisibleCardIds(new Set());
    }
  }, [isFocused]);

  // Hide details when refreshing
  useEffect(() => {
    if (refreshing) {
      setVisibleCardIds(new Set());
      setFetchingCardId(null);
    }
  }, [refreshing]);

  // Hide details when app goes to background
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState.match(/inactive|background/)) {
        setVisibleCardIds(new Set());
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);


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

  const fetchCardSensitiveData = useCallback((cardIdentifierId: string, actionToken?: string) => {
    if (!accessToken) {
      console.warn('No access token available for fetching card details');
      return;
    }

    const bankId = getGlobalBankId();
    if (!bankId) {
      console.warn('No bank ID available from token');
      return;
    }

    setIsFetchingDetails(true);
    onGetCardDetails(
      TEST_INPUT(accessToken, cardIdentifierId, bankId, actionToken),
      (error: NIErrorResponse | null, result: string | null) => {
        setIsFetchingDetails(false);
        if (error) {
          setShowErrorSheet(true);
          setVisibleCardIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(cardIdentifierId);
            return newSet;
          });
          setFetchingCardId(null);
        }
      },
    );
  }, [accessToken, onGetCardDetails]);

  const toggleCardVisibility = useCallback((cardIdentifier: string) => {
    const isBecomingVisible = !visibleCardIds.has(cardIdentifier);
    if (isBecomingVisible) {
      startAuthFlow({
        onSuccess: async (token: string) => {
          setFetchingCardId(cardIdentifier);
          fetchCardSensitiveData(cardIdentifier, token);
          setVisibleCardIds(prev => toggleInSet(prev, cardIdentifier));
        },
        selectionTitle: 'cardDetails.authTitle',
        selectionSubtitle: 'cardDetails.authSubtitle',
      });
    } else {
      if (fetchingCardId === cardIdentifier) {
        setFetchingCardId(null);
      }
      setVisibleCardIds(prev => toggleInSet(prev, cardIdentifier));
    }
  }, [visibleCardIds, fetchCardSensitiveData, fetchingCardId, startAuthFlow]);

  const currentIndexRef = useRef(currentIndex);
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);

  const handleIndexChange = React.useCallback((index: number) => {
    if (index !== currentIndexRef.current) {
      setCurrentIndex(index);
      // Reset visibility when swiping to a new card
      setVisibleCardIds(new Set());
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

  const renderItem = useCallback(({ item, index }: { item: CardData; index: number }) => (
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
      sensitiveData={fetchingCardId === item.cardIdentifier ? result : null}
    />
  ), [visibleCardIds, scrollX, showEyeIcon, toggleCardVisibility, fetchingCardId, result]);

  return (
    <View style={styles.cardListContainer}>
      <Animated.FlatList
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.cardIdentifier ?? 'card'}-${index}`}
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
        onScrollBeginDrag={() => setVisibleCardIds(new Set())}
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
      <ConfirmationBottomSheet
        visible={showErrorSheet}
        onClose={() => setShowErrorSheet(false)}
        title={t('cardDetails.errorTitle')}
        message={t('cardDetails.errorMessage')}
        confirmText={t('common.done')}
        onConfirm={() => setShowErrorSheet(false)}
        icon={<FailureSVG width={ms(64)} height={ms(64)} />}
      />
      <CustomLoader loading={isFetchingDetails} />
    </View>
  );
};

const Dot = memo(({ i, scrollX, colors }: { i: number; scrollX: any; colors: any }) => {
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
});

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
