import React from 'react';
import { useNavigation } from '@react-navigation/native';
import DetailsScreen, {
  DetailsSection,
} from '../../../common/components/DetailsScreen';

export default function ContactDetails() {
  const navigation = useNavigation();

  const sections: DetailsSection[] = [
    {
      items: [
        {
          id: '1',
          label: 'Customer ID',
          value: '1733666680969004',
        },
        {
          id: '2',
          label: 'User ID',
          value: 'sharmil200',
          actionLabel: 'Change',
          onActionPress: () => console.log('Change User ID'),
        },
        {
          id: '3',
          label: 'Email',
          value: 'sharmil200@yopmail.com',
        },
        {
          id: '4',
          label: 'Mobile phone number',
          value: '0567334000',
        },
        {
          id: '5',
          label: 'Work phone number',
          value: '026444000',
        },
      ],
    },
  ];

  return (
    <DetailsScreen
      title="Contact Details"
      sections={sections}
      onBackPress={() => navigation.goBack()}
    />
  );
}
