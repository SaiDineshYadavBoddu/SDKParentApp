import React from "react";
import { Text, TextProps } from "react-native";
import { ms } from "react-native-size-matters";
import { useTheme } from "../../theme/ThemeProvider";
import { Typography } from "../../theme/typography";

export enum TextType {
    // Screen-level
    ScreenLarge = "ScreenLarge",
    ScreenMedium = "ScreenMedium",
    ScreenSmall = "ScreenSmall",

    // Section / Card-level
    SectionTitle = "SectionTitle",
    CardTitle = "CardTitle",
    CardSubtitle = "CardSubtitle",
    CardText = "CardText",

    // Image overlays
    ImageLarge = "ImageLarge",
    ImageSmall = "ImageSmall",

    // Buttons
    Button = "Button",
    OutlinedButton = "OutlinedButton",

    // Error
    Error = "Error",
}

interface Props extends TextProps {
    type: TextType;
    colorOverride?: string;
    styleOverride?: any;
}

export default function CustomText({
    children,
    type,
    colorOverride,
    styleOverride,
    ...rest
}: Props) {
    const { colors } = useTheme();

    const { color, textStyle } = (() => {
        switch (type) {
            // Screen-level
            case TextType.ScreenLarge:
                return { color: colors.onBackground, textStyle: Typography.headlineLarge };
            case TextType.ScreenMedium:
                return { color: colors.onBackground, textStyle: Typography.titleMedium };
            case TextType.ScreenSmall:
                return { color: colors.onBackground, textStyle: Typography.bodyMedium };

            // Sections / Cards
            case TextType.SectionTitle:
                return { color: colors.primary, textStyle: Typography.titleLarge };
            case TextType.CardTitle:
                return { color: colors.primary, textStyle: Typography.titleMedium };
            case TextType.CardSubtitle:
                return { color: colors.onSurface, textStyle: Typography.titleSmall };
            case TextType.CardText:
                return { color: colors.onSurface, textStyle: Typography.bodySmall };

            // Image overlays
            case TextType.ImageLarge:
                return { color: "#FFFFFF", textStyle: Typography.titleLarge };
            case TextType.ImageSmall:
                return { color: "#FFFFFF", textStyle: Typography.titleMedium };

            // Buttons
            case TextType.Button:
                return { color: colors.onPrimary, textStyle: Typography.labelLarge };
            case TextType.OutlinedButton:
                return { color: colors.primary, textStyle: Typography.labelLarge };

            // Error
            case TextType.Error:
                return { color: colors.error, textStyle: Typography.bodySmall };

            default:
                return { color: colors.onBackground, textStyle: Typography.bodyMedium };
        }
    })();

    return (
        <Text
            {...rest}
            style={[
                { color: colorOverride ?? color },
                textStyle,
                styleOverride,
            ]}
        >
            {children}
        </Text>
    );
}
