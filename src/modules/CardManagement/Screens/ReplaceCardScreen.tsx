import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View, ScrollView } from 'react-native';
import { ms } from 'react-native-size-matters';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomDropdown from '../../../common/components/CustomDropdown';
import CustomBottomSheet from '../../../common/components/CustomBottomSheet';
import CustomRadioButton from '../../../common/components/CustomRadioButton';
import CustomButton from '../../../common/components/CustomButton';
import CustomResultScreen from '../../../common/components/CustomResultScreen';
import CurrencySVG from '../../../assets/svgs/CurrencySVG';
import ReplaceCardScreenSVG from '../../../assets/svgs/ReplaceCardScreenSVG';
import { REPLACE_CARD_REASONS } from '../../../constants/appConstants';
import CustomWarning from '../../../common/components/CustomWarning';
import CustomCardNumberDisplay from '../../../common/components/CustomCardNumberDisplay';


import { useGetCardTariffsQuery, useReplaceCardMutation } from '../../../network/card/card.api';
import CustomLoader from '../../../common/components/CustomLoader';
import CustomHeader from '../../../common/components/CustomHeader';

const ReplaceCardScreen = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { card } = route.params || {};
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | undefined>(REPLACE_CARD_REASONS[0]);
  const [tempReason, setTempReason] = useState<string | undefined>("");
  const [isSuccess, setIsSuccess] = useState(false);

  const { data: tariffData, isLoading: isTariffLoading } = useGetCardTariffsQuery(card?.cardIdentifier, {
    skip: !card?.cardIdentifier,
  });

  const [replaceCard, { isLoading: isReplaceLoading }] = useReplaceCardMutation();

  const replacementFee = React.useMemo(() => {
    const tariff = tariffData?.tariffDetails?.find((t: any) => t.code === 'CP_REPL_PINS');
    return tariff ? tariff.feeBase : '26.00';
  }, [tariffData]);

  const handleConfirm = () => {
    setSelectedReason(tempReason);
    setBottomSheetVisible(false);
  };

  const handleSubmit = async () => {
    if (!card?.cardIdentifier || !selectedReason) return;
    try {
      await replaceCard({ cardId: card.cardIdentifier, reason: selectedReason }).unwrap();
      setIsSuccess(true);
    } catch (error) {
      console.error('Failed to replace card', error);
    }
  };

  if (isSuccess) {
    return (
      <CustomResultScreen
        title={t('replaceCard.successTitle')}
        subtitle={t('replaceCard.successSubtitle')}
        iconName="check"
        buttonTitle={t('common.done')}
        onButtonPress={() => navigation.goBack()}
      />
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader
          title={''}
          onBackPress={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.iconContainer}>
          <ReplaceCardScreenSVG width={ms(40)} height={ms(40)} color={colors.primary} />
        </View>
        <CustomText type={TextType.ScreenHeadlineMedium} style={styles.title}>
          {t('replaceCard.title')}
        </CustomText>
        <CustomText type={TextType.ScreenDisplaySmall} style={styles.subtitle}>
          {t('replaceCard.description')}
        </CustomText>

        <CustomCardNumberDisplay maskedPan={card?.maskedPan} />

        <CustomDropdown
          label={t('replaceCard.selectReasonForReplacement')}
          placeholder={t('common.select')}
          selectedValue={
            selectedReason
              ? t(`replaceCard.reasons.${selectedReason}`)
              : undefined
          }
          onPress={() => {
            setTempReason(selectedReason);
            setBottomSheetVisible(true);
          }}
          containerStyle={styles.dropdown}
        />

        <CustomWarning>
          <CustomText type={TextType.CardText} style={styles.infoText}>
            {t('replaceCard.feePrefix')}
            <CurrencySVG width={ms(18)} height={ms(10)} color="#856404" />
            {t('replaceCard.feeSuffix', { amount: replacementFee })}
          </CustomText>
        </CustomWarning>
      </ScrollView>

      <View style={styles.bottomButtonContainer}>
        <CustomButton
          title={t('common.submit')}
          onPress={handleSubmit}
          disabled={!selectedReason}
          style={selectedReason ? styles.submitButtonActive : styles.submitButtonDisabled}
        />
      </View>

      <CustomBottomSheet
        visible={isBottomSheetVisible}
        onClose={() => setBottomSheetVisible(false)}
        title={t('replaceCard.selectReason')}
      >
        <View style={styles.bottomSheetContent}>
          {REPLACE_CARD_REASONS.map((reason) => (
            <CustomRadioButton
              key={reason}
              label={t(`replaceCard.reasons.${reason}`)}
              selected={tempReason === reason}
              onPress={() => setTempReason(reason)}
              containerStyle={[
                styles.radioButton,
                {
                  borderColor: tempReason === reason ? colors.primary : colors.outline,
                  borderWidth: tempReason === reason ? ms(1.5) : ms(1),
                }
              ]}
            />
          ))}

          <CustomWarning style={{ marginTop: Spacing.m, marginBottom: ms(24) }}>
            <CustomText type={TextType.CardText} style={styles.infoText}>
              {t('replaceCard.feePrefix')}
              <CurrencySVG width={ms(18)} height={ms(10)} color="#856404" />
              {t('replaceCard.feeSuffix', { amount: replacementFee })}
            </CustomText>
          </CustomWarning>

          <CustomButton
            title={t('common.confirm')}
            onPress={handleConfirm}
            disabled={!tempReason}
            style={styles.confirmButton}
          />
        </View>
      </CustomBottomSheet>
      <CustomLoader loading={isTariffLoading || isReplaceLoading} />
    </View>
  );
};

export default ReplaceCardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.s,
  },
  scrollContent: {
    paddingHorizontal: Spacing.m,
    paddingBottom: Spacing.xxl,
    paddingTop: ms(20),
  },
  iconContainer: {
    marginBottom: ms(20),
  },
  title: {
    marginBottom: ms(8),
  },
  subtitle: {
    marginBottom: ms(24),
  },
  dropdown: {
    marginBottom: ms(24),
  },
  // Removed infoBox, bottomSheetInfoBox, infoIcon as they are replaced by CustomWarning styles
  infoText: {
    flex: 1,
    color: '#856404',
    lineHeight: ms(18),
  },
  bottomButtonContainer: {
    padding: Spacing.m,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  submitButtonActive: {
    backgroundColor: '#0169B2',
  },
  submitButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  bottomSheetContent: {
    width: '100%',
  },
  radioItemContainer: {
    // borderRadius: ms(12),
    // marginBottom: Spacing.m,
  },
  radioButton: {
    marginVertical: 0,
    height: ms(56),
    paddingHorizontal: Spacing.m,
    width: '100%',
    borderRadius: ms(12),
    marginBottom: Spacing.m,
  },
  confirmButton: {
    width: '100%',
  }
});
