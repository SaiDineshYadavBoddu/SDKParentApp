import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../../../theme/ThemeProvider';
import NotificationSVG from '../../../assets/svgs/NotificationSVG';
import { ms } from 'react-native-size-matters';
import { Spacing } from '../../../theme/spacing';
import UserData from '../Components/UserData';
import ProfileSection, { ProfileItemProps } from '../Components/ProfileSection';
import { useTranslation } from 'react-i18next';

// Icons
import ChangeCompanySVG from '../../../assets/svgs/ChangeCompanySVG';
import ChangePasswordSVG from '../../../assets/svgs/ChangePasswordSVG';
import ContactDetailsSVG from '../../../assets/svgs/ContactDetailsSVG';
import PersonalDetailsSVG from '../../../assets/svgs/PersonalDetailsSVG';
import AddressesSVG from '../../../assets/svgs/AddressesSVG';
import PersonalDocumentsSVG from '../../../assets/svgs/PersonalDocumentsSVG';
import SupportSVG from '../../../assets/svgs/SupportSVG';
import ContactUsSVG from '../../../assets/svgs/ContactUsSVG';
import LogOutSVG from '../../../assets/svgs/LogOutSVG';
import CustomHeader from '../../../common/components/CustomHeader';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { signOut } = useAuth();
  const { t } = useTranslation();

  const accountSettingsItems: ProfileItemProps[] = [
    {
      id: 'change-company',
      title: t('profile.items.changeCompany.title'),
      subtitle: t('profile.items.changeCompany.subtitle'),
      Icon: ChangeCompanySVG,
      onPress: () => navigation.navigate('ChangeCompany'),
    },
    {
      id: 'change-password',
      title: t('profile.items.changePassword.title'),
      subtitle: t('profile.items.changePassword.subtitle'),
      Icon: ChangePasswordSVG,
      onPress: () => console.log('Change Password'),
    },
  ];

  const infoItems: ProfileItemProps[] = [
    {
      id: 'contact-details',
      title: t('profile.items.contactDetails.title'),
      subtitle: t('profile.items.contactDetails.subtitle'),
      Icon: ContactDetailsSVG,
      onPress: () => navigation.navigate('ContactDetails'),
    },
    {
      id: 'personal-details',
      title: t('profile.items.personalDetails.title'),
      subtitle: t('profile.items.personalDetails.subtitle'),
      Icon: PersonalDetailsSVG,
      onPress: () => navigation.navigate('PersonalDetails'),
    },
    {
      id: 'addresses',
      title: t('profile.items.addresses.title'),
      subtitle: t('profile.items.addresses.subtitle'),
      Icon: AddressesSVG,
      onPress: () => navigation.navigate('Addresses'),
    },
    {
      id: 'personal-docs',
      title: t('profile.items.personalDocs.title'),
      subtitle: t('profile.items.personalDocs.subtitle'),
      Icon: PersonalDocumentsSVG,
      onPress: () => navigation.navigate('PersonalDocuments'),
    },
  ];

  const contactItems: ProfileItemProps[] = [
    {
      id: 'support',
      title: t('profile.items.support.title'),
      subtitle: t('profile.items.support.subtitle'),
      Icon: SupportSVG,
      onPress: () => navigation.navigate('Support'),
    },
    {
      id: 'contact-us',
      title: t('profile.items.contactUs.title'),
      subtitle: t('profile.items.contactUs.subtitle'),
      Icon: ContactUsSVG,
      onPress: () => navigation.navigate('ContactUs'),
    },
    {
      id: 'logout',
      title: t('profile.items.logout'),
      Icon: LogOutSVG,
      onPress: () => signOut(),
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader
        title={t('profile.headerTitle')}
        rightContent={
          <TouchableOpacity style={styles.rightButton}>
            <NotificationSVG width={ms(24)} height={ms(24)} />
          </TouchableOpacity>
        }
      />
      <ScrollView
        style={[styles.scrollContainer, { backgroundColor: colors.screenBackground }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.userData}>
          <UserData />
        </View>

        <ProfileSection title={t('profile.sections.accountSettings')} items={accountSettingsItems} />

        <ProfileSection title={t('profile.sections.information')} items={infoItems} />

        <ProfileSection title={t('profile.sections.contact')} items={contactItems} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingTop: Spacing.l,
  },
  userData: {
    paddingHorizontal: Spacing.l,
    marginBottom: Spacing.l,
  },
  rightButton: {
    padding: ms(6),
    marginRight: -ms(6),
  },
});

export default ProfileScreen;
