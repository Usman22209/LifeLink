import React from "react";
import { View, TouchableOpacity, I18nManager, TextInput } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { styles } from "../FeedScreen.styles";

interface FeedHeaderProps {
  onBack: () => void;
  count: number;
  activeFilterCount: number;
  onFilterPress: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const FeedHeader: React.FC<FeedHeaderProps> = ({
  onBack,
  count,
  activeFilterCount,
  onFilterPress,
  searchQuery,
  onSearchChange,
}) => {
  const insets = useSafeAreaInsets();
  const isRtl = I18nManager.isRTL;

  return (
    <>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={onBack}
          activeOpacity={0.6}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <AnyIcon
            type={Icons.Ionicons}
            name={isRtl ? "chevron-forward" : "chevron-back"}
            size={moderateScale(22)}
            color={colors.text}
          />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text bold FONT_18 style={{ color: colors.text }}>
            Blood Requests
          </Text>
          <Text regular FONT_12 style={styles.headerSubtitle}>
            {count} active near you
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
          onPress={onFilterPress}
          activeOpacity={0.75}
        >
          <AnyIcon
            type={Icons.Feather}
            name="sliders"
            size={moderateScale(15)}
            color={activeFilterCount > 0 ? colors.white : colors.text}
          />
          {activeFilterCount > 0 && (
            <Text bold FONT_10 style={{ color: colors.white }}>
              {activeFilterCount}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <AnyIcon
            type={Icons.Feather}
            name="search"
            size={moderateScale(15)}
            color={colors.textSecondary}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by city, hospital or name…"
            placeholderTextColor={colors.placeholder}
            value={searchQuery}
            onChangeText={onSearchChange}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => onSearchChange("")}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <AnyIcon
                type={Icons.Ionicons}
                name="close-circle"
                size={moderateScale(16)}
                color={colors.gray300}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};

export default FeedHeader;
