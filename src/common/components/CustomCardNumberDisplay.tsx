import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';
import { ms } from 'react-native-size-matters';
import { Spacing } from '../../theme/spacing';
import CustomText, { TextType } from './CustomText';
import CustomImage from './CustomImage';

interface CustomCardNumberDisplayProps {
    maskedPan?: string;
    containerStyle?: StyleProp<ViewStyle>;
}

const CustomCardNumberDisplay: React.FC<CustomCardNumberDisplayProps> = ({
    maskedPan,
    containerStyle
}) => {
    const { t } = useTranslation();

    return (
        <View style={containerStyle}>
            <CustomText type={TextType.Label}>
                {t('common.cardNumber')}
            </CustomText>
            <View style={styles.cardItemContainer}>
                <View style={styles.cardIcon}>
                    <CustomImage
                        source={require('../../assets/images/SmallCard.png')}
                        style={{ width: ms(34), height: ms(24) }}
                        resizeMode="contain"
                    />
                </View>
                <CustomText type={TextType.CardTitle}>
                    {maskedPan}
                </CustomText>
            </View>
        </View>
    );
};

export default CustomCardNumberDisplay;

const styles = StyleSheet.create({
    cardItemContainer: {
        flexDirection: 'row',
        padding: Spacing.m,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: ms(12),
        marginBottom: ms(24),
    },
    cardIcon: {
        marginRight: ms(3),
        justifyContent: 'center',
    },
});
