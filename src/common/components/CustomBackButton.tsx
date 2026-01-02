import React from 'react';
import { TouchableOpacity, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ms } from 'react-native-size-matters';
import { useTheme } from '../../theme/ThemeProvider';
import BackButtonSVG from '../../assets/svgs/BackButtonSVG';

interface Props {
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
}

const CustomBackButton: React.FC<Props> = ({ style, onPress }) => {
    const navigation = useNavigation();
    const { colors } = useTheme();

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            navigation.goBack();
        }
    };

    return (
        <TouchableOpacity
            onPress={handlePress}
            style={[styles.container, style]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <BackButtonSVG width={ms(24)} height={ms(24)} color={colors.onBackground} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: ms(40),
        height: ms(40),
        justifyContent: 'center',
        // alignItems: 'center', // Optional: center the icon, though current use implies left alignment in some cases? 
        // Checking ManageCardScreen: justifyContent: 'center'.
        // CloseCardScreen: padding: Spacing.xs.
        // Let's default to a square touchable area that usually centers or aligns well.
        // If I use justifyContent: 'center', it aligns vertically.
    },
});

export default CustomBackButton;
