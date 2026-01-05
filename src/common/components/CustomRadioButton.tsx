import React from "react";
import {
    TouchableOpacity,
    View,
    StyleSheet,
    StyleProp,
    ViewStyle,
    TextStyle,
} from "react-native";
import { ms } from "react-native-size-matters";
import { useTheme } from "../../theme/ThemeProvider";
import { Spacing } from "../../theme/spacing";
import CustomText, { TextType } from "./CustomText";

interface CustomRadioButtonProps {
    label?: string;
    selected: boolean;
    onPress: () => void;
    disabled?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    radioStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
}

const CustomRadioButton: React.FC<CustomRadioButtonProps> = ({
    label,
    selected,
    onPress,
    disabled = false,
    containerStyle,
    radioStyle,
    labelStyle,
}) => {
    const { colors } = useTheme();

    const outerCircleSize = ms(20);
    const innerCircleSize = ms(10);

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
            style={[styles.container, containerStyle, { opacity: disabled ? 0.5 : 1 }]}
        >
            <View
                style={[
                    styles.outerCircle,
                    {
                        width: outerCircleSize,
                        height: outerCircleSize,
                        borderRadius: outerCircleSize / 2,
                        borderColor: selected ? colors.primary : colors.textColorDisabled,
                    },
                    radioStyle,
                ]}
            >
                {selected && (
                    <View
                        style={[
                            styles.innerCircle,
                            {
                                width: innerCircleSize,
                                height: innerCircleSize,
                                borderRadius: innerCircleSize / 2,
                                backgroundColor: colors.primary,
                            },
                        ]}
                    />
                )}
            </View>
            {label && (
                <CustomText
                    type={TextType.Label}
                    style={styles.label}
                >
                    {label}
                </CustomText>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: Spacing.xs,
    },
    outerCircle: {
        borderWidth: ms(2),
        justifyContent: "center",
        alignItems: "center",
    },
    innerCircle: {
        // inner circle sizing is handled in the component for better reactivity
    },
    label: {
        marginLeft: ms(8),
        marginBottom: 0,
    },
});

export default CustomRadioButton;
