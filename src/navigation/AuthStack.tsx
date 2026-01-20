import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import GenericInfoScreen from '../common/components/GenericInfoScreen';
import LoginScreen from '../modules/Authentication/Screens/LoginScreen';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="GenericInfoScreen" component={GenericInfoScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
