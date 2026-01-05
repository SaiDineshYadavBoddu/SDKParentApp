import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ms } from 'react-native-size-matters';
import SectionContainer, {
  SectionItem,
} from '../../../common/components/SectionContainer';
import CustomText, { TextType } from '../../../common/components/CustomText';
import { useTheme } from '../../../theme/ThemeProvider';

export default function UserData() {
  const { colors } = useTheme();

  const renderAvatar = () => (
    <View style={[styles.avatar, { backgroundColor: '#000000' }]}>
      <CustomText
        type={TextType.ScreenHeadlineSmall}
        style={{ color: '#FFFFFF' }}
      >
        S
      </CustomText>
    </View>
  );

  const renderUserInfo = () => (
    <View style={styles.infoContainer}>
      <CustomText type={TextType.CardTitle} style={styles.name}>
        Sharmil Panayan
      </CustomText>
      <CustomText type={TextType.CardText} style={styles.details}>
        +971-467-433-2684
      </CustomText>
      <CustomText type={TextType.CardText} style={styles.details}>
        sharmil200@yopmail.com
      </CustomText>
    </View>
  );

  const sectionItems: SectionItem[] = [
    {
      id: 'user-info',
      start: renderAvatar(),
      middle: renderUserInfo(),
    },
  ];

  return (
    <SectionContainer
      items={sectionItems}
      style={styles.container}
      contentStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: ms(16),
    paddingHorizontal: ms(16),
  },
  content: {
    paddingVertical: 0,
  },
  avatar: {
    width: ms(50),
    height: ms(50),
    borderRadius: ms(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: ms(8),
    gap: ms(4),
  },
  name: {},
  details: {
    color: '#666666', // Using a grey color for details to match likely design
  },
});
