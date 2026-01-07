import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ms } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeProvider';
import { Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';
import CustomHeader from './CustomHeader';
import CustomText, { TextType } from './CustomText';
import CustomButton from './CustomButton';
import CustomRadioButton from './CustomRadioButton';
import FlexibleCard from './FlexibleCard';
import VerificationSVG from '../../assets/svgs/VerificationSVG';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface SelectionOption {
  id: string;
  title: string;
  subtitle?: string;
}

const DEFAULT_OPTIONS: SelectionOption[] = [
  {
    id: 'mobile',
    title: 'genericSelection.options.mobile.title',
  },
  {
    id: 'email',
    title: 'genericSelection.options.email.title',
  },
];

export default function GenericSelectionScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const {
    headerTitle = '',
    title,
    subtitle,
    options = DEFAULT_OPTIONS,
    onContinue,
    onBackPress,
    continueButtonText = 'Continue',
    isLoading = false,
  } = route.params || {};

  const [selectedValue, setSelectedValue] = React.useState<string>('');

  const displayTitle = title ?? t('genericSelection.title');
  const displaySubtitle = subtitle ?? t('genericSelection.subtitle');

  const handleContinue = () => {
    if (onContinue) {
      onContinue(selectedValue);
    } else {
      navigation.navigate('GenericOTPScreen', {
        target: options?.find((o: SelectionOption) => o.id === selectedValue)?.subtitle || '',
      });
    }
  };

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader
        title={headerTitle}
        onBackPress={handleBack}
        titleStyle={{ fontWeight: Typography.headlineMedium.fontWeight }}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topSection}>
          <View style={styles.iconContainer}>
            <VerificationSVG stroke={colors.primary} width={ms(60)} height={ms(60)} />
          </View>
          <CustomText type={TextType.ScreenHeadlineMedium} style={styles.title}>
            {t(displayTitle)}
          </CustomText>
          <CustomText type={TextType.CardText} style={[styles.subtitle, { color: colors.secondaryText }]}>
            {t(displaySubtitle)}
          </CustomText>
        </View>

        <View style={styles.optionsContainer}>
          {options?.map((option: SelectionOption) => {
            const isSelected = selectedValue === option.id;
            return (
              <FlexibleCard
                key={option.id}
                onPress={() => setSelectedValue(option.id)}
                style={[
                  styles.optionCard,
                  {
                    borderColor: isSelected ? colors.primary : colors.outline,
                    borderWidth: isSelected ? 2 : 1,
                    backgroundColor: colors.surface,
                  },
                ]}
                start={
                  <CustomRadioButton
                    selected={isSelected}
                    onPress={() => setSelectedValue(option.id)}
                    containerStyle={styles.radioContainer}
                  />
                }
                middle={
                  <View style={styles.textContainer}>
                    <CustomText type={TextType.CardTitle} style={styles.optionTitle}>
                      {t(option.title)}
                    </CustomText>
                    {option.subtitle && (
                      <CustomText type={TextType.CardText} style={[styles.optionSubtitle, { color: colors.secondaryText }]}>
                        {t(option.subtitle)}
                      </CustomText>
                    )}
                  </View>
                }
              />
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <CustomButton
          title={t(continueButtonText)}
          uppercase={false}
          onPress={handleContinue}
          loading={isLoading}
          disabled={!selectedValue || isLoading}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.l,
    paddingBottom: ms(100),
  },
  topSection: {
    marginTop: Spacing.m,
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.l,
  },
  title: {
    marginBottom: Spacing.xs,
  },
  subtitle: {
    lineHeight: ms(20),
  },
  optionsContainer: {
    gap: Spacing.m,
  },
  optionCard: {
    paddingVertical: ms(16),
    paddingHorizontal: Spacing.m,
    borderRadius: ms(16),
  },
  radioContainer: {
    marginVertical: 0,
  },
  textContainer: {
    flex: 1,
    marginLeft: ms(8),
    gap: Spacing.xs,
  },
  optionTitle: {
    marginBottom: ms(2),
  },
  optionSubtitle: {
    fontSize: ms(13),
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.l,
    paddingBottom: ms(24),
    backgroundColor: 'transparent',
  },
});
