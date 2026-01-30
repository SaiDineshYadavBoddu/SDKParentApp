import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { ms } from 'react-native-size-matters';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomRadioButton from '../../../common/components/CustomRadioButton';
import CustomButton from '../../../common/components/CustomButton';
import CustomBottomSheet from '../../../common/components/CustomBottomSheet';
import CustomImage from '../../../common/components/CustomImage';
import { useTranslation } from 'react-i18next';
import { formatMaskedCardNumber } from '../../../utils/cardUtils';

interface CardSelectionBottomSheetProps {
    visible: boolean;
    onClose: () => void;
    cards: any[];
    selectedCardId: string;
    onSelect: (cardId: string) => void;
}

const CardSelectionBottomSheet: React.FC<CardSelectionBottomSheetProps> = ({
    visible,
    onClose,
    cards,
    selectedCardId,
    onSelect,
}) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const [tempSelectedId, setTempSelectedId] = React.useState(selectedCardId);

    React.useEffect(() => {
        if (visible) {
            setTempSelectedId(selectedCardId);
        }
    }, [visible, selectedCardId]);

    return (
        <CustomBottomSheet
            visible={visible}
            onClose={onClose}
            title={t('transactions.selectCard')}
        >
            <View style={styles.container}>
                {cards.map((card) => (
                    <TouchableOpacity
                        key={card.cardIdentifier}
                        onPress={() => setTempSelectedId(card.cardIdentifier)}
                        style={[
                            styles.cardItem,
                            {
                                borderColor: tempSelectedId === card.cardIdentifier ? colors.primary : colors.outline,
                                borderWidth: tempSelectedId === card.cardIdentifier ? ms(1.5) : ms(1),
                            },
                        ]}
                    >
                        <View style={styles.cardInfo}>
                            <CustomImage
                                source={require('../../../assets/images/SmallCard.png')}
                                style={{ width: ms(34), height: ms(24), marginRight: Spacing.m }}
                                resizeMode="contain"
                            />
                            <CustomText type={TextType.CardTitle}>{formatMaskedCardNumber(card.maskedPan)}</CustomText>
                        </View>
                        <CustomRadioButton
                            selected={tempSelectedId === card.cardIdentifier}
                            onPress={() => setTempSelectedId(card.cardIdentifier)}
                        />
                    </TouchableOpacity>
                ))}

                <CustomButton
                    title={t('common.select')}
                    onPress={() => {
                        onSelect(tempSelectedId);
                        onClose();
                    }}
                    style={styles.selectButton}
                />
            </View>
        </CustomBottomSheet>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingBottom: Spacing.m,
    },
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: Spacing.m,
        borderRadius: ms(12),
        marginBottom: Spacing.m,
    },
    cardInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectButton: {
        marginTop: Spacing.m,
        width: '100%',
    },
});

export default CardSelectionBottomSheet;
