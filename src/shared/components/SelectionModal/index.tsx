import React, { useMemo, useState } from "react";
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

interface SelectionOption {
  label: string;
  value: string;
}

interface SelectionModalProps {
  isVisible?: boolean;
  visible?: boolean;
  onClose: () => void;
  title: string;
  options: string[] | SelectionOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
}

const SelectionModal: React.FC<SelectionModalProps> = ({
  isVisible,
  visible,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
  placeholder = "Search...",
}) => {
  const isRtl = I18nManager.isRTL;
  const [search, setSearch] = useState("");
  const showModal = isVisible ?? visible ?? false;

  const normalizedOptions = useMemo((): SelectionOption[] => {
    if (!Array.isArray(options)) return [];
    return options.map((opt) =>
      typeof opt === "string" ? { label: opt, value: opt } : opt,
    );
  }, [options]);

  const filteredOptions = useMemo(() => {
    return normalizedOptions.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase()),
    );
  }, [normalizedOptions, search]);

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
            {title}
          </Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.searchContainer}>
          <AppInput
            name="search_selection"
            placeholder={placeholder}
            value={search}
            onChangeText={setSearch}
            iconType={Icons.Ionicons}
            iconName="search-outline"
            marginBottom={0}
          />
        </View>

        <FlatList
          data={filteredOptions}
          keyExtractor={(item) => item.value}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              style={[
                styles.item,
                { flexDirection: isRtl ? "row-reverse" : "row" },
                selectedValue === item.value && styles.selectedItem,
              ]}
              onPress={() => {
                onSelect(item.value);
                setSearch("");
                onClose();
              }}
            >
              <Text
                regular
                FONT_14
                style={[
                  styles.itemName,
                  selectedValue === item.value && styles.selectedItemText,
                ]}
              >
                {item.label}
              </Text>
              {selectedValue === item.value && (
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
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text regular FONT_14 style={{ color: colors.textSecondary }}>
                No results found
              </Text>
            </View>
          }
        />
      </ScreenWrapper>
    </Modal>
  );
};

export default SelectionModal;

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
    backgroundColor: colors.border + "80",
    marginHorizontal: scale(4),
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
  itemName: {
    color: colors.text,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: verticalScale(20),
  },
});
