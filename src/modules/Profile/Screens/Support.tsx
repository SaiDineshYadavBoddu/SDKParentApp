import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import CustomHeader from '../../../common/components/CustomHeader';
import { Typography } from '../../../theme/typography';
import { useTheme } from '../../../theme/ThemeProvider';
import { ms } from 'react-native-size-matters';
import { Spacing } from '../../../theme/spacing';
import SupportHeaderSVG from '../../../assets/svgs/SupportHeaderSVG';
import CustomText, { TextType } from '../../../common/components/CustomText';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import CustomTextInput from '../../../common/components/CustomTextInput';
import CustomDropdown from '../../../common/components/CustomDropdown';
import CustomBottomSheet from '../../../common/components/CustomBottomSheet';
import CustomButton from '../../../common/components/CustomButton';
import { TOPICS } from '../../../constants/appConstants';
import CustomRadioButton from '../../../common/components/CustomRadioButton';
import UAESVG from '../../../assets/svgs/UAESVG';
import { useCreateSupportRequestMutation } from '../../../network/profile/profile.api';
import SuccessSVG from '../../../assets/svgs/SuccessSVG';
import FailureSVG from '../../../assets/svgs/FailureSVG';
import CustomLoader from '../../../common/components/CustomLoader';

const Support = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>('');
  const [tempTopic, setTempTopic] = useState<string | undefined>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [description, setDescription] = useState('');
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToInput = (y: number) => {
    scrollViewRef.current?.scrollTo({ y, animated: true });
  };

  useEffect(() => {
    const handleReset = () => {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }, 100);
    };

    const listeners = [
      Keyboard.addListener('keyboardDidHide', handleReset),
      Keyboard.addListener('keyboardWillHide', handleReset),
    ];

    return () => {
      listeners.forEach(l => l.remove());
    };
  }, []);


  const [createSupportRequest, { isLoading: isSubmitting }] =
    useCreateSupportRequestMutation();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const isFormValid = phoneNumber.length === 9 && !!selectedTopic && description.length > 0;

  const handleConfirm = () => {
    setSelectedTopic(tempTopic);
    setIsBottomSheetVisible(false);
  };

  const handleContactMe = async () => {
    if (!isFormValid) return;

    try {
      const response = await createSupportRequest({
        phoneNumber: `+971${phoneNumber}`,
        topic: t(`support.topics.${selectedTopic}`),
        description: description,
      }).unwrap();

      setSelectedTopic('');
      setPhoneNumber('');
      setDescription('');

      // @ts-ignore
      navigation.navigate('GenericInfoScreen', {
        icon: <SuccessSVG />,
        title: t('support.requestSuccessTitle', { id: response?.id }),
        titleStyle: Typography.headlineMedium,
        description: 'support.requestSuccessSubtitle',
        primaryButton: {
          title: 'common.done',
          onPress: () => navigation.goBack(),
        },
      });
    } catch (error) {
      console.error('Support request failed', error);
      // @ts-ignore
      navigation.navigate('GenericInfoScreen', {
        icon: <FailureSVG />,
        title: 'support.requestFailureTitle',
        titleStyle: Typography.headlineMedium,
        description: 'support.requestFailureSubtitle',
        primaryButton: {
          title: 'common.tryAgain',
          onPress: () => navigation.goBack(),
        },
      });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <CustomHeader
        title={t('profile.items.support.title')}
        titleStyle={{ fontWeight: Typography.headlineMedium.fontWeight }}
        onBackPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? ms(100) : 0}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <View style={styles.headerContainer}>
              <SupportHeaderSVG />
              <CustomText
                type={TextType.ScreenHeadlineLarge}
                style={{ fontWeight: Typography.headlineMedium.fontWeight }}
              >
                {t('support.title')}
              </CustomText>
              <CustomText
                type={TextType.ScreenDisplaySmall}
                style={{ color: colors.secondaryText }}
              >
                {t('support.description')}
              </CustomText>
            </View>

            <CustomText
              type={TextType.ScreenDisplaySmall}
              style={{
                fontWeight: Typography.headlineMedium.fontWeight,
                marginTop: Spacing.xl,
              }}
            >
              {t('support.supportDescription')}
            </CustomText>

            <View style={{ marginTop: Spacing.xl }}>
              <CustomTextInput
                label={t('support.contactNumber')}
                required={true}
                keyboardType="number-pad"
                value={phoneNumber}
                maxLength={9}
                onChangeText={setPhoneNumber}
                readOnly={isSubmitting}
                editable={!isSubmitting}
                inputStyle={styles.inputContainer}
                inputContainerStyle={[
                  styles.inputContainerStyle,
                  { borderColor: colors.outline },
                ]}
                leftIcon={
                  <View style={styles.leftIconContainer}>
                    <UAESVG width={ms(24)} height={ms(18)} />
                    <CustomText
                      type={TextType.ScreenDisplaySmall}
                    >{`+971`}</CustomText>
                  </View>
                }
              />
              <CustomDropdown
                label={t('support.selectTopic')}
                required={true}
                placeholder={t('common.select')}
                selectedValue={
                  selectedTopic
                    ? t(`support.topics.${selectedTopic}`)
                    : undefined
                }
                disabled={isSubmitting}
                onPress={() => {
                  Keyboard.dismiss();
                  setTempTopic(selectedTopic);
                  setIsBottomSheetVisible(true);
                }}
                containerStyle={styles.dropdown}
                innerContainerStyle={styles.innerContainer}
              />
              <CustomTextInput
                label={t('support.selectTopicDesc')}
                required={true}
                placeholder={t('support.describeRequestPlaceholder')}
                multiline={true}
                value={description}
                maxLength={255}
                onChangeText={setDescription}
                readOnly={isSubmitting}
                editable={!isSubmitting}
                onFocus={() => scrollToInput(ms(400))}
                inputStyle={[styles.inputContainer, { paddingLeft: 0 }]}
                inputContainerStyle={{
                  borderColor: colors.outline,
                  padding: ms(8),
                  height: ms(120),
                  backgroundColor: colors.surface,
                }}
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <CustomButton
            title={t('support.contactMe')}
            onPress={handleContactMe}
            disabled={!isFormValid || isSubmitting}
            uppercase={false}
          />
        </View>
      </KeyboardAvoidingView>

      <CustomBottomSheet
        visible={isBottomSheetVisible}
        onClose={() => setIsBottomSheetVisible(false)}
        title={t('support.selectTopic')}
      >
        <View style={styles.bottomSheetContent}>
          {TOPICS.map(topic => (
            <TouchableOpacity
              key={topic}
              style={[
                styles.card,
                {
                  borderColor:
                    tempTopic === topic ? colors.primary : colors.outline,
                  borderWidth: tempTopic === topic ? ms(1) : ms(0.5),
                },
              ]}
              activeOpacity={0.8}
              onPress={() => setTempTopic(topic)}
            >
              <CustomRadioButton
                label={t(`support.topics.${topic}`)}
                selected={tempTopic === topic}
                onPress={() => setTempTopic(topic)}
                containerStyle={styles.radioButton}
                labelStyle={styles.radioLabel}
              />
            </TouchableOpacity>
          ))}

          <CustomButton
            title={t('common.confirm')}
            onPress={handleConfirm}
            disabled={!tempTopic}
            style={styles.confirmButton}
            uppercase={false}
          />
        </View>
      </CustomBottomSheet>
      <CustomLoader loading={isSubmitting} />
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      paddingHorizontal: ms(36),
      paddingBottom: ms(180),
      gap: Spacing.xl,
      flexGrow: 1,
    },
    headerContainer: {
      gap: Spacing.l,
    },
    inputContainer: {
      paddingLeft: Spacing.s,
      fontWeight: '500',
    },
    rightButton: {
      padding: ms(6),
      marginRight: -ms(6),
    },
    dropdown: {
      marginBottom: ms(24),
    },
    innerContainer: {
      borderColor: colors.outline,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: ms(16),
      paddingVertical: ms(16),
      paddingHorizontal: ms(16),
      borderWidth: 1,
    },
    bottomSheetContent: {
      width: '100%',
      gap: Spacing.xl,
    },
    radioButton: {
      marginVertical: 0,
    },
    confirmButton: {
      width: '100%',
    },
    radioLabel: {
      fontSize: ms(16),
      fontWeight: '500',
      marginLeft: ms(12),
    },
    leftIconContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    inputContainerStyle: {},
    footer: {
      padding: Spacing.l,
      paddingHorizontal: ms(36),
      backgroundColor: colors.background,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.outline,
    },
  });

export default Support;
