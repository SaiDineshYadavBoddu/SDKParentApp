import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ms } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../theme/ThemeProvider';
import { Spacing } from '../../theme/spacing';
import CustomText, { TextType } from './CustomText';
import CustomButton from './CustomButton';
import NoInternetSVG from '../../assets/svgs/NoInternetSVG';

export default function GenericInfoScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const {
    icon,
    title,
    description,
    primaryButton,
    secondaryButton,
    titleStyle,
    descriptionStyle,
  } = route.params || {};

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.iconContainer}>
          {icon}
        </View>
      <View style={styles.textContainer}>
        <CustomText
            type={TextType.ScreenHeadlineLarge}
            style={[styles.title, { color: colors.onBackground }, titleStyle]}
        >
            {t(title)}
        </CustomText>

        <CustomText
            type={TextType.ScreenDisplaySmall}
            style={[styles.description, { color: colors.secondaryText }, descriptionStyle]}
        >
            {t(description)}
        </CustomText>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        {primaryButton && (
             <CustomButton
                title={t(primaryButton.title)}
                onPress={primaryButton.onPress || (() => {})}
                style={styles.button}
                uppercase={false}
             />
        )}
        {secondaryButton && (
             <CustomButton
                title={t(secondaryButton.title)}
                onPress={secondaryButton.onPress || (() => {})}
                variant="outlined"
                style={[styles.button, styles.secondaryButton]}
                uppercase={false}
             />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingBottom: ms(100), // Space for footer
  },
  iconContainer: {
    marginBottom: Spacing.xxl,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.m,
  },
  description: {
    textAlign: 'center',
    lineHeight: ms(24),
  },
  footer: {
    padding: Spacing.l,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: 'transparent',
    gap: Spacing.m,
  },
  button: {
    width: '100%',
  },
  secondaryButton: {
    marginTop: 0, // Gap handled by footer container
  },
  textContainer : {
    gap : Spacing.l
  }
});
