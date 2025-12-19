// components/CustomText.tsx
import React from "react";
import { Text, TextProps, TextStyle } from "react-native";
import { Typography } from "../../theme/typography";
import { useTheme } from "../../theme/ThemeProvider";

export enum TextType {
    ScreenHeadlineLarge = "ScreenHeadlineLarge",
    ScreenHeadlineMedium = "ScreenHeadlineMedium",
    ScreenHeadlineSmall = "ScreenHeadlineSmall",

    ScreenDisplayLarge = "ScreenDisplayLarge",
    ScreenDisplayMedium = "ScreenDisplayMedium",
    ScreenDisplaySmall = "ScreenDisplaySmall",

    SectionTitle = "SectionTitle",
    CardTitle = "CardTitle",
    CardSubtitle = "CardSubtitle",
    CardText = "CardText",

    ImageLarge = "ImageLarge",
    ImageSmall = "ImageSmall",

    Button = "Button",
    OutlinedButton = "OutlinedButton",

    Error = "Error",
}

interface Props extends TextProps {
    type: TextType;
    colorOverride?: string;
    style?: TextStyle | TextStyle[];
    numberOfLines?: number;
    uppercase?: boolean;
}

export default function CustomText({
    children,
    type,
    colorOverride,
    style,
    numberOfLines,
    uppercase = false,
    ...rest
}: Props) {
    const { colors } = useTheme();

    const getStyle = () => {
        switch (type) {
            // Screen headings
            case TextType.ScreenHeadlineLarge:
                return { color: colors.onBackground, text: Typography.headlineLarge };
            case TextType.ScreenHeadlineMedium:
                return { color: colors.onBackground, text: Typography.headlineMedium };
            case TextType.ScreenHeadlineSmall:
                return { color: colors.onBackground, text: Typography.headlineSmall };

            case TextType.ScreenDisplayLarge:
                return { color: colors.onBackground, text: Typography.displayLarge };
            case TextType.ScreenDisplayMedium:
                return { color: colors.onBackground, text: Typography.displayMedium };
            case TextType.ScreenDisplaySmall:
                return { color: colors.onBackground, text: Typography.displaySmall };

            // Cards / Sections
            case TextType.SectionTitle:
                return { color: colors.onSurface, text: Typography.titleLarge };
            case TextType.CardTitle:
                return { color: colors.onSurface, text: Typography.titleMedium };
            case TextType.CardSubtitle:
                return { color: colors.onSurface, text: Typography.titleSmall };
            case TextType.CardText:
                return { color: colors.onSurface, text: Typography.bodySmall };

            // Image overlays
            case TextType.ImageLarge:
                return { color: "#FFFFFF", text: Typography.titleLarge };
            case TextType.ImageSmall:
                return { color: "#FFFFFF", text: Typography.titleMedium };

            // Buttons
            case TextType.Button:
                return { color: colors.onPrimary, text: Typography.labelLarge };
            case TextType.OutlinedButton:
                return { color: colors.primary, text: Typography.labelLarge };

            // Error
            case TextType.Error:
                return { color: colors.error, text: Typography.bodySmall };

            default:
                return { color: colors.onBackground, text: Typography.bodyMedium };
        }
    };

    const { text, color } = getStyle();

    const outputText =
        uppercase && typeof children === "string"
            ? children.toUpperCase()
            : children;

    return (
        <Text
            {...rest}
            allowFontScaling={false}
            numberOfLines={numberOfLines}
            style={[
                text as TextStyle,
                { color: colorOverride ?? color },
                style,
            ]}
        >
            {outputText}
        </Text>
    );
}
