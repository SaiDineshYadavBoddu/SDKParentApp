import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Animated,
  StyleProp,
  ViewStyle,
} from 'react-native';
import CustomImage from './CustomImage';
import { ms } from 'react-native-size-matters';

interface CustomLoaderProps {
  loading: boolean;
  overlayStyle?: StyleProp<ViewStyle>;
}

const CustomLoader: React.FC<CustomLoaderProps> = ({
  loading,
  overlayStyle,
}) => {
  const scaleValue = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (loading) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleValue, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(scaleValue, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      scaleValue.setValue(1);
    }
  }, [loading, scaleValue]);

  return (
    <Modal
      transparent={false}
      animationType="fade"
      visible={loading}
      onRequestClose={() => {}}
      statusBarTranslucent={true}
    >
      <View style={styles.container}>
        <View style={[styles.overlay, overlayStyle]} />
        <Animated.View
          style={[styles.logoContainer, { transform: [{ scale: scaleValue }] }]}
        >
          <CustomImage
            source={require('../../assets/images/Logo.png')}
            resizeMode="contain"
          />
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  logoContainer: {
    width: ms(180),
    height: ms(180),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: ms(16),
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    paddingLeft: ms(60),
  },
});

export default CustomLoader;
