import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { ms } from 'react-native-size-matters';
import { useTheme } from '../../theme/ThemeProvider';
import { Spacing } from '../../theme/spacing';
import WarningSVG from '../../assets/svgs/WarningSVG';
import CustomText, { TextType } from './CustomText';

interface Props {
    message?: string;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
}

const CustomWarning: React.FC<Props> = ({ message, children, style }) => {
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.warningContainer }, style]}>
            <View style={styles.iconContainer}>
                <WarningSVG width={ms(20)} height={ms(20)} />
            </View>
            <View style={styles.contentContainer}>
                {message ? (
                    <CustomText type={TextType.CardText}>
                        {message}
                    </CustomText>
                ) : (
                    children
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        padding: Spacing.l,
        paddingRight: Spacing.xl,
        borderRadius: ms(8),
        alignItems: 'flex-start',
    },
    iconContainer: {
        marginRight: Spacing.s,
        marginTop: ms(2),
    },
    contentContainer: {
        flex: 1,
    },
});

export default CustomWarning;
