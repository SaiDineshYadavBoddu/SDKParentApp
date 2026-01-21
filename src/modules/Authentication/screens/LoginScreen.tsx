import React, { useState, useRef, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Animated,
} from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../theme/ThemeProvider';
import CustomText, { TextType } from '../../../common/components/CustomText';
import { moderateScale } from 'react-native-size-matters';
import { getSlideIndex } from '../../../utils/scrollUtils';
import { LOGIN_ONBOARDING_DATA } from '../../../constants/appConstants';
const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setInterval(() => {
      if (LOGIN_ONBOARDING_DATA.length > 0) {
        const nextIndex = (currentIndex + 1) % LOGIN_ONBOARDING_DATA.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const styles = useMemo(() => createStyles(colors), [colors]);

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    {
      useNativeDriver: false, // width/backgroundColor don't support native driver
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const slideIndex = getSlideIndex(event.nativeEvent.contentOffset.x, width);
        if (slideIndex !== currentIndex) {
          setCurrentIndex(slideIndex);
        }
      },
    }
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: (typeof LOGIN_ONBOARDING_DATA)[0];
    index: number;
  }) => {
    const inputRange = [
      (index - 1) * width,
      index * width,
      (index + 1) * width,
    ];

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.4, 1, 0.4],
      extrapolate: 'clamp',
    });

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.slide, { opacity, transform: [{ scale }] }]}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <View style={styles.textContainer}>
          <CustomText type={TextType.ScreenHeadlineMedium}>
            {t(item.title)}
          </CustomText>
          <CustomText type={TextType.ScreenDisplayMedium}>
            {t(item.description)}
          </CustomText>
        </View>
      </Animated.View>
    );
  };

  const handleLogin = async () => {
    console.log('Login pressed');
    await signIn();
  };

  return (
    <View style={styles.container}>
      <View style={styles.sliderContainer}>
        <FlatList
          ref={flatListRef}
          data={LOGIN_ONBOARDING_DATA}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
        />
        <View style={styles.pagination}>
          {LOGIN_ONBOARDING_DATA.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 20, 8],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  { width: dotWidth, opacity, backgroundColor: colors.primary },
                ]}
              />
            );
          })}
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>{t('login.loginButton')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = (colors: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.backgroundVariant,
    },
    sliderContainer: {
      flex: 3,
      justifyContent: 'center',
      alignItems: 'center',
    },
    slide: {
      width: width,
      paddingHorizontal: 20,
      paddingVertical: height * 0.1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    image: {
      width: width * 0.8,
      height: height * 0.4,
      marginBottom: 20,
    },
    textContainer: {
      alignItems: 'center',
      gap: moderateScale(10),
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.onBackgroundVariant,
      textAlign: 'left',
    },
    description: {
      fontSize: 16,
      color: colors.onBackgroundVariant,
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
      backgroundColor: colors.primary,
      width: 20,
    },
    inactiveDot: {
      backgroundColor: colors.primary,
      opacity: 0.3,
    },
    bottomContainer: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    loginButton: {
      backgroundColor: colors.primary,
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
      color: colors.onPrimary,
      fontSize: 18,
      fontWeight: 'bold',
    },
  });

export default LoginScreen;
