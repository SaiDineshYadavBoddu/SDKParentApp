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
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <View style={styles.textContainer}>
          <CustomText type={TextType.ScreenHeadlineLarge} style={styles.title}>
            {t(item.title)}
          </CustomText>
          <CustomText type={TextType.ScreenDisplayMedium} style={styles.description}>
            {t(item.description)}
          </CustomText>
        </View>
      </View>
    );
  };

  const handleLogin = async () => {
    await signIn();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../../assets/images/Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

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
          <CustomText type={TextType.Button}>{t('login.loginButton')}</CustomText>
        </TouchableOpacity>

        <CustomText type={TextType.ScreenDisplaySmall} style={styles.footerText}>
          {t('login.footerText')}
        </CustomText>
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
    header: {
      paddingHorizontal: moderateScale(24),
      paddingTop: moderateScale(60),
      backgroundColor: colors.backgroundVariant,
    },
    logo: {
      width: moderateScale(120),
      height: moderateScale(40),
      alignSelf: 'flex-start',
    },
    sliderContainer: {
      marginTop: moderateScale(10),
    },
    slide: {
      width: width,
      paddingHorizontal: moderateScale(24),
    },
    image: {
      width: width * 0.9,
      height: height * 0.38,
      alignSelf: 'center',
    },
    textContainer: {
      alignItems: 'flex-start',
      marginTop: moderateScale(20),
    },
    title: {
      fontSize: moderateScale(36),
      lineHeight: moderateScale(40),
      fontWeight: '700',
      marginBottom: moderateScale(4),
      color: colors.onBackground,
    },
    description: {
      color: colors.secondaryText,
      fontSize: moderateScale(16),
      lineHeight: moderateScale(22),
    },
    pagination: {
      flexDirection: 'row',
      paddingHorizontal: moderateScale(24),
      marginTop: moderateScale(15),
    },
    dot: {
      height: 8,
      borderRadius: 4,
      marginRight: 8,
    },
    bottomContainer: {
      paddingHorizontal: moderateScale(24),
      marginTop: moderateScale(30),
    },
    loginButton: {
      backgroundColor: colors.primary,
      paddingVertical: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginBottom: moderateScale(16),
    },
    footerText: {
      color: colors.secondaryText,
      textAlign: 'left',
      lineHeight: moderateScale(16),
      fontSize: moderateScale(12),
    },
  });

export default LoginScreen;
