import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import CustomHeader from '../../../common/components/CustomHeader';
import { Typography } from '../../../theme/typography';
import { useTheme } from '../../../theme/ThemeProvider';
import { ms } from 'react-native-size-matters';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import NetworkLogoSVG from '../../../assets/svgs/NetworkLogoSVG';
import CustomButton from '../../../common/components/CustomButton';
import CustomImage from '../../../common/components/CustomImage';
import PhoneSupportSVG from '../../../assets/svgs/PhoneSuppotSVG';
import EmailSupportSVG from '../../../assets/svgs/EmailSupportSVG';

// Types for support items
type PhoneSupportItem = {
  id: string;
};

type EmailSupportItem = {
  id: string;
};

// Data arrays
const PHONE_SUPPORT_DATA: PhoneSupportItem[] = [
  {
    id: 'uaeTollFree',
  },
  {
    id: 'uaeInternational',
  },
];

const EMAIL_SUPPORT_DATA: EmailSupportItem[] = [
  {
    id: 'merchant',
  },
  {
    id: 'government',
  },
  {
    id: 'ecommerce',
  },
  {
    id: 'issuer',
  },
];

const ContactUs = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();

  const handlePhoneCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleViewOnMaps = () => {
    const address = 'PO Box 123456, Dubai, United Arab Emirates';
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address,
    )}`;
    Linking.openURL(url);
  };

  const Separator = () => (
    <View
      style={{
        height: 1,
        backgroundColor: colors.outline,
      }}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader
        title={t('profile.details.contactUs.title')}
        titleStyle={{ fontWeight: Typography.headlineMedium.fontWeight }}
        onBackPress={() => navigation.goBack()}
      />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: Spacing.xl }}>
          {/* Header Section */}
          <View style={styles.headerSection}>
            <NetworkLogoSVG width={ms(61)} height={ms(40)} />
            <View>
              <CustomText
                type={TextType.ScreenHeadlineMedium}
                style={[styles.companyName, { color: colors.onSurface }]}
              >
                {t('profile.details.contactUs.companyName')}
              </CustomText>
              <CustomText
                type={TextType.ScreenDisplaySmall}
                style={[styles.subtitle, { color: colors.secondaryText }]}
              >
                {t('profile.details.contactUs.companySubtitle')}
              </CustomText>
            </View>
          </View>

          {/* Head Office Section */}
          <View style={styles.section}>
            <CustomText
              type={TextType.SectionTitle}
              style={[styles.sectionTitle, { color: colors.onSurface }]}
            >
              {t('profile.details.contactUs.headOffice.title')}
            </CustomText>
            <View style={{ gap: Spacing.xs }}>
              <CustomText
                type={TextType.ScreenDisplaySmall}
                style={[styles.text, { color: colors.secondaryText }]}
              >
                {t('profile.details.contactUs.headOffice.address')}
              </CustomText>
            </View>
            <TouchableOpacity
              style={[
                styles.mapButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.outline,
                },
              ]}
              onPress={handleViewOnMaps}
            >
              <CustomImage
                source={require('../../../assets/images/GoogleMapsLogo.png')}
                resizeMode="contain"
                style={{ height: ms(24), width: ms(16.73) }}
              />
              <CustomText
                type={TextType.ScreenDisplaySmall}
                style={[styles.linkText, { color: colors.onBackground }]}
              >
                {t('profile.details.contactUs.headOffice.viewMaps')}
              </CustomText>
            </TouchableOpacity>
          </View>

          {/* Operating Hours Section */}
          <View style={styles.section}>
            <View style={{ gap: Spacing.xs }}>
              <CustomText
                type={TextType.SectionTitle}
                style={[styles.sectionTitle, { color: colors.onSurface }]}
              >
                {t('profile.details.contactUs.operatingHours.title')}
              </CustomText>
              <CustomText
                type={TextType.ScreenDisplaySmall}
                style={[styles.text, { color: colors.secondaryText }]}
              >
                {t('profile.details.contactUs.operatingHours.weekday')}
              </CustomText>
              <CustomText
                type={TextType.ScreenDisplaySmall}
                style={[styles.text, { color: colors.secondaryText }]}
              >
                {t('profile.details.contactUs.operatingHours.saturday')}
              </CustomText>
              <CustomText
                type={TextType.ScreenDisplaySmall}
                style={[styles.text, { color: colors.secondaryText }]}
              >
                {t('profile.details.contactUs.operatingHours.sunday')}
              </CustomText>
            </View>
          </View>
        </View>
        <Separator />
        {/* Phone Support Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: colors.filterButtonBg },
              ]}
            >
              <PhoneSupportSVG width={ms(24)} height={ms(24)} />
            </View>
            <CustomText
              type={TextType.ScreenDisplayLarge}
              style={[
                styles.sectionTitle,
                {
                  marginBottom: 0,
                  marginLeft: Spacing.s,
                  color: colors.onSurface,
                },
              ]}
            >
              {t('profile.details.contactUs.phoneSupport.title')}
            </CustomText>
          </View>

          {PHONE_SUPPORT_DATA.map(item => (
            <View key={item.id} style={styles.contactItem}>
              <View style={styles.contactInfo}>
                <CustomText
                  type={TextType.ScreenDisplaySmall}
                  style={[styles.contactLabel, { color: colors.onSurface }]}
                >
                  {t(`profile.details.contactUs.phoneSupport.${item.id}.label`)}
                </CustomText>
                <CustomText
                  type={TextType.ScreenDisplaySmall}
                  style={[
                    styles.contactSubtitle,
                    { color: colors.secondaryText },
                  ]}
                >
                  {t('profile.details.contactUs.phoneSupport.availability')}
                </CustomText>
              </View>
              <CustomButton
                title={t(
                  `profile.details.contactUs.phoneSupport.${item.id}.displayNumber`,
                )}
                onPress={() =>
                  handlePhoneCall(
                    t(
                      `profile.details.contactUs.phoneSupport.${item.id}.phoneNumber`,
                    ),
                  )
                }
                variant="primary"
                style={styles.phoneButton}
                uppercase={false}
              />
            </View>
          ))}
        </View>
        <Separator />
        {/* Email Support Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: colors.filterButtonBg },
              ]}
            >
              <EmailSupportSVG width={ms(24)} height={ms(24)} />
            </View>
            <CustomText
              type={TextType.ScreenDisplayLarge}
              style={[
                styles.sectionTitle,
                {
                  marginBottom: 0,
                  marginLeft: Spacing.s,
                  color: colors.onSurface,
                },
              ]}
            >
              {t('profile.details.contactUs.emailSupport.title')}
            </CustomText>
          </View>

          {EMAIL_SUPPORT_DATA.map(item => (
            <View key={item.id} style={styles.emailItem}>
              <CustomText
                type={TextType.ScreenDisplaySmall}
                style={[styles.contactLabel, { color: colors.onSurface }]}
              >
                {t(`profile.details.contactUs.emailSupport.${item.id}.label`)}
              </CustomText>
              <TouchableOpacity
                style={{ alignSelf: 'flex-start' }}
                onPress={() =>
                  handleEmail(
                    t(
                      `profile.details.contactUs.emailSupport.${item.id}.email`,
                    ),
                  )
                }
              >
                <CustomText
                  type={TextType.ScreenDisplaySmall}
                  style={styles.emailText}
                >
                  {t(`profile.details.contactUs.emailSupport.${item.id}.email`)}
                </CustomText>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: ms(20),
    paddingVertical: Spacing.xl,
    gap: Spacing.xxl,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.m,
    paddingBottom: Spacing.m,
  },
  companyName: {
    fontWeight: Typography.headlineMedium.fontWeight,
  },
  subtitle: {
    color: '#4A4A4A',
    marginTop: Spacing.xs,
  },
  rightButton: {
    padding: ms(6),
    marginRight: -ms(6),
  },
  section: {
    gap: Spacing.l,
  },
  sectionTitle: {
    fontWeight: Typography.headlineMedium.fontWeight,
    marginBottom: Spacing.xs,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    gap: Spacing.xs,
  },
  text: {
    color: '#4A4A4A',
  },
  mapButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.s,
    paddingVertical: ms(8),
    paddingHorizontal: ms(16),
    borderRadius: ms(8),
    borderWidth: ms(1),
  },
  linkText: {
    fontWeight: Typography.headlineMedium.fontWeight,
  },
  emailText: {
    color: '#0069B1',
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.s,
  },
  contactInfo: {
    flex: 1,
    gap: Spacing.xs,
  },
  contactLabel: {
    fontWeight: '600',
  },
  contactSubtitle: {
    color: '#4A4A4A',
    fontSize: ms(12),
  },
  phoneButton: {
    paddingHorizontal: Spacing.m,
    height: ms(36),
  },
  emailItem: {
    gap: Spacing.xs,
    paddingVertical: Spacing.xs,
  },
  iconContainer: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ContactUs;
