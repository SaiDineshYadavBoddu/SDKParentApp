import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGetPostsQuery } from '../../../network/user/user.api';

const HomeScreen = () => {
    const { data } = useGetPostsQuery();
    console.log("data",data);
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Welcome to Home Screen!</Text>
        
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
    },
});

export default HomeScreen;
