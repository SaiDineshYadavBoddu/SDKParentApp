import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/ThemeProvider';
import CustomText, { TextType } from './CustomText';
import CustomButton from './CustomButton';
import RequestTimeoutSVG from '../../assets/svgs/RequestTimeoutSVG';
import { moderateScale } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

interface RequestTimeoutScreenProps {
    onRetry?: () => void;
    /** When set, shows "Go back" instead of "Try Again" and calls this. */
    onGoBack?: () => void;
}

const RequestTimeoutScreen = ({ onRetry, onGoBack }: RequestTimeoutScreenProps) => {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const useGoBack = Boolean(onGoBack);

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.contentContainer}>
                <RequestTimeoutSVG width={width * 0.4} height={width * 0.4} />
                <View style={styles.textContainer}>
                    <CustomText type={TextType.ScreenHeadlineMedium} style={styles.title}>
                        Request Timeout
                    </CustomText>
                    <CustomText type={TextType.ScreenDisplayMedium} style={styles.description}>
                        The request took too long to complete. This might be due to a slow connection or server load.
                    </CustomText>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <CustomButton
                    title={useGoBack ? t('common.goBack') : t('common.tryAgain')}
                    onPress={useGoBack ? onGoBack! : onRetry!}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: moderateScale(20),
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
        width: '100%',
        paddingBottom: moderateScale(20),
    },
});

export default RequestTimeoutScreen;
