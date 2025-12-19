// components/CustomIcon.tsx
import React from "react";
import { ms } from "react-native-size-matters";
import { useTheme } from "../../theme/ThemeProvider";

// Import icon families
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

type IconLibrary = "material" | "ion" | "feather" | "mci";

interface Props {
    name: string;
    size?: number;
    color?: string;
    type?: IconLibrary;
    style?: any;
}

export default function CustomIcon({
    name,
    size = ms(20),
    color,
    type = "material",
    style,
}: Props) {
    const { colors } = useTheme();
    const finalColor = color ?? colors.primary;

    switch (type) {
        case "ion":
            return (
                <Ionicons
                    name={name}
                    size={size}
                    color={finalColor}
                    style={style}
                />
            );

        case "feather":
            return (
                <Feather
                    name={name}
                    size={size}
                    color={finalColor}
                    style={style}
                />
            );

        case "mci":
            return (
                <MaterialCommunityIcons
                    name={name}
                    size={size}
                    color={finalColor}
                    style={style}
                />
            );

        case "material":
        default:
            return (
                <MaterialIcons
                    name={name}
                    size={size}
                    color={finalColor}
                    style={style}
                />
            );
    }
}
