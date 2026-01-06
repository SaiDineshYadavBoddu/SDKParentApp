import React from 'react';
import { useNavigation } from '@react-navigation/native';
import DetailsScreen, {
  DetailsSection,
} from '../../../common/components/DetailsScreen';
import { useTranslation } from 'react-i18next';

export default function Addresses() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const sections: DetailsSection[] = [
    {
      items: [
        {
          id: '1',
          label: t('profile.details.addresses.fields.type'),
          value: 'Home',
        },
        {
          id: '2',
          label: t('profile.details.addresses.fields.line'),
          value: '',
        },
        {
          id: '3',
          label: t('profile.details.addresses.fields.zip'),
          value: '661235',
        },
        {
          id: '4',
          label: t('profile.details.addresses.fields.city'),
          value: 'Saudi arabia',
        },
        {
          id: '5',
          label: t('profile.details.addresses.fields.country'),
          value: 'Saudi arabia',
        },
        {
          id: '6',
          label: t('profile.details.addresses.fields.state'),
          value: 'Saudi arabia',
        },
      ],
    },
  ];

  return (
    <DetailsScreen
      title={t('profile.details.addresses.title')}
      sections={sections}
      onBackPress={() => navigation.goBack()}
    />
  );
}
