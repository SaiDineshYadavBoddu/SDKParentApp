import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CardListScreen from '../modules/CardList/Screens/CardListScreen';
import ReplaceCardScreen from '../modules/CardManagement/Screens/ReplaceCardScreen.tsx';

const Stack = createStackNavigator();

const MainStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CardList" component={CardListScreen} />
            <Stack.Screen name="ReplaceCard" component={ReplaceCardScreen} />
        </Stack.Navigator>
    );
};

export default MainStack;
