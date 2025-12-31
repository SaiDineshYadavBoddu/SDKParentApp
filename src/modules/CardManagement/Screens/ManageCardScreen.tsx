import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { ms } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomIcon from '../../../common/components/CustomIcon';
import SectionContainer, { SectionItem } from '../../../common/components/SectionContainer';
import CustomImage from '../../../common/components/CustomImage';
import CardUsageSVG from '../../../assets/svgs/CardUsageSVG';
import TransactionLimitsSVG from '../../../assets/svgs/TransactionLimitsSVG';
import ResetPinSVG from '../../../assets/svgs/ResetPinSVG';
import BlockCardSVG from '../../../assets/svgs/BlockCardSVG';
import ChevronSVG from '../../../assets/svgs/ChevronSVG';
import PaymentCard from '../../../common/components/PaymentCard';
import { Animated } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ManageCardScreen = () => {
    const { t } = useTranslation();
    const { colors } = useTheme();
    const navigation = useNavigation();
    const route = useRoute<any>();
    const { card } = route.params || {};
    const [isDetailsVisible, setIsDetailsVisible] = useState(false);
    const scrollX = React.useRef(new Animated.Value(0)).current;

    const CARD_WIDTH = SCREEN_WIDTH - Spacing.l * 2;
    const CARD_MARGIN = 0;
    const SNAP_INTERVAL = CARD_WIDTH;

    const controls = [
        {
            id: 'usage',
            Icon: CardUsageSVG,
            title: t('manageCard.usage'),
            subtitle: t('manageCard.usageDesc'),
        },
        {
            id: 'limits',
            Icon: TransactionLimitsSVG,
            title: t('manageCard.limits'),
            subtitle: t('manageCard.limitsDesc'),
        },
        {
            id: 'reset_pin',
            Icon: ResetPinSVG,
            title: t('manageCard.resetPin'),
            subtitle: t('manageCard.resetPinDesc'),
        },
        {
            id: 'block',
            Icon: BlockCardSVG,
            title: t('manageCard.block'),
            subtitle: t('manageCard.blockDesc'),
        }
    ];

    const controlItems: SectionItem[] = controls.map(control => ({
        id: control.id,
        start: <control.Icon width={ms(20)} height={ms(20)} />,
        top: <CustomText type={TextType.CardTitle}>{control.title}</CustomText>,
        middle: <CustomText type={TextType.CardSubtitle}>{control.subtitle}</CustomText>,
        end: <ChevronSVG width={ms(20)} height={ms(20)} />,
        onPress: () => { }
    }));

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <CustomIcon type="feather" name="arrow-left" size={ms(24)} color={colors.onBackground} />
                </TouchableOpacity>
                <CustomText type={TextType.ScreenHeadlineSmall} style={styles.headerTitle}>
                    {t('manageCard.title') || 'Manage Card'}
                </CustomText>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.cardContainer}>
                    <PaymentCard
                        item={card}
                        index={0}
                        scrollX={scrollX}
                        snapInterval={SNAP_INTERVAL}
                        cardWidth={CARD_WIDTH}
                        cardMargin={CARD_MARGIN}
                        isDetailsVisible={isDetailsVisible}
                        onToggleVisibility={() => setIsDetailsVisible(!isDetailsVisible)}
                    />
                </View>

                <View style={styles.controlsContainer}>
                    <SectionContainer
                        title={t('manageCard.controlsTitle') || 'Card Controls'}
                        items={controlItems}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

export default ManageCardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: ms(60),
        paddingHorizontal: Spacing.l,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        width: ms(40),
        height: ms(40),
        justifyContent: 'center',
    },
    headerTitle: {
        marginLeft: ms(8),
        fontSize: ms(18),
    },
    scrollContent: {
        paddingBottom: Spacing.xxl,
    },
    cardContainer: {
        paddingHorizontal: Spacing.l,
        paddingTop: Spacing.xl,
        alignItems: 'center',
    },
    controlsContainer: {
        marginTop: ms(30),
        paddingHorizontal: Spacing.l,
    },
});
