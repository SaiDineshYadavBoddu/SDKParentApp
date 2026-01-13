import React from 'react';
import { useNavigation } from '@react-navigation/native';
import DetailsScreen, {
  DetailsSection,
} from '../../../common/components/DetailsScreen';
import { useTranslation } from 'react-i18next';
import { useGetUserDetailsQuery } from '../../../network/profile/profile.api';
import { formatToMMDDYYYY } from '../../../utils/dateUtils';

export default function PersonalDetails() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { data: userDetails } = useGetUserDetailsQuery();
  const personal = userDetails?.personalDetails;

  const sections: DetailsSection[] = [
    {
      items: [
        {
          id: '1',
          label: t('profile.details.personal.fields.salutation'),
          value: '-',
        },
        {
          id: '2',
          label: t('profile.details.personal.fields.firstName'),
          value: personal?.firstName || '-',
        },
        {
          id: '3',
          label: t('profile.details.personal.fields.middleName'),
          value: '-',
        },
        {
          id: '4',
          label: t('profile.details.personal.fields.lastName'),
          value: personal?.lastName || '-',
        },
        {
          id: '5',
          label: t('profile.details.personal.fields.citizenship'),
          value: personal?.citizenship || '-',
        },
        {
          id: '6',
          label: t('profile.details.personal.fields.dob'),
          value: formatToMMDDYYYY(personal?.dateOfBirth),
        },
        {
          id: '7',
          label: t('profile.details.personal.fields.pob'),
          value: personal?.placeOfBirth || '-',
        },
      ],
    },
  ];

  return (
    <DetailsScreen
      title={t('profile.details.personal.title')}
      sections={sections}
      onBackPress={() => navigation.goBack()}
    />
  );
}
