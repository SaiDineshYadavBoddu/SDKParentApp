import React from 'react';
import { useNavigation } from '@react-navigation/native';
import DetailsScreen, {
  DetailsSection,
} from '../../../common/components/DetailsScreen';
import { useTranslation } from 'react-i18next';

import { useGetUserDetailsQuery } from '../../../network/profile/profile.api';

export default function ContactDetails() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { data: userDetails } = useGetUserDetailsQuery();
  const contact = userDetails?.contactDetails;

  const sections: DetailsSection[] = [
    {
      items: [
        {
          id: '1',
          label: t('profile.details.contact.fields.customerId'),
          value: userDetails?.customerId || '-',
        },
        {
          id: '2',
          label: t('profile.details.contact.fields.userId'),
          value: userDetails?.cardName || '-',
        },
        {
          id: '3',
          label: t('profile.details.contact.fields.email'),
          value: contact?.email || '-',
        },
        {
          id: '4',
          label: t('profile.details.contact.fields.mobile'),
          value: contact?.mobilePhone || '-',
        },
        {
          id: '5',
          label: t('profile.details.contact.fields.work'),
          value: contact?.workPhone || '-',
        },
      ],
    },
  ];

  return (
    <DetailsScreen
      title={t('profile.details.contact.title')}
      sections={sections}
      onBackPress={() => navigation.goBack()}
    />
  );
}
