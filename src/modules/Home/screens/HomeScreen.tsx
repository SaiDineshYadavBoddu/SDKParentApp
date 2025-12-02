import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGetPostsQuery } from '../../../network/user/user.api';
import { useAuth } from '../../../context/AuthContext';

const HomeScreen = () => {
    const { data } = useGetPostsQuery();
    console.log("data", data);
    const { signOut } = useAuth();

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to Home Screen!</Text>
            <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
                <Text style={styles.logoutButtonText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    logoutButton: {
        backgroundColor: '#FF3B30',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    logoutButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
