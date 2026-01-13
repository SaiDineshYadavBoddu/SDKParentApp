import React from 'react';
import {
    TouchableOpacity,
    View,
    StyleSheet,
    StyleProp,
    ViewStyle,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import { useTheme } from '../../theme/ThemeProvider';
import { Spacing } from '../../theme/spacing';
import CustomText, { TextType } from './CustomText';
import ChevronDownSVG from '../../assets/svgs/CheveronDownSVG';

interface CustomDropdownProps {
    label?: string;
    placeholder?: string;
    selectedValue?: string;
    onPress: () => void;
    containerStyle?: StyleProp<ViewStyle>;
    error?: string;
    innerContainerStyle?: StyleProp<ViewStyle>;
    disabled?: boolean;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    label,
    placeholder = 'Select',
    selectedValue,
    onPress,
    containerStyle,
    error,
    innerContainerStyle,
    disabled = false,
}) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.mainContainer, containerStyle]}>
            {label && (
                <CustomText
                    type={TextType.Label}
                >
                    {label}
                </CustomText>
            )}
            <TouchableOpacity
                onPress={disabled ? undefined : onPress}
                activeOpacity={0.7}
                disabled={disabled}
                style={[
                    styles.dropdownContainer,
                    {
                        borderColor: error ? colors.error : colors.outline,
                        backgroundColor: disabled ? colors.screenBackground : colors.surface,
                    },
                    innerContainerStyle
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
                <ChevronDownSVG
                    width={ms(22)}
                    height={ms(22)}
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
