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

const Support = () => {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const { t } = useTranslation();
  const [selectedTopic, setSelectedTopic] = useState<string | undefined>('');
  const [tempTopic, setTempTopic] = useState<string | undefined>('');
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const handleConfirm = () => {
    setSelectedTopic(tempTopic);
    setIsBottomSheetVisible(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader
        title="Support"
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
          contentContainerStyle={[styles.content, { flexGrow: 1 }]}
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
              style={{ color: '#4A4A4A' }}
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
              inputStyle={styles.inputContainer}
              inputContainerStyle={styles.inputContainerStyle}
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
              onPress={() => {
                setTempTopic(selectedTopic);
                setIsBottomSheetVisible(true);
              }}
              containerStyle={styles.dropdown}
              innerContainerStyle={styles.innerContainer}
            />
            <CustomTextInput
              label={t('support.selectTopicDesc')}
              multiline={true}
              inputContainerStyle={{
                borderColor: '#E0E0E0',
                padding: ms(8),
                height: ms(120),
              }}
            />
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
    backgroundColor: '#fff',
  },
  content: {
    paddingHorizontal: ms(36),
    paddingVertical: Spacing.xl,
    gap: Spacing.xl,
  },
  headerContainer: {
    gap: Spacing.l,
  },
  inputContainer: {
    paddingLeft: Spacing.s,
  },
  rightButton: {
    padding: ms(6),
    marginRight: -ms(6),
  },
  dropdown: {
    marginBottom: ms(24),
  },
  innerContainer: {
    borderColor: '#E0E0E0',
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
    borderColor: '#E0E0E0',
  },
});

export default Support;
