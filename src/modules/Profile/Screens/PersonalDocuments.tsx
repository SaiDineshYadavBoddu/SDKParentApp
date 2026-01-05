import React from 'react';
import { useNavigation } from '@react-navigation/native';
import DetailsScreen, {
  DetailsSection,
} from '../../../common/components/DetailsScreen';

export default function PersonalDocuments() {
  const navigation = useNavigation();

  const sections: DetailsSection[] = [
    {
      items: [
        {
          id: '1',
          label: 'Document',
          value: 'Passport',
        },
        {
          id: '2',
          label: 'Passport number',
          value: '934343249482432',
        },
        {
          id: '3',
          label: 'Expiry date',
          value: '04/12/2025',
        },
      ],
    },
  ];

  return (
    <DetailsScreen
      title="Personal Documents"
      sections={sections}
      onBackPress={() => navigation.goBack()}
    />
  );
}
