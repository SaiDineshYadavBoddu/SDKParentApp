import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TouchableNativeFeedback,
  Keyboard,
} from 'react-native';
import CustomText, { TextType } from '../../../common/components/CustomText';
import { ms } from 'react-native-size-matters';
import { Spacing } from '../../../theme/spacing';
import CustomTextInput from '../../../common/components/CustomTextInput';
import CustomRadioButton from '../../../common/components/CustomRadioButton';
import SearchSVG from '../../../assets/svgs/SearchSVG';
import CloseSVG from '../../../assets/svgs/CloseSVG';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../../theme/ThemeProvider';
import CustomButton from '../../../common/components/CustomButton';
import { useTranslation } from 'react-i18next';

interface Company {
  id: string;
  name: string;
}

const COMPANIES: Company[] = [
  { id: '1', name: 'Axis' },
  { id: '2', name: 'Infosys' },
  { id: '3', name: 'Google' },
  { id: '4', name: 'Network' },
  { id: '5', name: 'Microsoft' },
  { id: '6', name: 'Amazon' },
  { id: '7', name: 'IBM' },
];

export default function ChangeCompany() {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null,
  );

  const filteredCompanies = COMPANIES.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectCompany = (id: string) => {
    setSelectedCompanyId(id);
  };

  const renderItem = ({ item }: { item: Company }) => (
    <TouchableOpacity
      style={[
        styles.card,
        {
          borderColor:
            selectedCompanyId === item.id ? colors.primary : colors.outline,
        },
      ]}
      onPress={() => handleSelectCompany(item.id)}
      activeOpacity={0.8}
    >
      <CustomRadioButton
        selected={selectedCompanyId === item.id}
        onPress={() => handleSelectCompany(item.id)}
        label={item.name}
        labelStyle={styles.radioLabel}
        containerStyle={styles.radioContainer}
      />
    </TouchableOpacity>
  );

  return (
    <TouchableNativeFeedback onPress={() => Keyboard.dismiss()}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View>
          <View style={styles.header}>
            <CustomText
              type={TextType.ScreenHeadlineSmall}
              style={styles.headerTitle}
            >
              {t('profile.details.changeCompany.title')}
            </CustomText>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <CloseSVG
                width={ms(24)}
                height={ms(24)}
                color={colors.onBackground}
              />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <CustomTextInput
            placeholder={t('profile.details.changeCompany.searchPlaceholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            leftIcon={<SearchSVG width={ms(20)} height={ms(20)} />}
            containerStyle={styles.searchContainer}
            inputStyle={styles.searchInput}
            inputContainerStyle={[styles.searchInputContainer, { borderColor: colors.outline }]}
          />
        </View>

        {/* List */}
        <View style={styles.listContainer}>
          <FlatList
            data={filteredCompanies}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View style={{ height: Spacing.s }} />
            )}
            style={{ flex: 1 }}
          />

          {/* Confirm Button */}
          <View style={styles.buttonContainer}>
            <CustomButton
              title={t('common.confirm')}
              onPress={() => {
                console.log('Confirmed Company ID:', selectedCompanyId);
                navigation.goBack();
              }}
              disabled={!selectedCompanyId} // Optional: disable if no selection
              variant="primary"
              uppercase={false}
            />
          </View>
        </View>
      </View>
    </TouchableNativeFeedback>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: Spacing.l,
    paddingVertical: Spacing.xxl,
    gap: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.l,
    marginBottom: Spacing.s,
  },
  headerTitle: {
    fontWeight: 'bold',
  },
  searchContainer: {
    marginBottom: Spacing.m,
  },
  searchInputContainer: {
  },
  searchInput: {
    fontSize: ms(14),
  },
  listContent: {
    paddingBottom: Spacing.xl,
    flexGrow: 1,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: ms(16),
    paddingVertical: ms(16),
    paddingHorizontal: ms(16),
    borderWidth: 1,
  },
  radioContainer: {
    marginVertical: 0, // Override default margin
  },
  radioLabel: {
    fontSize: ms(16),
    fontWeight: '500',
    marginLeft: ms(12),
  },
  buttonContainer: {
    paddingTop: Spacing.m,
    paddingBottom: Spacing.s, // Add some bottom padding if needed
  },
  listContainer: {
    flex: 1,
    gap: Spacing.xxl,
  },
});
