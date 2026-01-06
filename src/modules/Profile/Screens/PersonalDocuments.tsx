import React from 'react';
import { useNavigation } from '@react-navigation/native';
import DetailsScreen, {
  DetailsSection,
} from '../../../common/components/DetailsScreen';
import { useTranslation } from 'react-i18next';

export default function PersonalDocuments() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const sections: DetailsSection[] = [
    {
      items: [
        {
          id: '1',
          label: t('profile.details.documents.fields.document'),
          value: 'Passport',
        },
        {
          id: '2',
          label: t('profile.details.documents.fields.passportNumber'),
          value: '934343249482432',
        },
        {
          id: '3',
          label: t('profile.details.documents.fields.expiryDate'),
          value: '04/12/2025',
        },
      ],
    },
  ];

  return (
    <DetailsScreen
      title={t('profile.details.documents.title')}
      sections={sections}
      onBackPress={() => navigation.goBack()}
    />
  );
}
