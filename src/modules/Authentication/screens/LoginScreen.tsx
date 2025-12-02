import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    FlatList,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    NativeSyntheticEvent,
    NativeScrollEvent,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const ONBOARDING_DATA = [
    {
        id: '1',
        image: require('../../../assets/png/onboarding1.png'),
        title: 'Accept Payments',
        description: 'Tap or link, seemless payments',
    },
    {
        id: '2',
        image: require('../../../assets/png/onboarding2.png'),
        title: 'Track Every Transaction',
        description: 'Clear, fast and reliable tracking',
    },
    {
        id: '3',
        image: require('../../../assets/png/onboarding3.png'),
        title: 'Instant Settlements',
        description: 'Withdraw funnds anytime, instantly',
    },
];

import { useAuth } from '../../../context/AuthContext';

const LoginScreen = () => {
    const { signIn } = useAuth();
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const slideIndex = Math.ceil(event.nativeEvent.contentOffset.x / width);
        if (slideIndex !== currentIndex) {
            setCurrentIndex(slideIndex);
        }
    };

    const renderItem = ({ item }: { item: typeof ONBOARDING_DATA[0] }) => {
        return (
            <View style={styles.slide}>
                <Image source={item.image} style={styles.image} resizeMode="contain" />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                </View>
            </View>
        );
    };

    const handleLogin = async () => {
        console.log('Login pressed');
        await signIn();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.sliderContainer}>
                <FlatList
                    ref={flatListRef}
                    data={ONBOARDING_DATA}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={onScroll}
                    scrollEventThrottle={16}
                />
                <View style={styles.pagination}>
                    {ONBOARDING_DATA.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                currentIndex === index ? styles.activeDot : styles.inactiveDot,
                            ]}
                        />
                    ))}
                </View>
            </View>

            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C8E4F7',
    },
    sliderContainer: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slide: {
        width: width,
        paddingHorizontal: 20,
        paddingVertical: height * 0.10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: width * 0.8,
        height: height * 0.4,
        marginBottom: 20,
    },
    textContainer: {
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'left',
    },
    description: {
        fontSize: 16,
        color: '#666',
        textAlign: 'left',
    },
    pagination: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: 20,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#007AFF', // Primary color
        width: 20,
    },
    inactiveDot: {
        backgroundColor: '#ccc',
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    loginButton: {
        backgroundColor: '#007AFF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default LoginScreen;
