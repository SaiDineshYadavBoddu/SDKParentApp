import { View, StyleSheet, ScrollView } from 'react-native';
import { ms } from 'react-native-size-matters';
import SectionContainer, {
  SectionItem,
} from '../../../common/components/SectionContainer';
import CustomText, { TextType } from '../../../common/components/CustomText';
import { useTheme } from '../../../theme/ThemeProvider';
import { useGetUserDetailsQuery } from '../../../network/profile/profile.api';
import { formatPhoneNumber } from '../../../utils/userUtils';

export default function UserData() {
  const { colors } = useTheme();
  const { data: userDetails } = useGetUserDetailsQuery();

  const renderAvatar = () => (
    <View style={[styles.avatar, { backgroundColor: colors.onBackground }]}>
      <CustomText
        type={TextType.ScreenHeadlineSmall}
        style={{ color: colors.background }}
      >
        {userDetails?.personalDetails?.firstName?.charAt(0) || 'S'}
      </CustomText>
    </View>
  );

  const renderUserInfo = () => (
    <View style={styles.infoContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.gridValueScroll}
      >
        <CustomText type={TextType.CardTitle} style={styles.name}>
          {`${userDetails?.personalDetails?.firstName || ''} ${
            userDetails?.personalDetails?.lastName || ''
          }`.trim() || 'User'}
        </CustomText>
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.gridValueScroll}
      >
        <CustomText
          type={TextType.CardText}
          style={[styles.details, { color: colors.secondaryText }]}
        >
          {userDetails?.contactDetails?.mobilePhone || ''}
        </CustomText>
      </ScrollView>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.gridValueScroll}
      >
        <CustomText
          type={TextType.CardText}
          style={[styles.details, { color: colors.secondaryText }]}
        >
          {userDetails?.contactDetails?.email || ''}
        </CustomText>
      </ScrollView>
    </View>
  );

  const sectionItems: SectionItem[] = [
    {
      id: 'user-info',
      start: renderAvatar(),
      middle: renderUserInfo(),
      style: styles.innerCard,
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
  innerCard: {
    backgroundColor: 'transparent',
    elevation: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
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
  gridValueScroll: {
    maxWidth: '100%',
  },
  name: {},
  details: {},
});
