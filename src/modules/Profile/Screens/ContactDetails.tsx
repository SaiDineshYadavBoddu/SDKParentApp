import React from 'react';
import { useNavigation } from '@react-navigation/native';
import DetailsScreen, {
  DetailsSection,
} from '../../../common/components/DetailsScreen';
import { useTranslation } from 'react-i18next';

export default function ContactDetails() {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const sections: DetailsSection[] = [
    {
      items: [
        {
          id: '1',
          label: t('profile.details.contact.fields.customerId'),
          value: '1733666680969004',
        },
        {
          id: '2',
          label: t('profile.details.contact.fields.userId'),
          value: 'sharmil200',
          actionLabel: t('profile.details.contact.fields.change'),
          onActionPress: () => console.log('Change User ID'),
        },
        {
          id: '3',
          label: t('profile.details.contact.fields.email'),
          value: 'sharmil200@yopmail.com',
        },
        {
          id: '4',
          label: t('profile.details.contact.fields.mobile'),
          value: '0567334000',
        },
        {
          id: '5',
          label: t('profile.details.contact.fields.work'),
          value: '026444000',
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
