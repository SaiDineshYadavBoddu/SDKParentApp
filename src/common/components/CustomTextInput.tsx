import React, { useState } from "react";
import {
    TextInput,
    View,
    StyleSheet,
    TextInputProps,
    StyleProp,
    ViewStyle,
    TextStyle,
} from "react-native";
import { ms } from "react-native-size-matters";
import { useTheme } from "../../theme/ThemeProvider";
import { Spacing } from "../../theme/spacing";
import { Typography } from "../../theme/typography";
import CustomText, { TextType } from "./CustomText";

interface CustomTextInputProps extends TextInputProps {
    label?: string;
    error?: string;
    containerStyle?: StyleProp<ViewStyle>;
    inputStyle?: StyleProp<TextStyle>;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
    label,
    error,
    containerStyle,
    inputStyle,
    leftIcon,
    rightIcon,
    onFocus,
    onBlur,
    multiline,
    ...rest
}) => {
    const { colors } = useTheme();
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = (e: any) => {
        setIsFocused(true);
        onFocus && onFocus(e);
    };

    const handleBlur = (e: any) => {
        setIsFocused(false);
        onBlur && onBlur(e);
    };

    const borderColor = error
        ? colors.error
        : isFocused
            ? colors.primary
            : colors.primaryContainer;

    return (
        <View style={[styles.mainContainer, containerStyle]}>
            {label && (
                <CustomText
                    type={TextType.CardSubtitle}
                    style={[styles.label, { color: colors.onSurface }]}
                >
                    {label}
                </CustomText>
            )}
            <View
                style={[
                    styles.inputContainer,
                    {
                        borderColor,
                        backgroundColor: colors.surface,
                        height: multiline ? undefined : ms(48),
                        minHeight: ms(48),
                        alignItems: multiline ? 'flex-start' : 'center',
                        paddingVertical: multiline ? Spacing.s : 0,
                    },
                ]}
            >
                {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}
                <TextInput
                    style={[
                        styles.input,
                        { color: colors.onSurface },
                        Typography.bodyMedium,
                        inputStyle,
                    ]}
                    placeholderTextColor={colors.textColorDisabled}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    multiline={multiline}
                    {...rest}
                />
                {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
            </View>
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
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: ms(1),
        borderRadius: ms(8),
        paddingHorizontal: Spacing.m,
        // height removed from here, handled dynamically
    },
    input: {
        flex: 1,
        height: "100%",
        paddingVertical: 0,
    },
    iconContainer: {
        marginHorizontal: Spacing.xs,
    },
    errorText: {
        marginTop: Spacing.xs,
        fontSize: ms(11),
    },
});

export default CustomTextInput;
