import React from 'react';
import { useNavigation } from '@react-navigation/native';
import DetailsScreen, {
  DetailsSection,
} from '../../../common/components/DetailsScreen';
import { useTranslation } from 'react-i18next';
import { useGetUserDetailsQuery } from '../../../network/profile/profile.api';
import { formatToMMDDYYYY } from '../../../utils/dateUtils';

export default function PersonalDocuments() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { data: userDetails } = useGetUserDetailsQuery();
  const document = userDetails?.identityProofDocument?.[0];

  const sections: DetailsSection[] = [
    {
      items: [
        {
          id: '1',
          label: t('profile.details.documents.fields.document'),
          value: document?.type || '-',
        },
        {
          id: '2',
          label: t('profile.details.documents.fields.passportNumber'),
          value: document?.number || '-',
        },
        {
          id: '3',
          label: t('profile.details.documents.fields.expiryDate'),
          value: formatToMMDDYYYY(document?.expiryDate),
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
