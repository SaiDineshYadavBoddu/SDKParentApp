// theme/typography.ts
import { ms } from "react-native-size-matters";

export const Typography = {
    // Headlines
    headlineLarge: {
        fontSize: ms(28),
        lineHeight: ms(30),
        fontWeight: "700",
    },
    headlineMedium: {
        fontSize: ms(22),
        lineHeight: ms(28),
        fontWeight: "500",
    },
    headlineSmall: {
        fontSize: ms(20),
        lineHeight: ms(26),
        fontWeight: "500",
    },

    // Display
    displayLarge: {
        fontSize: ms(18),
        lineHeight: ms(24),
        fontWeight: "400",
    },
    displayMedium: {
        fontSize: ms(16),
        lineHeight: ms(22),
        fontWeight: "400",
    },
    displaySmall: {
        fontSize: ms(14),
        lineHeight: ms(20),
        fontWeight: "400",
    },

    // Titles
    titleLarge: {
        fontSize: ms(18),
        lineHeight: ms(24),
        fontWeight: "700",
    },
    titleMedium: {
        fontSize: ms(16),
        lineHeight: ms(22),
        fontWeight: "600",
    },
    titleSmall: {
        fontSize: ms(10),
        lineHeight: ms(16),
        fontWeight: "300",
    },

    // Body
    bodyLarge: {
        fontSize: ms(16),
        lineHeight: ms(24),
        fontWeight: "400",
    },
    bodyMedium: {
        fontSize: ms(14),
        lineHeight: ms(20),
        fontWeight: "300",
    },
    bodySmall: {
        fontSize: ms(12),
        lineHeight: ms(16),
        fontWeight: "400",
    },

    // Labels (Button Text)
    labelLarge: {
        fontSize: ms(14),
        lineHeight: ms(18),
        fontWeight: "500",
    },
    labelMedium: {
        fontSize: ms(12),
        lineHeight: ms(16),
        fontWeight: "500",
    },
    labelSmall: {
        fontSize: ms(10),
        lineHeight: ms(14),
        fontWeight: "400",
    },
} as const;

export type TypographyKey = keyof typeof Typography;