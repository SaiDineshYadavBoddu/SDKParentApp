import React, { useState } from 'react';
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
import NoInternetSVG from '../../../assets/svgs/NoInternetSVG';
import { useGetUserDetailsQuery } from '../../../network/profile/profile.api';
import { useGetUserMeQuery } from '../../../network/user/user.api';
import CustomLoader from '../../../common/components/CustomLoader';
import RequestTimeoutScreen from '../../../common/components/RequestTimeoutScreen';
import ConfirmationBottomSheet from '../../../common/components/ConfirmationBottomSheet';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const { signOut, changePassword, changeCompany } = useAuth();
  const { t } = useTranslation();
  const { isLoading, error, refetch, isFetching } = useGetUserDetailsQuery();
  
  const { data: userMeData } = useGetUserMeQuery();
  
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const isTimeoutError = (error as any)?.status === 'TIMEOUT_ERROR';
  
  if (isTimeoutError) {
    return (
      <View style={[styles.container, { backgroundColor: colors.screenBackground }]}>
        <CustomHeader
          title={t('profile.headerTitle')}
        />
        <RequestTimeoutScreen onRetry={refetch} />
        <CustomLoader loading={isFetching} />
      </View>
    );
  }

  // Determine if Change Company should be shown
  const userGroups = userMeData?.userGroups || [];
  const showChangeCompany = userGroups.length > 1;

  const accountSettingsItems: ProfileItemProps[] = [
    {
      id: 'change-company',
      title: t('profile.items.changeCompany.title'),
      subtitle: t('profile.items.changeCompany.subtitle'),
      Icon: ChangeCompanySVG,
      onPress: () => changeCompany(),
    },
    {
      id: 'change-password',
      title: t('profile.items.changePassword.title'),
      subtitle: t('profile.items.changePassword.subtitle'),
      Icon: ChangePasswordSVG,
      onPress: () => changePassword(),
    },
  ].filter(item => {
    if (item.id === 'change-company') {
      return showChangeCompany;
    }
    return true;
  });

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
      onPress: () => setShowLogoutConfirm(true),
    },
  ];

  // if(!isLoading) return <CustomLoader loading={isLoading}/>

  return (
    <View style={[styles.container, { backgroundColor: colors.screenBackground }]}>
      <CustomHeader
        title={t('profile.headerTitle')}
        rightContent={
          <TouchableOpacity style={styles.rightButton} onPress={() => { navigation.navigate('Notifications') }}>
            <NotificationSVG width={ms(24)} height={ms(24)} />
          </TouchableOpacity>
        }
      />
      {isLoading ? <CustomLoader loading={isLoading} /> :
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
      }
      {/* <CustomLoader loading={isLoading}/> */}
      
      <ConfirmationBottomSheet
        visible={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        title={t('profile.items.logout')}
        message={t('profile.items.logoutConfirmMessage')}
        cancelText={t('common.cancel')}
        confirmText={t('common.confirm')}
        onConfirm={() => {
          setShowLogoutConfirm(false);
          signOut();
        }}
      />
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
