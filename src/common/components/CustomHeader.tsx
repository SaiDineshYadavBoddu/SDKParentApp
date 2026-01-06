import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  TextStyle,
} from 'react-native';
import CustomText, { TextType } from './CustomText';
import { ms } from 'react-native-size-matters';
import { useTranslation } from 'react-i18next';
import { Spacing } from '../../theme/spacing';
import ChevronLeftSVG from '../../assets/svgs/ChevronLeftSVG';

interface Props {
  title: string;
  onPress?: () => void;
  onBackPress?: () => void;
  titleStyle?: StyleProp<TextStyle>;
  rightContent?: React.ReactNode;
}

export default function CustomHeader({
  title,
  onPress,
  onBackPress,
  titleStyle,
  rightContent,
}: Props) {
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        {onBackPress && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <ChevronLeftSVG />
          </TouchableOpacity>
        )}
        <CustomText
          type={TextType.ScreenDisplayLarge}
          style={[styles.title, titleStyle]}
        >
          {t(title)}
        </CustomText>
      </View>
      {rightContent}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.l,
    paddingHorizontal: Spacing.l,
    paddingTop: Spacing.l,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    marginRight: ms(8),
    padding: ms(6),
    marginLeft: -ms(6),
  },
  title: {
    flex: 1,
  },
});
