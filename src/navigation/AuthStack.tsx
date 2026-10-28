import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import GenericInfoScreen from '../common/components/GenericInfoScreen';
import LoginScreen from '../modules/Authentication/Screens/LoginScreen';
import CredentialsLoginScreen from '../modules/Authentication/Screens/CredentialsLoginScreen';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CredentialsLogin" component={CredentialsLoginScreen} />
      <Stack.Screen name="AuthInfoScreen" component={GenericInfoScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
