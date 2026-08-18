import React from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  I18nManager,
} from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import ScreenWrapper from "@components/ScreenWrapper";
import Text from "@components/AppText";
import AppInput from "@components/AppInput";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";

interface Country {
  name: string;
  code: string;
  flag: string;
}

interface CountryPickerModalProps {
  isVisible?: boolean;
  visible?: boolean;
  onClose: () => void;
  countries: Country[];
  selectedCountry?: string;
  onSelect?: (country: string) => void;
  onSelectCountry?: (country: string) => void;
  onSearch?: (text: string) => void;
  onSearchChange?: (text: string) => void;
  searchValue?: string;
}

const CountryPickerModal: React.FC<CountryPickerModalProps> = ({
  isVisible,
  visible,
  onClose,
  countries,
  selectedCountry,
  onSelect,
  onSelectCountry,
  onSearch,
  onSearchChange,
  searchValue = "",
}) => {
  const isRtl = I18nManager.isRTL;
  const showModal = isVisible ?? visible ?? false;

  const handleSearchChange = (text: string) => {
    if (onSearchChange) onSearchChange(text);
    if (onSearch) onSearch(text);
  };

  const handleSelect = (countryName: string) => {
    if (onSelectCountry) onSelectCountry(countryName);
    if (onSelect) onSelect(countryName);
  };

  return (
    <Modal visible={showModal} animationType="slide" onRequestClose={onClose}>
      <ScreenWrapper safeArea backgroundColor={colors.white}>
        <View style={styles.handleIndicator} />
        <View
          style={[
            styles.header,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <AnyIcon
              type={Icons.Ionicons}
              name="close-outline"
              size={moderateScale(24)}
              color={colors.text}
            />
          </TouchableOpacity>
          <Text bold FONT_16 style={styles.headerTitle}>
            Select Country
          </Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.searchContainer}>
          <AppInput
            name="search_country"
            placeholder="Search..."
            value={searchValue}
            iconType={Icons.Ionicons}
            iconName="search-outline"
            onChangeText={handleSearchChange}
            marginBottom={0}
          />
        </View>

        <FlatList
          data={countries}
          keyExtractor={(item) => item.code}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.item,
                { flexDirection: isRtl ? "row-reverse" : "row" },
                selectedCountry === item.name && styles.selectedItem,
              ]}
              onPress={() => handleSelect(item.name)}
            >
              <View
                style={[
                  styles.itemContent,
                  { flexDirection: isRtl ? "row-reverse" : "row" },
                ]}
              >
                <Text style={styles.flagEmoji}>{item.flag}</Text>
                <Text
                  regular
                  FONT_14
                  style={[
                    styles.countryName,
                    {
                      marginLeft: isRtl ? 0 : scale(12),
                      marginRight: isRtl ? scale(12) : 0,
                    },
                    selectedCountry === item.name && styles.selectedItemText,
                  ]}
                >
                  {item.name}
                </Text>
              </View>
              {selectedCountry === item.name && (
                <View style={styles.checkIconWrapper}>
                  <AnyIcon
                    type={Icons.Ionicons}
                    name="checkmark"
                    size={moderateScale(16)}
                    color={colors.white}
                  />
                </View>
              )}
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.list}
        />
      </ScreenWrapper>
    </Modal>
  );
};

export default CountryPickerModal;

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
  },
  handleIndicator: {
    width: scale(40),
    height: verticalScale(5),
    borderRadius: moderateScale(3),
    backgroundColor: colors.border + "30",
    alignSelf: "center",
    marginTop: verticalScale(8),
  },
  headerTitle: {
    color: colors.text,
  },
  closeBtn: {
    padding: scale(4),
  },
  searchContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
  },
  searchInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(12),
    backgroundColor: colors.card,
    borderRadius: moderateScale(10),
    height: verticalScale(42),
    borderWidth: 1,
    borderColor: colors.border + "50",
  },
  searchBar: {
    flex: 1,
    borderWidth: 0,
    height: "100%",
    backgroundColor: "transparent",
  },
  searchField: {
    fontSize: moderateScale(14),
    marginLeft: scale(4),
  },
  list: {
    paddingHorizontal: scale(16),
    paddingBottom: verticalScale(30),
  },
  item: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(12),
    borderRadius: moderateScale(10),
  },
  separator: {
    height: 1,
    backgroundColor: colors.border + "15",
    marginHorizontal: scale(12),
  },
  selectedItem: {
    backgroundColor: colors.primary + "10",
  },
  selectedItemText: {
    color: colors.primary,
    fontWeight: "600",
  },
  checkIconWrapper: {
    width: moderateScale(22),
    height: moderateScale(22),
    borderRadius: moderateScale(11),
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  itemContent: {
    alignItems: "center",
  },
  flagEmoji: {
    fontSize: moderateScale(20),
  },
  countryName: {
    color: colors.text,
  },
});
