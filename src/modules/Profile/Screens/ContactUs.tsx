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
import MenuHamburgerSVG from '../../../assets/svgs/MenuHamburgerSVG';
import { Spacing } from '../../../theme/spacing';
import CustomText, { TextType } from '../../../common/components/CustomText';
import { useNavigation } from '@react-navigation/native';
import NetworkLogoSVG from '../../../assets/svgs/NetworkLogoSVG';
import CustomButton from '../../../common/components/CustomButton';
import CustomImage from '../../../common/components/CustomImage';
import PhoneSupportSVG from '../../../assets/svgs/PhoneSuppotSVG';
import EmailSupportSVG from '../../../assets/svgs/EmailSupportSVG';

// Types for support items
type PhoneSupportItem = {
    id: string;
    label: string;
    subtitle: string;
    phoneNumber: string;
    displayNumber: string;
};

type EmailSupportItem = {
    id: string;
    label: string;
    email: string;
};

// Data arrays
const PHONE_SUPPORT_DATA: PhoneSupportItem[] = [
    {
        id: 'uae-toll-free',
        label: 'UAE Toll-Free Contact Center',
        subtitle: '24/7 Support',
        phoneNumber: '8004448',
        displayNumber: '800-4448',
    },
    {
        id: 'uae-international',
        label: 'UAE International Line',
        subtitle: '24/7 Support',
        phoneNumber: '+97145974000',
        displayNumber: '+971 4 597 4000',
    },
];

const EMAIL_SUPPORT_DATA: EmailSupportItem[] = [
    {
        id: 'merchant-services',
        label: 'Merchant Services – SME',
        email: 'sbcustomer@network.ae',
    },
    {
        id: 'government-support',
        label: 'Government Support',
        email: 'nigovernment@network.global',
    },
    {
        id: 'ecommerce',
        label: 'Ecommerce/Payment Gateway',
        email: 'ecomsupport@network.global',
    },
    {
        id: 'issuer-services',
        label: 'Issuer Services',
        email: 'salesteam.middleeast@network.global',
    },
];

const ContactUs = () => {
    const { colors } = useTheme();
    const navigation = useNavigation();

    const handlePhoneCall = (phoneNumber: string) => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const handleEmail = (email: string) => {
        Linking.openURL(`mailto:${email}`);
    };

    const handleViewOnMaps = () => {
        const address = 'PO Box 123456, Dubai, United Arab Emirates';
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
        Linking.openURL(url);
    };

    const Separator = () => (
        <View
            style={{
                height: 1,
                backgroundColor: '#E0E0E0',
            }}
        />
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <CustomHeader
                title="Contact Us"
                titleStyle={{ fontWeight: Typography.headlineMedium.fontWeight }}
                onBackPress={() => navigation.goBack()}
                rightContent={
                    <TouchableOpacity style={styles.rightButton}>
                        <MenuHamburgerSVG
                            color={colors.onSurface}
                            width={ms(24)}
                            height={ms(24)}
                        />
                    </TouchableOpacity>
                }
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
                                style={styles.companyName}
                            >
                                Network International
                            </CustomText>
                            <CustomText
                                type={TextType.ScreenDisplaySmall}
                                style={styles.subtitle}
                            >
                                Leading payment solutions
                            </CustomText>
                        </View>
                    </View>

                    {/* Head Office Section */}
                    <View style={styles.section}>
                        <CustomText type={TextType.SectionTitle} style={styles.sectionTitle}>
                            Head office
                        </CustomText>
                        <View style={{ gap: Spacing.xs }}>
                            <CustomText type={TextType.ScreenDisplaySmall} style={styles.text}>
                                Network International
                            </CustomText>
                            <CustomText type={TextType.ScreenDisplaySmall} style={styles.text}>
                                PO Box 123456
                            </CustomText>
                            <CustomText type={TextType.ScreenDisplaySmall} style={styles.text}>
                                Dubai, United Arab Emirates
                            </CustomText>
                        </View>
                        <TouchableOpacity style={styles.mapButton} onPress={handleViewOnMaps}>
                            <CustomImage
                                source={require('../../../assets/images/GoogleMapsLogo.png')}
                                resizeMode="contain"
                                style={{ height: ms(24), width: ms(16.73) }}
                            />
                            <CustomText
                                type={TextType.ScreenDisplaySmall}
                                style={styles.linkText}
                            >
                                View on Google Maps
                            </CustomText>

                        </TouchableOpacity>
                    </View>

                    {/* Operating Hours Section */}
                    <View style={styles.section}>
                        <View style={{ gap: Spacing.xs }}>
                            <CustomText type={TextType.SectionTitle} style={styles.sectionTitle}>
                                Operating Hours
                            </CustomText>
                            <CustomText type={TextType.ScreenDisplaySmall} style={styles.text}>
                                Monday - Friday, 9 AM - 6 PM
                            </CustomText>
                            <CustomText type={TextType.ScreenDisplaySmall} style={styles.text}>
                                Saturday: 9:00 AM -2:00 PM
                            </CustomText>
                            <CustomText type={TextType.ScreenDisplaySmall} style={styles.text}>
                                Sunday: Closed
                            </CustomText>
                        </View>
                    </View>
                </View>
                <Separator />
                {/* Phone Support Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <View style={[styles.iconContainer, { backgroundColor: '#F5F9FC' }]}>
                            <PhoneSupportSVG width={ms(24)} height={ms(24)} />
                        </View>
                        <CustomText
                            type={TextType.ScreenDisplayLarge}
                            style={[styles.sectionTitle, { marginBottom: 0, marginLeft: Spacing.s }]}
                        >
                            Phone Support
                        </CustomText>
                    </View>

                    {PHONE_SUPPORT_DATA.map((item) => (
                        <View key={item.id} style={styles.contactItem}>
                            <View style={styles.contactInfo}>
                                <CustomText
                                    type={TextType.ScreenDisplaySmall}
                                    style={styles.contactLabel}
                                >
                                    {item.label}
                                </CustomText>
                                <CustomText
                                    type={TextType.ScreenDisplaySmall}
                                    style={styles.contactSubtitle}
                                >
                                    {item.subtitle}
                                </CustomText>
                            </View>
                            <CustomButton
                                title={item.displayNumber}
                                onPress={() => handlePhoneCall(item.phoneNumber)}
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
                        <View style={[styles.iconContainer, { backgroundColor: '#F5F9FC' }]}>
                            <EmailSupportSVG width={ms(24)} height={ms(24)} />
                        </View>
                        <CustomText
                            type={TextType.ScreenDisplayLarge}
                            style={[styles.sectionTitle, { marginBottom: 0, marginLeft: Spacing.s }]}
                        >
                            Email Support
                        </CustomText>
                    </View>

                    {EMAIL_SUPPORT_DATA.map((item) => (
                        <View key={item.id} style={styles.emailItem}>
                            <CustomText
                                type={TextType.ScreenDisplaySmall}
                                style={styles.contactLabel}
                            >
                                {item.label}
                            </CustomText>
                            <TouchableOpacity onPress={() => handleEmail(item.email)}>
                                <CustomText
                                    type={TextType.ScreenDisplaySmall}
                                    style={styles.emailText}
                                >
                                    {item.email}
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
        backgroundColor: '#fff',
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
        backgroundColor: '#fff',
        borderRadius: ms(8),
        borderWidth: ms(1),
        borderColor: '#E0E0E0',
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
