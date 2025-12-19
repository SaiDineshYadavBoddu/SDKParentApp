import React from "react";
import {
    Image,
    ImageSourcePropType,
    StyleSheet,
    View,
    StyleProp,
    ViewStyle,
} from "react-native";

interface Props {
    source: ImageSourcePropType;
    width?: number;
    height?: number;
    borderRadius?: number;
    resizeMode?: "cover" | "contain" | "stretch" | "center";
    style?: StyleProp<ViewStyle>;
}

export default function CustomImage({
    source,
    width,
    height,
    borderRadius = 0,
    resizeMode = "cover",
    style,
}: Props) {
    return (
        <View
            style={[
                { width, height, borderRadius, overflow: "hidden" },
                style,
            ]}
        >
            <Image
                source={source}
                style={[styles.image, { width: "100%", height: "100%" }]}
                resizeMode={resizeMode}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
    },
});
