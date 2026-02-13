import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../theme/ThemeProvider';
import { View, StyleSheet, Text } from 'react-native';

// Screens
import CardListScreen from '../modules/CardList/Screens/CardListScreen';
import RequestsScreen from '../modules/Requests/Screens/RequestsScreen';
import TransactionsScreen from '../modules/Transactions/Screens/TransactionsScreen';
import ProfileScreen from '../modules/Profile/Screens/ProfileScreen';

// SVGs
import MyCardsSVG from '../assets/svgs/MyCardsSVG';
import RequestsSVG from '../assets/svgs/RequestsSVG';
import TransactionsSVG from '../assets/svgs/TransactionsSVG';
import MyProfileSVG from '../assets/svgs/MyProfileSVG';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#666',
        tabBarStyle: styles.tabBar,
        tabBarLabel: ({ color }) => (
          <Text
            allowFontScaling={false}
            style={[styles.tabBarLabel, { color }]}
          >
            {route.name}
          </Text>
        ),

        tabBarIcon: ({ color }) => {
          if (route.name === 'My Cards') {
            return <MyCardsSVG width={24} height={24} color={color} />;
          } else if (route.name === 'Requests') {
            return <RequestsSVG width={24} height={24} color={color} />;
          } else if (route.name === 'Transactions') {
            return <TransactionsSVG width={24} height={24} color={color} />;
          } else if (route.name === 'My Profile') {
            return <MyProfileSVG width={24} height={24} color={color} />;
          }
          return <View />;
        },
      })}
    >
      <Tab.Screen name="My Cards" component={CardListScreen} />

      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        // listeners={{
        //   tabPress: e => {
        //     e.preventDefault();
        //   },
        // }}
      />

      <Tab.Screen name="Requests" component={RequestsScreen} />
      <Tab.Screen name="My Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    shadowRadius: 4,
    height: 60,
    paddingBottom: 5,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 5,
  },
});

export default BottomTabNavigator;
