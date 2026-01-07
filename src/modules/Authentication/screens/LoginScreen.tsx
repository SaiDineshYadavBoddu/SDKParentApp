import React, { useState, useRef, useMemo } from 'react';
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
} from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import { useTheme } from '../../../theme/ThemeProvider';
import CustomText, { TextType } from '../../../common/components/CustomText';
import { moderateScale } from 'react-native-size-matters';
import { getSlideIndex } from '../../../utils/scrollUtils';
import { LOGIN_ONBOARDING_DATA } from '../../../constants/appConstants';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
  const { t } = useTranslation();
  const { signIn } = useAuth();
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const styles = useMemo(() => createStyles(colors), [colors]);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = getSlideIndex(event.nativeEvent.contentOffset.x, width);
    if (slideIndex !== currentIndex) {
      setCurrentIndex(slideIndex);
    }
  };

  const renderItem = ({
    item,
  }: {
    item: (typeof LOGIN_ONBOARDING_DATA)[0];
  }) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <View style={styles.textContainer}>
          <CustomText type={TextType.ScreenHeadlineMedium}>
            {t(item.title)}
          </CustomText>
          <CustomText type={TextType.ScreenDisplayMedium}>
            {t(item.description)}
          </CustomText>
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
          {LOGIN_ONBOARDING_DATA.map((_, index) => (
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
          <Text style={styles.loginButtonText}>{t('login.loginButton')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
