import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ms } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/ThemeProvider';
import { Spacing } from '../../theme/spacing';
import CustomText, { TextType } from './CustomText';
import CustomButton from './CustomButton';
import FailureSVG from '../../assets/svgs/FailureSVG';

interface Props {
    title?: string;
    description?: string;
    onRetry?: () => void;
    /** When set, shows "Go back" instead of "Try Again" and calls this. */
    onGoBack?: () => void;
    loading?: boolean;
}

export default function CustomErrorView({
    title = 'serverError.title',
    description = 'serverError.description',
    onRetry,
    onGoBack,
    loading = false,
}: Props) {
    const { colors } = useTheme();
    const { t } = useTranslation();
    const useGoBack = Boolean(onGoBack);

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <FailureSVG width={ms(80)} height={ms(80)} />
                </View>
                <CustomText
                    type={TextType.ScreenHeadlineLarge}
                    style={[styles.title, { color: colors.onBackground }]}
                >
                    {t(title)}
                </CustomText>
                <CustomText
                    type={TextType.ScreenDisplaySmall}
                    style={[styles.description, { color: colors.secondaryText }]}
                >
                    {t(description)}
                </CustomText>
            </View>
            <View style={styles.footer}>
                <CustomButton
                    title={useGoBack ? t('common.goBack') : t('serverError.tryAgain')}
                    onPress={useGoBack ? onGoBack! : onRetry!}
                    loading={loading}
                    uppercase={false}
                    style={styles.button}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        gap: Spacing.l,
    },
    iconContainer: {
        marginBottom: Spacing.s,
    },
    title: {
        textAlign: 'center',
    },
    description: {
        textAlign: 'center',
        paddingHorizontal: Spacing.m,
    },
    footer: {
        width: '100%',
        paddingBottom: Spacing.xl,
    },
    button: {
        width: '100%',
    },
});
