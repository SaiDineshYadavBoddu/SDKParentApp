import React, { useState, useRef } from "react";
import {
    View,
    StyleSheet,
    Animated,
    Dimensions,
} from "react-native";
import { ms } from "react-native-size-matters";
import { Spacing } from "../../theme/spacing";
import PaymentCard from "./PaymentCard";
import { toggleInSet } from "../../utils/selectionUtils";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_MARGIN = ms(5);
const CARD_WIDTH = SCREEN_WIDTH * 0.85;
const SNAP_INTERVAL = CARD_WIDTH + (CARD_MARGIN * 2);
const SIDE_SPACER = (SCREEN_WIDTH - SNAP_INTERVAL) / 2;

interface CardData {
    id: string;
    cardIdentifier: string;
    maskedPan: string;
    expiryDate: string;
    cardholderName: string;
    cvv: string;
}

interface CardCarouselProps {
    data: CardData[];
    onIndexChange?: (index: number) => void;
}

const CardCarousel: React.FC<CardCarouselProps> = ({ data, onIndexChange }) => {
    const [visibleCardIds, setVisibleCardIds] = useState<Set<string>>(new Set());
    const scrollX = useRef(new Animated.Value(0)).current;

    const toggleCardVisibility = (id: string) => {
        setVisibleCardIds((prev) => toggleInSet(prev, id));
    };

    const renderItem = ({ item, index }: { item: CardData; index: number }) => (
        <PaymentCard
            item={item}
            index={index}
            scrollX={scrollX}
            snapInterval={SNAP_INTERVAL}
            cardWidth={CARD_WIDTH}
            cardMargin={CARD_MARGIN}
            isDetailsVisible={visibleCardIds.has(item.id)}
            onToggleVisibility={toggleCardVisibility}
        />
    );

    return (
        <View style={styles.cardListContainer}>
            <Animated.FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
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
                    }
                )}
                scrollEventThrottle={16}
                removeClippedSubviews={false}
                style={{ overflow: "visible" }}
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
    );
};

const styles = StyleSheet.create({
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
});

export default CardCarousel;
