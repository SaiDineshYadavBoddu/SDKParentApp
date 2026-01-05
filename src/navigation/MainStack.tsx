import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CardListScreen from '../modules/CardList/Screens/CardListScreen';
import BottomTabNavigator from './BottomTabNavigator';
import ReplaceCardScreen from '../modules/CardManagement/Screens/ReplaceCardScreen.tsx';
import ManageCardScreen from '../modules/CardManagement/Screens/ManageCardScreen.tsx';
import CloseCardScreen from '../modules/CardManagement/Screens/CloseCardScreen.tsx';
import CardUsageScreen from '../modules/CardManagement/Screens/CardUsageScreen';
import TransactionLimitsScreen from '../modules/CardManagement/Screens/TransactionLimitsScreen';
import FreezeCardScreen from '../modules/CardManagement/Screens/FreezeCardScreen';

const Stack = createStackNavigator();

const MainStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="BottomTabs" component={BottomTabNavigator} />
            <Stack.Screen name="ReplaceCard" component={ReplaceCardScreen} />
            <Stack.Screen name="ManageCard" component={ManageCardScreen} />
            <Stack.Screen name="CloseCard" component={CloseCardScreen} />
            <Stack.Screen name="CardUsage" component={CardUsageScreen} />
            <Stack.Screen name="TransactionLimits" component={TransactionLimitsScreen} />
            <Stack.Screen name="FreezeCard" component={FreezeCardScreen} />
            <Stack.Screen name="CardList" component={CardListScreen} />
        </Stack.Navigator>
    );
};

export default MainStack;
