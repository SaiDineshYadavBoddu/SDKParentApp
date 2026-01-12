import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { ms } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useTheme } from '../../theme/ThemeProvider';
import { Spacing } from '../../theme/spacing';
import { Typography } from '../../theme/typography';
import { useGetUserMeQuery } from '../../network/user/user.api';
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

const maskEmail = (email: string) => {
  if (!email) return '';
  const [name, domain] = email.split('@');
  if (name.length <= 2) return `${name[0]}***@${domain}`;
  return `${name[0]}****${name.slice(-2)}@${domain}`; // matches user example s*****00
};

const maskPhone = (phone: string) => {
  if (!phone) return '';
  if (phone.length <= 4) return '****';
  return `${phone.slice(0, 4)}*****${phone.slice(-2)}`; // matches user example 0567*****00
};

const DEFAULT_OPTIONS: SelectionOption[] = [
  {
    id: 'phone',
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

  const { data: userData } = useGetUserMeQuery();

  const {
    headerTitle = '',
    title,
    subtitle,
    options: providedOptions,
    onContinue,
    onBackPress,
    continueButtonText = 'Continue', 
    isLoading = false,
  } = route.params || {};

  const displayOptions: SelectionOption[] = useMemo(() => {
    if (providedOptions) return providedOptions;
    
    return DEFAULT_OPTIONS.map(option => {
      if (option.id === 'phone' && userData?.mobilePhone) {
        return { ...option, subtitle: maskPhone(userData.mobilePhone) };
      }
      if (option.id === 'email' && userData?.email) {
        return { ...option, subtitle: maskEmail(userData.email) };
      }
      return option;
    });
  }, [providedOptions, userData]);

  const [selectedValue, setSelectedValue] = React.useState<string>('');

  const displayTitle = title ?? t('genericSelection.title');
  const displaySubtitle = subtitle ?? t('genericSelection.subtitle');

  const [localLoading, setLocalLoading] = useState(false);

  const handleContinue = async () => {
    const selectedOption = displayOptions.find((o: SelectionOption) => o.id === selectedValue);
    if (onContinue) {
      setLocalLoading(true);
      try {
        await onContinue(selectedOption);
      } finally {
        setLocalLoading(false);
      }
    } else {
      navigation.navigate('GenericOTPScreen', {
        target: selectedOption?.subtitle || '',
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
            <VerificationSVG stroke={colors.primary} width={ms(48)} height={ms(48)} />
          </View>
          <CustomText type={TextType.ScreenHeadlineMedium} style={styles.title}>
            {t(displayTitle)}
          </CustomText>
          <CustomText type={TextType.CardText} style={[styles.subtitle, { color: colors.secondaryText }]}>
            {t(displaySubtitle)}
          </CustomText>
        </View>

        <View style={styles.optionsContainer}>
          {displayOptions?.map((option: SelectionOption) => {
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
          loading={isLoading || localLoading}
          disabled={!selectedValue || isLoading || localLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.l,
    gap: Spacing.xl,
  },
  topSection: {
    marginTop: Spacing.m,
    gap: Spacing.m,
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
    gap: Spacing.xl,
  },
  optionCard: {
    paddingVertical: ms(16),
    paddingHorizontal: Spacing.m,
    borderRadius: ms(16),
  },
  textContainer: {
    flex: 1,
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
