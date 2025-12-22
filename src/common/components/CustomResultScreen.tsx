import React from "react";
import { View, StyleSheet, StyleProp, ViewStyle } from "react-native";
import { ms } from "react-native-size-matters";
import { useTheme } from "../../theme/ThemeProvider";
import { Spacing } from "../../theme/spacing";
import CustomText, { TextType } from "./CustomText";
import CustomIcon from "./CustomIcon";
import CustomButton from "./CustomButton";

interface CustomResultScreenProps {
    title: string;
    subtitle: string;
    iconName: string;
    iconType?: "material" | "ion" | "feather" | "mci";
    iconColor?: string;
    iconBackgroundColor?: string;
    buttonTitle: string;
    onButtonPress: () => void;
    containerStyle?: StyleProp<ViewStyle>;
}

const CustomResultScreen: React.FC<CustomResultScreenProps> = ({
    title,
    subtitle,
    iconName,
    iconType = "feather",
    iconColor = "#FFFFFF",
    iconBackgroundColor = "#4CAF50",
    buttonTitle,
    onButtonPress,
    containerStyle,
}) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }, containerStyle]}>
            <View style={styles.content}>
                <View style={[styles.iconContainer, { backgroundColor: iconBackgroundColor }]}>
                    <CustomIcon type={iconType} name={iconName} size={ms(40)} color={iconColor} />
                </View>
                <CustomText type={TextType.ScreenHeadlineSmall} style={styles.title}>
                    {title}
                </CustomText>
                <CustomText type={TextType.CardSubtitle} style={styles.subtitle}>
                    {subtitle}
                </CustomText>
            </View>
            <View style={styles.bottomButtonContainer}>
                <CustomButton
                    title={buttonTitle}
                    onPress={onButtonPress}
                    style={styles.button}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: Spacing.xl,
    },
    iconContainer: {
        width: ms(80),
        height: ms(80),
        borderRadius: ms(40),
        justifyContent: "center",
        alignItems: "center",
        marginBottom: Spacing.xxl,
    },
    title: {
        textAlign: 'center',
        marginBottom: Spacing.m,
        fontSize: ms(20),
        fontWeight: 'bold',
    },
    subtitle: {
        textAlign: 'center',
        color: '#757575',
        lineHeight: ms(22),
    },
    bottomButtonContainer: {
        padding: Spacing.l,
        paddingBottom: ms(60),
    },
    button: {
        width: '100%',
    }
});

export default CustomResultScreen;
