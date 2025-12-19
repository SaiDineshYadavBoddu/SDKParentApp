import React, { useState } from "react";
import {
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ListRenderItem,
  Animated,
} from "react-native";
import { ms } from "react-native-size-matters";
import SectionContainer, { SectionItem } from "../../common/components/SectionContainer";
import CustomText, { TextType } from "../../common/components/CustomText";
import ActionButton from "../../common/components/ActionButton";
import CustomIcon from "../../common/components/CustomIcon";
import { Spacing } from "../../theme/spacing";
import InfoSVG from "../../assets/svgs/InfoSVG";
import ReplaceCardSVG from "../../assets/svgs/ReplaceCardSVG";
import FreezeCardSVG from "../../assets/svgs/FreezeCardSVG";
import ManageCardSVG from "../../assets/svgs/ManageCardSVG";
import CustomImage from "../../common/components/CustomImage";
import NotificationSVG from "../../assets/svgs/NotificationSVG";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_MARGIN = ms(5);
const CARD_WIDTH = SCREEN_WIDTH * 0.85;
const SNAP_INTERVAL = CARD_WIDTH + (CARD_MARGIN * 2);
const SIDE_SPACER = (SCREEN_WIDTH - SNAP_INTERVAL) / 2;

export default function CardListScreen() {
  const [visibleCardIds, setVisibleCardIds] = useState<Set<string>>(new Set());
  const scrollX = React.useRef(new Animated.Value(0)).current;

  const toggleCardVisibility = (id: string) => {
    setVisibleCardIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const transactionItems: SectionItem[] = MOCK_TRANSACTIONS.map(txn => ({
    id: txn.id,

    top: (
      <>
        <CustomText type={TextType.CardTitle}>
          {txn.title}
        </CustomText>

        <CustomText type={TextType.CardTitle}>
          ₦ {txn.amount}
        </CustomText>
      </>
    ),

    middle: (
      <>
        <CustomText type={TextType.CardSubtitle}>
          {txn.txnId}
        </CustomText>

        <CustomText type={TextType.CardSubtitle}>
          {txn.date}
        </CustomText>
      </>
    ),

    onPress: () => { },
  }));

  const renderCard = ({ item, index }: { item: typeof MOCK_CARDS[0]; index: number }) => {
    const showDetails = visibleCardIds.has(item.id);

    const inputRange = [
      (index - 1) * SNAP_INTERVAL,
      index * SNAP_INTERVAL,
      (index + 1) * SNAP_INTERVAL,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: "clamp",
    });

    const translateX = scrollX.interpolate({
      inputRange,
      outputRange: [-ms(40), 0, ms(40)],
      extrapolate: "clamp",
    });

    const zIndex = scrollX.interpolate({
      inputRange,
      outputRange: [0, 1, 0],
      extrapolate: "clamp",
    });

    return (
      <View style={[styles.cardWrapper, { width: CARD_WIDTH, marginHorizontal: CARD_MARGIN, zIndex: showDetails ? 999 : 0 }]}>
        <Animated.View style={[
          styles.card,
          {
            transform: [{ scale }, { translateX }],
            zIndex
          }
        ]}>
          <Image
            source={require("../../assets/images/cardbackground.png")}
            style={styles.cardImage}
            resizeMode="cover"
          />

          <TouchableOpacity
            onPress={() => toggleCardVisibility(item.id)}
            style={styles.toggle}
          >
            <CustomImage
              source={require("../../assets/images/eye.png")}
              style={styles.toggleImage}
            />
          </TouchableOpacity>
          <View style={styles.cardDetails}>
            <CustomText type={TextType.ImageLarge} style={{ paddingBottom: Spacing.s }}>
              {showDetails
                ? item.cardNumber
                : item.maskedNumber}
            </CustomText>

            <CustomText type={TextType.ImageSmall} style={{ paddingBottom: Spacing.xl }}>
              {showDetails ? item.expiry : "**/**"}
            </CustomText>

            <CustomText type={TextType.ImageSmall}>
              {item.holderName}
            </CustomText>
          </View>
        </Animated.View>
      </View>
    );
  };

  return (
    <>
      <View style={styles.header}>
        <CustomText type={TextType.ScreenHeadlineSmall}>
          My Cards
        </CustomText>
        <View style={{ paddingTop: ms(10) }}>
          <NotificationSVG />
        </View>
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.balanceContainer}>
          <CustomText type={TextType.ScreenHeadlineLarge}>
            ₦ 50,250.77
          </CustomText>

          <View style={{ flexDirection: "row", alignItems: "center", gap: Spacing.xs, paddingTop: Spacing.m }}>
            <CustomText type={TextType.ScreenDisplaySmall}>
              Available balance
            </CustomText>
            <InfoSVG />
          </View>

          <CustomText type={TextType.ScreenDisplaySmall}>
            Active
          </CustomText>
        </View>

        <View style={styles.cardListContainer}>
          <Animated.FlatList
            data={MOCK_CARDS}
            renderItem={renderCard}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={SNAP_INTERVAL}
            decelerationRate="fast"
            contentContainerStyle={{
              paddingHorizontal: SIDE_SPACER,
            }}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            removeClippedSubviews={false}
            style={{ overflow: "visible" }}
          />
          <View style={styles.paginatorContainer}>
            {MOCK_CARDS.map((_, i) => {
              const inputRange = [
                (i - 1) * SNAP_INTERVAL,
                i * SNAP_INTERVAL,
                (i + 1) * SNAP_INTERVAL,
              ];

              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [ms(8), ms(40), ms(8)],
                extrapolate: "clamp",
              });

              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: "clamp",
              });

              return (
                <Animated.View
                  key={i.toString()}
                  style={[
                    styles.dot,
                    { width: dotWidth, opacity },
                  ]}
                />
              );
            })}
          </View>
        </View>

        <View style={styles.actionsRow}>
          <ActionButton
            title="Manage"
            icon={<ManageCardSVG />}
            onPress={() => { }}
          />

          <ActionButton
            title="Replace"
            icon={<ReplaceCardSVG />}
            onPress={() => { }}
          />

          <ActionButton
            title="Freeze"
            icon={<FreezeCardSVG />}
            onPress={() => { }}
          />
        </View>

        <View style={styles.transactionContainer}>
          <SectionContainer
            title="Recent Transactions"
            items={transactionItems}
          />
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.l,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: Spacing.xxl,
    paddingHorizontal: Spacing.l,
  },

  balanceContainer: {
    marginBottom: Spacing.l,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.l,
  },

  cardListContainer: {
    marginBottom: Spacing.xl,
  },

  paginatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.l,
  },

  dot: {
    height: ms(8),
    borderRadius: ms(4),
    marginHorizontal: ms(4),
    backgroundColor: "#00205b",
  },

  cardWrapper: {
    // Wrapper for spacing
  },

  card: {
    borderRadius: ms(16),
    overflow: "hidden",
    height: ms(200),
    width: "100%",
  },

  cardImage: {
    width: "100%",
    height: "100%",
  },

  toggle: {
    position: "absolute",
    right: Spacing.xs,
    top: Spacing.l,
  },

  toggleImage: {
    width: ms(90),
    height: ms(90),
  },

  cardDetails: {
    position: "absolute",
    left: Spacing.xl,
    bottom: Spacing.xl,
  },

  actionsRow: {
    flexDirection: "row",
    marginBottom: Spacing.xl,
    justifyContent: "space-around",
    paddingHorizontal: Spacing.l,
  },

  transactionContainer: {
    paddingHorizontal: Spacing.l
  },
});

const MOCK_CARDS = [
  {
    id: "1",
    cardNumber: "1234 5678 9876 5432",
    maskedNumber: "1234 **** **** 5432",
    expiry: "07/28",
    holderName: "Jonathan Paul",
  },
  {
    id: "2",
    cardNumber: "8765 4321 6789 2134",
    maskedNumber: "8765 **** **** 2134",
    expiry: "12/29",
    holderName: "Jonathan Paul",
  },
  {
    id: "3",
    cardNumber: "4567 8901 2345 6789",
    maskedNumber: "4567 **** **** 6789",
    expiry: "09/26",
    holderName: "Jonathan Paul",
  },
];

const MOCK_TRANSACTIONS = [
  {
    id: "1",
    title: "Pizza Hut",
    txnId: "TXN-293847",
    date: "27 Aug 2025",
    amount: "215.89",
  },
  {
    id: "2",
    title: "Zara",
    txnId: "TXN-293846",
    date: "26 Aug 2025",
    amount: "215.89",
  },
  {
    id: "3",
    title: "Domino’s Pizza",
    txnId: "TXN-293845",
    date: "25 Aug 2025",
    amount: "215.89",
  },
];
