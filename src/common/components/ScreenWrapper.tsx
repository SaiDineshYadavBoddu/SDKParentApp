import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle, Platform } from 'react-native';
import { useSafeAreaInsets, Edge } from 'react-native-safe-area-context';
import { useTheme } from '../../theme/ThemeProvider';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  edges?: Edge[];
  backgroundColor?: string;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  edges = ['top', 'bottom', 'left', 'right'],
  backgroundColor,
}) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const containerStyle: ViewStyle = {
    flex: 1,
    backgroundColor: backgroundColor || colors.background,
    paddingTop: edges.includes('top') ? insets.top : 0,
    paddingBottom: edges.includes('bottom') ? insets.bottom : 0,
    paddingLeft: edges.includes('left') ? insets.left : 0,
    paddingRight: edges.includes('right') ? insets.right : 0,
  };

  return <View style={[containerStyle, style]}>{children}</View>;
};

export default ScreenWrapper;
