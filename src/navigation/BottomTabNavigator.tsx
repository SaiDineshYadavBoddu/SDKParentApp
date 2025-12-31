import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

// Vector Icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarShowLabel: true,
                tabBarActiveTintColor: '#0056D2', // Primary Blue inferred
                tabBarInactiveTintColor: '#666',
                tabBarStyle: [styles.tabBar, { height: 60 + insets.bottom, paddingBottom: insets.bottom + 5 }],
                tabBarLabelStyle: styles.tabBarLabel,
                tabBarIcon: ({ focused, color, size }) => {
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
            <Tab.Screen name="Transactions" component={TransactionsScreen} />
            <Tab.Screen name="My Profile" component={ProfileScreen} />
            <Tab.Screen name="Requests" component={RequestsScreen} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tabBarLabel: {
        fontSize: 12,
        fontWeight: '500',
        marginBottom: 5,
    },
});

export default BottomTabNavigator;
