import React from 'react';
import { useNavigation } from '@react-navigation/native';
import DetailsScreen, {
  DetailsSection,
} from '../../../common/components/DetailsScreen';
import { useTranslation } from 'react-i18next';

import { useGetUserDetailsQuery } from '../../../network/profile/profile.api';

export default function Addresses() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { data: userDetails } = useGetUserDetailsQuery();
  // Address is missing in the sample JSON provided, so we keep them empty for now
  // or until the API response includes an address object.

  const sections: DetailsSection[] = [
    {
      items: [
        {
          id: '1',
          label: t('profile.details.addresses.fields.type'),
          value: '-',
        },
        {
          id: '2',
          label: t('profile.details.addresses.fields.line'),
          value: '-',
        },
        {
          id: '3',
          label: t('profile.details.addresses.fields.zip'),
          value: '-',
        },
        {
          id: '4',
          label: t('profile.details.addresses.fields.city'),
          value: '-',
        },
        {
          id: '5',
          label: t('profile.details.addresses.fields.country'),
          value: '-',
        },
        {
          id: '6',
          label: t('profile.details.addresses.fields.state'),
          value: '-',
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
