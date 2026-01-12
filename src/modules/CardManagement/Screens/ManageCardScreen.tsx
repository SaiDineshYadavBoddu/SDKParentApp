import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import { ms } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import SectionContainer, {
  SectionItem,
} from '../../../common/components/SectionContainer';
import CardUsageSVG from '../../../assets/svgs/CardUsageSVG';
import TransactionLimitsSVG from '../../../assets/svgs/TransactionLimitsSVG';
import ResetPinSVG from '../../../assets/svgs/ResetPinSVG';
import BlockCardSVG from '../../../assets/svgs/CloseCardSVG';
import ChevronSVG from '../../../assets/svgs/ChevronSVG';
import CustomBackButton from '../../../common/components/CustomBackButton';
import PaymentCard from '../../../common/components/PaymentCard';
import { Animated } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ManageCardScreen = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
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
      id: 'set_reset_pin',
      Icon: ResetPinSVG,
      title: t('manageCard.setResetPin'),
      subtitle: t('manageCard.setResetPinDesc'),
    },
    {
      id: 'close_card',
      Icon: BlockCardSVG,
      title: t('manageCard.closeCard'),
      subtitle: t('manageCard.closeCardDesc'),
    }
  ];

  const controlItems: SectionItem[] = controls.map(control => ({
    id: control.id,
    start: <control.Icon width={ms(20)} height={ms(20)} />,
    top: <CustomText type={TextType.CardTitle}>{control.title}</CustomText>,
    middle: <CustomText type={TextType.CardSubtitle}>{control.subtitle}</CustomText>,
    end: <ChevronSVG width={ms(20)} height={ms(20)} />,
    onPress: () => {
      if (control.id === 'close_card') {
        navigation.navigate('CloseCard', { card });
      } else if (control.id === 'usage') {
        navigation.navigate('CardUsage', { card });
      } else if (control.id === 'limits') {
        navigation.navigate('TransactionLimits', { card });
      } else if (control.id === 'set_reset_pin') {
        navigation.navigate('SetCardPin', { card });
      }
    }
  }));

  return (
    <View style={[styles.container, {
      backgroundColor: colors.background,
      paddingTop: Math.max(ms(20), insets.top),
      paddingHorizontal: Spacing.l
    }]}>
      <View style={styles.header}>
        <CustomBackButton style={styles.backButton} />
        <CustomText type={TextType.ScreenHeadlineSmall} style={styles.headerTitle}>
          {t('manageCard.title')}
        </CustomText>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
            title={t('manageCard.controlsTitle')}
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
    paddingTop: Spacing.xl,
    alignItems: 'center',
  },
  controlsContainer: {
    marginTop: ms(30),
  },
});
