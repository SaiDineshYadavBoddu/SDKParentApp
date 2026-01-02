import React from 'react';
import { useNavigation } from '@react-navigation/native';
import DetailsScreen, { DetailsSection } from '../../../common/components/DetailsScreen';

export default function Addresses() {
    const navigation = useNavigation();

    const sections: DetailsSection[] = [
        {
            items: [
                {
                    id: "1",
                    label: "Address type",
                    value: "Home",
                },
                {
                    id: "2",
                    label: "Address line",
                    value: "",
                },
                {
                    id: "3",
                    label: "Zip code",
                    value: "661235",
                },
                {
                    id: "4",
                    label: "City",
                    value: "Saudi arabia",
                },
                {
                    id: "5",
                    label: "Country",
                    value: "Saudi arabia",
                },
                {
                    id: "6",
                    label: "State",
                    value: "Saudi arabia",
                },
            ]
        }
    ];

    return (
        <DetailsScreen
            title="Addresses"
            sections={sections}
            onBackPress={() => navigation.goBack()}
        />
    );
}