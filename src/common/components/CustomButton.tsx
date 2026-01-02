import React from "react";
import {
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    View,
    StyleProp,
    ViewStyle,
    GestureResponderEvent,
} from "react-native";
import { ms } from "react-native-size-matters";
import CustomText, { TextType } from "./CustomText";
import { useTheme } from "../../theme/ThemeProvider";
import { Spacing } from "../../theme/spacing";

export type ButtonVariant = "primary" | "outlined" | "text";

interface Props {
    title: string;
    onPress?: (e: GestureResponderEvent) => void;
    variant?: ButtonVariant;
    disabled?: boolean;
    loading?: boolean;
    uppercase?: boolean;
    style?: StyleProp<ViewStyle>;
}

export default function CustomButton({
    title,
    onPress,
    variant = "primary",
    disabled = false,
    loading = false,
    uppercase = true,
    style,
}: Props) {
    const { colors } = useTheme();
    const isDisabled = disabled || loading;

    const backgroundColor = isDisabled
        ? "#F5F8FA"
        : variant === "primary"
            ? colors.primary
            : "transparent";

    const borderColor = isDisabled
        ? "#E0E4E8"
        : variant === "outlined"
            ? colors.primary
            : "transparent";

    const borderWidth = (isDisabled || variant === "outlined") ? ms(1) : 0;

    const textColor = isDisabled
        ? colors.textColorDisabled
        : variant === "primary"
            ? colors.onPrimary
            : colors.primary;

    const textType =
        variant === "primary" ? TextType.Button : TextType.OutlinedButton;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.86}
            style={[
                styles.container,
                {
                    backgroundColor,
                    borderColor,
                    borderWidth,
                },
                style,
            ]}
        >
            {loading ? (
                <ActivityIndicator size="small" color={textColor} />
            ) : (
                <CustomText type={textType} uppercase={uppercase} style={{ color: textColor }}>
                    {title}
                </CustomText>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        height: ms(44),
        borderRadius: ms(8),
        paddingHorizontal: Spacing.l,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
    },
});