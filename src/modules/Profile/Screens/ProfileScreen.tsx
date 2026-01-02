import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import CustomText, { TextType } from '../../../common/components/CustomText';
import NotificationSVG from '../../../assets/svgs/NotificationSVG';
import { t } from 'i18next';
import { ms } from 'react-native-size-matters';
import { Spacing } from '../../../theme/spacing';
import UserData from '../Components/UserData';
import ProfileSection, { ProfileItemProps } from '../Components/ProfileSection';

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
import MenuHamburgerSVG from '../../../assets/svgs/MenuHamburgerSVG';
import { useTheme } from '../../../theme/ThemeProvider';

const ProfileScreen = () => {

    const navigation = useNavigation<any>();
    const { colors } = useTheme();

    const accountSettingsItems: ProfileItemProps[] = [
        {
            id: "change-company",
            title: "Change Company",
            subtitle: "Change your company",
            Icon: ChangeCompanySVG,
            onPress: () => navigation.navigate("ChangeCompany"),
        },
        {
            id: "change-password",
            title: "Change Password",
            subtitle: "Change your account password",
            Icon: ChangePasswordSVG,
            onPress: () => console.log("Change Password"),
        },
    ];

    const infoItems: ProfileItemProps[] =  [
        {
            id: "contact-details",
            title: "Contact Details",
            subtitle: "View your contact details",
            Icon: ContactDetailsSVG,
            onPress: () => navigation.navigate("ContactDetails"),
        },
        {
            id: "personal-details",
            title: "Personal Details",
            subtitle: "View or edit your personal information",
            Icon: PersonalDetailsSVG,
            onPress: () => navigation.navigate("PersonalDetails"),
        },
        {
            id: "addresses",
            title: "Addresses",
            subtitle: "View your addresses",
            Icon: AddressesSVG,
            onPress: () => navigation.navigate("Addresses"),
        },
        {
            id: "personal-docs",
            title: "Personal Documents",
            subtitle: "View or update your document information",
            Icon: PersonalDocumentsSVG,
            onPress: () => navigation.navigate("PersonalDocuments"),
        },
    ];

    const contactItems: ProfileItemProps[] = [
        {
            id: "support",
            title: "Support",
            subtitle: "Request a callback for your queries",
            Icon: SupportSVG,
            onPress: () => navigation.navigate("Support"),
        },
        {
            id: "contact-us",
            title: "Contact Us",
            subtitle: "Call or email us",
            Icon: ContactUsSVG,
            onPress: () => console.log("Contact Us"),
        },
        {
            id: "logout",
            title: "Log out",
            Icon: LogOutSVG,
            onPress: () => console.log("Log out"),
        },
    ];


    return (
        <View style={styles.container}>
            <CustomHeader title="My Profile" 
                rightContent={
                    <TouchableOpacity style={styles.rightButton}>
                        <NotificationSVG width={ms(24)} height={ms(24)} />
                    </TouchableOpacity>
                } 
            />
            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.userData}>
                    <UserData/>
                </View>
                
                <ProfileSection
                    title="Account Settings"
                    items={accountSettingsItems}
                />

                <ProfileSection
                    title="Information & Documents"
                    items={infoItems}
                />

                <ProfileSection
                    title="Contact & Support"
                    items={contactItems}
                />
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        flex : 1,
    },
    scrollContainer: {
        flex : 1,
        paddingTop: Spacing.l,
        backgroundColor: '#F5F9FC',
    },
    userData: {
        paddingHorizontal: Spacing.l,
        marginBottom: Spacing.l,
    },
    rightButton: {
        padding: ms(6),
        marginRight: -ms(6),
    }
});

export default ProfileScreen;
