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
import ContactUs from '../modules/Profile/Screens/ContactUs.tsx';
import CloseCardScreen from '../modules/CardManagement/Screens/CloseCardScreen.tsx';
import CardUsageScreen from '../modules/CardManagement/Screens/CardUsageScreen';
import TransactionLimitsScreen from '../modules/CardManagement/Screens/TransactionLimitsScreen';
import FreezeCardScreen from '../modules/CardManagement/Screens/FreezeCardScreen';
import GenericSelectionScreen from '../common/components/GenericSelectionScreen.tsx';
import GenericOTPScreen from '../common/components/GenericOTPScreen.tsx';
import GenericInfoScreen from '../common/components/GenericInfoScreen.tsx';
import SetCardPin from '../modules/CardManagement/Screens/SetCardPin.tsx';
import NotificationsScreen from '../modules/Notifications/Screens/NotificationsScreen.tsx';
import StatementScreen from '../modules/Statements/Screens/StatementScreen.tsx';

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
      <Stack.Screen name="ChangeCompany" component={ChangeCompany} />
      <Stack.Screen name="ContactDetails" component={ContactDetails} />
      <Stack.Screen name="PersonalDetails" component={PersonalDetails} />
      <Stack.Screen name="Addresses" component={Addresses} />
      <Stack.Screen name="PersonalDocuments" component={PersonalDocuments} />
      <Stack.Screen name="Support" component={Support} />
      <Stack.Screen name="ContactUs" component={ContactUs} />
      <Stack.Screen name="GenericSelectionScreen" component={GenericSelectionScreen} />
      <Stack.Screen name="GenericOTPScreen" component={GenericOTPScreen} />
      <Stack.Screen name="GenericInfoScreen" component={GenericInfoScreen} />
      <Stack.Screen name="SetCardPin" component={SetCardPin} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Statement" component={StatementScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;
