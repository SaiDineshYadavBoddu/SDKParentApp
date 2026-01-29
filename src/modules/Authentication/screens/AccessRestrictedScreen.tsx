import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../theme/ThemeProvider';
import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomButton from '../../../common/components/CustomButton';
import AccessRestrictedSVG from '../../../assets/svgs/AccessRestrictedSVG';
import { moderateScale } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

const AccessRestrictedScreen = () => {
    const { signOut } = useAuth();
    const { colors } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.contentContainer}>
                <AccessRestrictedSVG width={width * 0.6} height={width * 0.6} />
                <View style={styles.textContainer}>
                    <CustomText type={TextType.ScreenHeadlineMedium} style={styles.title}>
                        Access Restricted
                    </CustomText>
                    <CustomText type={TextType.ScreenDisplayMedium} style={styles.description}>
                        You do not have permission to access this feature. Contact your administrator for access.
                    </CustomText>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <CustomButton
                    title="Go Back"
                    onPress={signOut}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: moderateScale(20),
        justifyContent: 'space-between',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
        marginTop: moderateScale(30),
        alignItems: 'center',
        gap: moderateScale(10),
    },
    title: {
        textAlign: 'center',
    },
    description: {
        textAlign: 'center',
        paddingHorizontal: moderateScale(20),
    },
    buttonContainer: {
        paddingBottom: moderateScale(20),
        width: '100%',
    },
});

export default AccessRestrictedScreen;
