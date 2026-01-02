import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CardListScreen from '../modules/CardList/Screens/CardListScreen';
import BottomTabNavigator from './BottomTabNavigator';
import ReplaceCardScreen from '../modules/CardManagement/Screens/ReplaceCardScreen.tsx';
import ManageCardScreen from '../modules/CardManagement/Screens/ManageCardScreen.tsx';
import ChangeCompany from '../modules/Profile/Screens/ChangeCompany.tsx';
import ContactDetails from '../modules/Profile/Screens/ContactDetails.tsx';
import Addresses from '../modules/Profile/Screens/Addresses.tsx';
import PersonalDetails from '../modules/Profile/Screens/PersonalDetails.tsx';
import PersonalDocuments from '../modules/Profile/Screens/PersonalDocuments.tsx';
import Support from '../modules/Profile/Screens/Support.tsx';

const Stack = createStackNavigator();

const MainStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="BottomTabs" component={BottomTabNavigator} />
            <Stack.Screen name="ReplaceCard" component={ReplaceCardScreen} />
            <Stack.Screen name="ManageCard" component={ManageCardScreen} />
            <Stack.Screen name="CardList" component={CardListScreen} />
            <Stack.Screen name="ChangeCompany" component={ChangeCompany} />
            <Stack.Screen name="ContactDetails" component={ContactDetails} />
            <Stack.Screen name="PersonalDetails" component={PersonalDetails} />
            <Stack.Screen name="Addresses" component={Addresses} />
            <Stack.Screen name="PersonalDocuments" component={PersonalDocuments} />
            <Stack.Screen name="Support" component={Support} />
        </Stack.Navigator>
    );
};

export default MainStack;
