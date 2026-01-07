import React from 'react';
import { useNavigation } from '@react-navigation/native';
import DetailsScreen, {
  DetailsSection,
} from '../../../common/components/DetailsScreen';
import { useTranslation } from 'react-i18next';

export default function PersonalDetails() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const sections: DetailsSection[] = [
    {
      items: [
        {
          id: '1',
          label: t('profile.details.personal.fields.salutation'),
          value: '',
        },
        {
          id: '2',
          label: t('profile.details.personal.fields.firstName'),
          value: 'Sharmil',
        },
        {
          id: '3',
          label: t('profile.details.personal.fields.middleName'),
          value: '',
        },
        {
          id: '4',
          label: t('profile.details.personal.fields.lastName'),
          value: 'panayan',
        },
        {
          id: '5',
          label: t('profile.details.personal.fields.citizenship'),
          value: '',
        },
        {
          id: '6',
          label: t('profile.details.personal.fields.dob'),
          value: '04/12/1978',
        },
        {
          id: '7',
          label: t('profile.details.personal.fields.pob'),
          value: 'Saudi arabia',
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
