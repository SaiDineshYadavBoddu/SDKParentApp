import React, { useState, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ms } from 'react-native-size-matters';

import { useGetUserDetailsQuery } from '../../../network/profile/profile.api';
import DetailsScreen, { DetailsSection } from '../../../common/components/DetailsScreen';
import CustomHeader from '../../../common/components/CustomHeader';
import CustomText, { TextType } from '../../../common/components/CustomText';
import CustomBottomSheet from '../../../common/components/CustomBottomSheet';
import CustomRadioButton from '../../../common/components/CustomRadioButton';
import CustomButton from '../../../common/components/CustomButton';
import ChevronDownSVG from '../../../assets/svgs/CheveronDownSVG';
import { useTheme } from '../../../theme/ThemeProvider';
import { Spacing } from '../../../theme/spacing';
import { Typography } from '../../../theme/typography';

type AddressType = 'PERMANENT' | 'PRESENT';

export default function Addresses() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { colors } = useTheme();
  // @ts-ignore
  const { data: userDetails } = useGetUserDetailsQuery();

  const [selectedAddressType, setSelectedAddressType] = useState<AddressType>('PERMANENT');
  const [tempAddressType, setTempAddressType] = useState<AddressType>('PERMANENT');
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const styles = useMemo(() => createStyles(colors), [colors]);

  const currentAddress = useMemo(() => {
    return userDetails?.addresses?.find(
      (addr: any) => addr.addressType === selectedAddressType,
    );
  }, [userDetails, selectedAddressType]);

  const sections: DetailsSection[] = [
    {
      items: [
        {
          id: '0',
          label: 'profile.details.addresses.fields.type', // "Address Type"
          value: null,
          rightContent: (
            <TouchableOpacity 
              onPress={() => {
                setTempAddressType(selectedAddressType);
                setIsBottomSheetVisible(true);
              }}
              style={styles.actionContainer}
            >
              <CustomText
                type={TextType.ActionLabel}
                style={{ color: colors.primary, fontWeight: '500', marginRight: ms(4) }}
              >
                {selectedAddressType === 'PERMANENT' ? 'Permanent' : 'Present'}
              </CustomText>
              <ChevronDownSVG 
                 width={ms(20)} 
                 height={ms(20)} 
                 stroke={colors.primary} 
              />
            </TouchableOpacity>
          )
        },
        {
          id: '1',
          label: 'profile.details.addresses.fields.line',
          value: [currentAddress?.addressLine1, currentAddress?.addressLine2].filter(Boolean).join(', ') || '-',
        },
        {
          id: '2',
          label: 'profile.details.addresses.fields.zip',
          value: currentAddress?.zip ?? '-',
        },
        {
          id: '3',
          label: 'profile.details.addresses.fields.city',
          value: currentAddress?.city ?? '-',
        },
        {
          id: '4',
          label: 'profile.details.addresses.fields.country',
          value: currentAddress?.country ?? '-',
        },
        {
          id: '5',
          label: 'profile.details.addresses.fields.state',
          value: currentAddress?.state ?? '-',
        },
      ],
    },
  ];

  const handleConfirm = () => {
    setSelectedAddressType(tempAddressType);
    setIsBottomSheetVisible(false);
  };

  return (
    <>
      <DetailsScreen
        title={t('profile.details.addresses.title')}
        sections={sections}
        onBackPress={() => navigation.goBack()}
      />

      <CustomBottomSheet
        visible={isBottomSheetVisible}
        onClose={() => setIsBottomSheetVisible(false)}
        title={t('profile.details.addresses.fields.type')}
      >
        <View style={styles.bottomSheetContent}>
          {['PERMANENT', 'PRESENT'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.optionCard,
                {
                  borderColor: tempAddressType === type ? colors.primary : colors.outline,
                  borderWidth: tempAddressType === type ? ms(1) : ms(0.5),
                },
              ]}
              activeOpacity={0.8}
              onPress={() => setTempAddressType(type as AddressType)}
            >
              <CustomRadioButton
                label={type === 'PERMANENT' ? 'Permanent' : 'Present'}
                selected={tempAddressType === type}
                onPress={() => setTempAddressType(type as AddressType)}
                containerStyle={styles.radioButton}
                labelStyle={styles.radioLabel}
              />
            </TouchableOpacity>
          ))}

          <CustomButton
            title={t('common.confirm')}
            onPress={handleConfirm}
            style={styles.confirmButton}
            uppercase={false}
          />
        </View>
      </CustomBottomSheet>
    </>
  );
}

const createStyles = (colors: any) =>
  StyleSheet.create({
    actionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomSheetContent: {
      width: '100%',
      gap: Spacing.xl,
    },
    optionCard: {
      backgroundColor: colors.surface,
      borderRadius: ms(16),
      paddingVertical: ms(16),
      paddingHorizontal: ms(16),
      borderWidth: 1,
    },
    radioButton: {
      marginVertical: 0,
    },
    radioLabel: {
      fontSize: ms(16),
      fontWeight: '500',
      marginLeft: ms(12),
    },
    confirmButton: {
      width: '100%',
    },
  });
