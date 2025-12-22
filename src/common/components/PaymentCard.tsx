import React from "react";
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Animated,
} from "react-native";
import { ms } from "react-native-size-matters";
import CustomText, { TextType } from "./CustomText";
import CustomIcon from "./CustomIcon";
import CustomImage from "./CustomImage";
import { Spacing } from "../../theme/spacing";

interface CardData {
    id: string;
    cardNumber: string;
    maskedNumber: string;
    expiry: string;
    holderName: string;
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
                    source={require("../../assets/images/cardbackground.png")}
                    resizeMode="cover"
                />

                <CustomImage
                    source={require("../../assets/images/LogoDefault.png")}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <TouchableOpacity
                    onPress={() => onToggleVisibility(item.id)}
                    style={styles.toggle}
                >
                    <CustomIcon
                        type="feather"
                        name={isDetailsVisible ? "eye" : "eye-off"}
                        size={ms(24)}
                        color="white"
                    />
                </TouchableOpacity>

                <View style={styles.cardDetails}>
                    <CustomText
                        type={TextType.ImageLarge}
                        style={{ paddingBottom: Spacing.s }}
                    >
                        {isDetailsVisible ? item.cardNumber : item.maskedNumber}
                    </CustomText>

                    <CustomText
                        type={TextType.ImageSmall}
                        style={{ paddingBottom: Spacing.xl }}
                    >
                        {isDetailsVisible ? item.expiry : "**/**"}
                    </CustomText>

                    <CustomText type={TextType.ImageSmall}>
                        {item.holderName}
                    </CustomText>
                </View>

                <CustomImage
                    source={require("../../assets/images/MastercardLogo.png")}
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
        overflow: "hidden",
        height: ms(200),
        width: "100%",
    },
    toggle: {
        position: "absolute",
        right: Spacing.xl,
        top: Spacing.xl,
    },
    logo: {
        position: "absolute",
        left: Spacing.xl,
        top: Spacing.xl,
        width: ms(90),
        height: ms(24),
    },
    mastercardLogo: {
        position: "absolute",
        right: Spacing.xl,
        bottom: Spacing.xl,
        width: ms(44),
        height: ms(26),
    },
    cardDetails: {
        position: "absolute",
        left: Spacing.xl,
        bottom: Spacing.xl,
    },
});

export default PaymentCard;
