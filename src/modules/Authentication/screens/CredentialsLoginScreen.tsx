import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { moderateScale } from 'react-native-size-matters';
import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomTextInput from '../../../common/components/CustomTextInput';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../theme/ThemeProvider';
import { DEMO_CREDENTIALS } from '../../../constants/demoAuth';
import EyeOpenSVG from '../../../assets/svgs/EyeOpenSVG';
import EyeCloseSvg from '../../../assets/svgs/EyeCloseSvg';
import ChevronLeftSVG from '../../../assets/svgs/ChevronLeftSVG';

const CredentialsLoginScreen = () => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const { signInWithCredentials } = useAuth();
  const [username, setUsername] = useState(DEMO_CREDENTIALS.username);
  const [password, setPassword] = useState(DEMO_CREDENTIALS.password);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username.trim() || !password) {
      setError(t('credentialsLogin.emptyFields'));
      return;
    }

    const success = await signInWithCredentials(username, password);
    if (!success) {
      setError(t('credentialsLogin.invalidCredentials'));
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.backgroundVariant }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          accessibilityRole="button"
        >
          <ChevronLeftSVG />
        </TouchableOpacity>

        <Image
          source={require('../../../assets/images/Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <CustomText type={TextType.ScreenHeadlineLarge} style={styles.title}>
          {t('credentialsLogin.title')}
        </CustomText>
        <CustomText type={TextType.ScreenDisplayMedium} style={[styles.subtitle, { color: colors.secondaryText }]}>
          {t('credentialsLogin.subtitle')}
        </CustomText>

        <CustomTextInput
          label={t('credentialsLogin.username')}
          value={username}
          onChangeText={text => {
            setUsername(text);
            if (error) setError('');
          }}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={t('credentialsLogin.usernamePlaceholder')}
        />

        <CustomTextInput
          label={t('credentialsLogin.password')}
          value={password}
          onChangeText={text => {
            setPassword(text);
            if (error) setError('');
          }}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder={t('credentialsLogin.passwordPlaceholder')}
          error={error}
          rightIcon={
            <TouchableOpacity onPress={() => setShowPassword(prev => !prev)}>
              {showPassword ? <EyeOpenSVG /> : <EyeCloseSvg />}
            </TouchableOpacity>
          }
        />

        <CustomText type={TextType.CardText} style={[styles.hint, { color: colors.secondaryText }]}>
          {t('credentialsLogin.hint', {
            username: DEMO_CREDENTIALS.username,
            password: DEMO_CREDENTIALS.password,
          })}
        </CustomText>

        <TouchableOpacity
          style={[styles.loginButton, { backgroundColor: colors.primary }]}
          onPress={handleLogin}
        >
          <CustomText type={TextType.Button}>{t('credentialsLogin.loginButton')}</CustomText>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: moderateScale(24),
    paddingTop: moderateScale(56),
    paddingBottom: moderateScale(32),
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: moderateScale(6),
    marginLeft: -moderateScale(6),
    marginBottom: moderateScale(16),
  },
  logo: {
    width: moderateScale(120),
    height: moderateScale(40),
    alignSelf: 'flex-start',
    marginBottom: moderateScale(24),
  },
  title: {
    marginBottom: moderateScale(8),
  },
  subtitle: {
    marginBottom: moderateScale(24),
  },
  hint: {
    marginBottom: moderateScale(24),
    lineHeight: moderateScale(18),
  },
  loginButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
});

export default CredentialsLoginScreen;
