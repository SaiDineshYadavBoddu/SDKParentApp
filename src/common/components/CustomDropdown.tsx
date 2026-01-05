import React from "react";
import {
    TouchableOpacity,
    View,
    StyleSheet,
    StyleProp,
    ViewStyle,
} from "react-native";
import { ms } from "react-native-size-matters";
import { useTheme } from "../../theme/ThemeProvider";
import { Spacing } from "../../theme/spacing";
import CustomText, { TextType } from "./CustomText";
import CustomIcon from "./CustomIcon";

interface CustomDropdownProps {
    label?: string;
    placeholder?: string;
    selectedValue?: string;
    onPress: () => void;
    containerStyle?: StyleProp<ViewStyle>;
    error?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    label,
    placeholder = "Select",
    selectedValue,
    onPress,
    containerStyle,
    error,
}) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.mainContainer, containerStyle]}>
            {label && (
                <CustomText
                    type={TextType.CardSubtitle}
                    style={styles.label}
                >
                    {label}
                </CustomText>
            )}
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.7}
                style={[
                    styles.dropdownContainer,
                    {
                        borderColor: error ? colors.error : colors.primaryContainer,
                        backgroundColor: colors.surface,
                    },
                ]}
            >
                <CustomText
                    type={TextType.CardText}
                    style={{
                        color: selectedValue ? colors.onSurface : colors.textColorDisabled,
                        flex: 1,
                    }}
                    numberOfLines={1}
                >
                    {selectedValue || placeholder}
                </CustomText>
                <CustomIcon
                    type="feather"
                    name="chevron-down"
                    size={ms(20)}
                    color={colors.textColorDisabled}
                />
            </TouchableOpacity>
            {error && (
                <CustomText type={TextType.Error} style={styles.errorText}>
                    {error}
                </CustomText>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        marginBottom: Spacing.m,
        width: "100%",
    },
    label: {
        marginBottom: Spacing.xs,
        fontWeight: "600",
    },
    dropdownContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: ms(1),
        borderRadius: ms(8),
        paddingHorizontal: Spacing.m,
        height: ms(48),
    },
    errorText: {
        marginTop: Spacing.xs,
        fontSize: ms(11),
    },
});

export default CustomDropdown;
