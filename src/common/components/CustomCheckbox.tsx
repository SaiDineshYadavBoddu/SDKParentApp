import React from 'react';
import {
    TouchableOpacity,
    View,
    StyleSheet,
    StyleProp,
    ViewStyle,
    TextStyle,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import { useTheme } from '../../theme/ThemeProvider';
import { Spacing } from '../../theme/spacing';
import CustomText, { TextType } from './CustomText';

interface CustomCheckboxProps {
    label?: string;
    selected: boolean;
    onPress: () => void;
    disabled?: boolean;
    containerStyle?: StyleProp<ViewStyle>;
    boxStyle?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
    label,
    selected,
    onPress,
    disabled = false,
    containerStyle,
    boxStyle,
    labelStyle,
}) => {
    const { colors } = useTheme();

    const boxSize = ms(20);

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled}
            activeOpacity={0.7}
            style={[styles.container, containerStyle, { opacity: disabled ? 0.5 : 1 }]}
        >
            <View
                style={[
                    styles.box,
                    {
                        width: boxSize,
                        height: boxSize,
                        borderRadius: ms(4),
                        borderColor: selected ? colors.primary : colors.textColorDisabled,
                        backgroundColor: selected ? colors.primary : 'transparent',
                    },
                    boxStyle,
                ]}
            >
                {selected && (
                    // Simple checkmark using View strokes if SVG not avail, or just a filled square for now if no check icon. 
                    // Given I don't know if CheckSVG exists, I will make a simple L-shape using views or just rely on the filled color + inner mark.
                    // Let's make a simple white checkmark using borders.
                    <View style={styles.checkmarkContainer}>
                        <View style={styles.checkmark} />
                    </View>
                )}
            </View>
            {label && (
                <CustomText
                    type={TextType.Label}
                    style={[styles.label, labelStyle]}
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
    box: {
        borderWidth: ms(2),
        justifyContent: "center",
        alignItems: "center",
    },
    checkmarkContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkmark: {
        width: ms(5),
        height: ms(10),
        borderBottomWidth: ms(2),
        borderRightWidth: ms(2),
        borderColor: 'white',
        transform: [{ rotate: '45deg' }, { translateY: -ms(1) }],
    },
    label: {
        marginLeft: ms(8),
        marginBottom: 0,
    },
});

export default CustomCheckbox;
