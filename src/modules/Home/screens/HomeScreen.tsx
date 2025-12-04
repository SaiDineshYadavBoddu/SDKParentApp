import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGetPostsQuery } from '../../../network/user/user.api';
import { useAuth } from '../../../context/AuthContext';
import CustomText, { TextType } from '../../../common/components/CustomText';

const HomeScreen = () => {
    const { data } = useGetPostsQuery();
    console.log("data", data);
    const { signOut, changePassword } = useAuth();

    return (
        <View style={styles.container}>
            <CustomText type={TextType.ScreenLarge}>Welcome to Home Screen!</CustomText>

            <TouchableOpacity style={styles.button} onPress={changePassword}>
                <Text style={styles.buttonText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={signOut}>
                <Text style={styles.buttonText}>Logout</Text>
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
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginVertical: 10,
        minWidth: 200,
        alignItems: 'center',
    },
    logoutButton: {
        backgroundColor: '#FF3B30',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default HomeScreen;
