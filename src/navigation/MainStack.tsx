import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CardListScreen from '../modules/CardLIst/CardListScreen';

const Stack = createStackNavigator();

const MainStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CardList" component={CardListScreen} />
        </Stack.Navigator>
    );
};

export default MainStack;
