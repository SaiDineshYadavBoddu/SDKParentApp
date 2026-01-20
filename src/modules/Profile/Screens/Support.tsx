import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CustomHeader from '../../../common/components/CustomHeader';
import { Typography } from '../../../theme/typography';
import { useTheme } from '../../../theme/ThemeProvider';
import { ms } from 'react-native-size-matters';
import MenuHamburgerSVG from '../../../assets/svgs/MenuHamburgerSVG';
import { Spacing } from '../../../theme/spacing';
import SupportHeaderSVG from '../../../assets/svgs/SupportHeaderSVG';
import CustomText, { TextType } from '../../../common/components/CustomText';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import CustomTextInput from '../../../common/components/CustomTextInput';
import ContactDetailsSVG from '../../../assets/svgs/ContactDetailsSVG';
import CustomDropdown from '../../../common/components/CustomDropdown';
import CustomBottomSheet from '../../../common/components/CustomBottomSheet';
import CustomButton from '../../../common/components/CustomButton';
import { TOPICS } from '../../../constants/appConstants';
import CustomRadioButton from '../../../common/components/CustomRadioButton';
import UAESVG from '../../../assets/svgs/UAESVG';
import { useCreateSupportRequestMutation } from '../../../network/profile/profile.api';
import CustomLoader from '../../../common/components/CustomLoader';
import SuccessSVG from '../../../assets/svgs/SuccessSVG';
import FailureSVG from '../../../assets/svgs/FailureSVG';

const Support = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>('');
  const [tempTopic, setTempTopic] = useState<string | undefined>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [description, setDescription] = useState('');
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const [createSupportRequest, { isLoading: isSubmitting }] = useCreateSupportRequestMutation();

  const isFormValid = phoneNumber.length > 0 && !!selectedTopic && description.length > 0;

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
      
      // Success feedback
      setSelectedTopic('');
      setPhoneNumber('');
      setDescription('');
      
      // Navigate to GenericInfoScreen on success
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
      // Navigate to GenericInfoScreen on failure
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader
        title={t('profile.items.support.title')}
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? ms(100) : 0}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.content, { flexGrow: 1, paddingBottom: Math.max(insets.bottom, Spacing.xl) }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
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

          {/* <View style={{ height: Spacing.xl }} /> */}

          <CustomText
            type={TextType.ScreenDisplaySmall}
            style={{ fontWeight: Typography.headlineMedium.fontWeight }}
          >
            {t('support.supportDescription')}
          </CustomText>

          {/* <View style={{ height: Spacing.xl }} /> */}

          <View>
            <CustomTextInput
              label={t('support.contactNumber')}
              keyboardType="number-pad"
              value={phoneNumber}
              maxLength={9}
              onChangeText={setPhoneNumber}
              readOnly={isSubmitting}
              editable={!isSubmitting}
              inputStyle={styles.inputContainer}
              inputContainerStyle={[styles.inputContainerStyle, { borderColor: colors.outline }]}
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
              placeholder={t('common.select')}
              selectedValue={
                selectedTopic ? t(`support.topics.${selectedTopic}`) : undefined
              }
              disabled={isSubmitting}
              onPress={() => {
                // Keyboard.dismiss();
                setTempTopic(selectedTopic);
                setIsBottomSheetVisible(true);
              }}
              containerStyle={styles.dropdown}
              innerContainerStyle={[styles.innerContainer, { borderColor: colors.outline }]}
            />
            <CustomTextInput
              label={t('support.selectTopicDesc')}
              multiline={true}
              value={description}
              onChangeText={setDescription}
              readOnly={isSubmitting}
              editable={!isSubmitting}
              inputStyle={styles.inputContainer}
              inputContainerStyle={{
                borderColor: colors.outline,
                padding: ms(8),
                height: ms(120),
                backgroundColor: colors.surface,
              }}
            />
            
            <View style={{ marginTop: Spacing.xl }}>
               <CustomButton
                  title={t('support.contactMe')}
                  onPress={handleContactMe}
                  disabled={!isFormValid}
                  loading={isSubmitting}
                  uppercase={false}
               />
            </View>
          </View>
        </ScrollView>
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
                  borderColor: tempTopic === topic ? colors.primary : '#E0E0E0',
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: ms(36),
    paddingTop: Spacing.xl,
    gap: Spacing.xl,
  },
  headerContainer: {
    gap: Spacing.l,
  },
  inputContainer: {
    paddingLeft: Spacing.s,
    fontWeight : 500
  },
  rightButton: {
    padding: ms(6),
    marginRight: -ms(6),
  },
  dropdown: {
    marginBottom: ms(24),
  },
  innerContainer: {
  },
  card: {
    backgroundColor: '#FFFFFF',
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
  inputContainerStyle: {
  },
});

export default Support;