import React from 'react';
import { useNavigation } from '@react-navigation/native';
import DetailsScreen, { DetailsSection } from '../../../common/components/DetailsScreen';

export default function PersonalDetails() {
    const navigation = useNavigation();

    const sections: DetailsSection[] = [
        {
            items: [
                {
                    id: "1",
                    label: "Title",
                    value: "",
                },
                {
                    id: "2",
                    label: "First name",
                    value: "Sharmil",
                },
                {
                    id: "3",
                    label: "Middle name",
                    value: "",
                },
                {
                    id: "4",
                    label: "Last name",
                    value: "panayan",
                },
                {
                    id: "5",
                    label: "Citizenship",
                    value: "",
                },
                {
                    id: "6",
                    label: "Date of birth",
                    value: "04/12/1978",
                },
                {
                    id: "7",
                    label: "Place of birth",
                    value: "Saudi arabia",
                },
            ]
        }
    ];

    return (
        <DetailsScreen
            title="Personal Details"
            sections={sections}
            onBackPress={() => navigation.goBack()}
        />
    );
}