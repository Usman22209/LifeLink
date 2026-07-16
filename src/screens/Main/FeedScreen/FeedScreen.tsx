import React, { useState, useCallback, useRef } from "react";
import { View, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import ScreenWrapper from "@components/ScreenWrapper";
import AppFlashList from "@components/AppList";
import AppText from "@components/AppText";
import AppHeader from "@components/AppHeader";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";

import RequestCard from "./components/RequestCard";
import FilterSheet from "./components/FilterSheet";
import SortSheet from "./components/SortSheet";
import {
  MOCK_REQUESTS,
  FilterState,
  DEFAULT_FILTERS,
  countActiveFilters,
  BloodRequest,
} from "./types";
import { styles } from "./FeedScreen.styles";

interface ListHeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  resultsCount: number;
  sortBy: string;
  onSortToggle: () => void;
}

const ListHeader: React.FC<ListHeaderProps> = React.memo(
  ({ searchQuery, setSearchQuery, resultsCount, sortBy, onSortToggle }) => {
    return (
      <View>
        <View style={[styles.searchRow, { paddingHorizontal: 0 }]}>
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
              onChangeText={setSearchQuery}
              returnKeyType="search"
              autoCorrect={false}
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
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

        <View style={styles.resultsBar}>
          <AppText medium FONT_12 style={{ color: colors.textSecondary }}>
            <AppText semiBold FONT_12 style={{ color: colors.text }}>
              {resultsCount}
            </AppText>{" "}
            requests found
          </AppText>
          <TouchableOpacity
            style={styles.sortPill}
            onPress={onSortToggle}
            activeOpacity={0.7}
          >
            <AnyIcon
              type={Icons.Feather}
              name="bar-chart-2"
              size={moderateScale(11)}
              color={colors.gray600}
            />
            <AppText medium FONT_11 style={{ color: colors.gray600 }}>
              {sortBy}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

const FeedScreen = () => {
  const navigation = useNavigation<any>();
  const listRef = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const activeFilterCount = countActiveFilters(filters);

  const handleSortToggle = useCallback(() => {
    setSortVisible(true);
  }, []);

  const handleSelectSort = useCallback((val: string) => {
    setFilters((prev) => ({ ...prev, sortBy: val }));
    // Wait a brief frame for layout diffing to settle, then scroll cleanly to top
    requestAnimationFrame(() => {
      listRef.current?.scrollToOffset({ offset: 0, animated: true });
    });
  }, []);

  const parseTimeToMinutes = (timeStr: string): number => {
    const num = parseInt(timeStr, 10) || 0;
    if (timeStr.includes("m")) return num;
    if (timeStr.includes("h")) return num * 60;
    if (timeStr.includes("Yesterday")) return 1440;
    return 999999;
  };

  const filteredData = searchQuery.trim()
    ? MOCK_REQUESTS.filter(({ city, hospital, patientName, bloodType }: BloodRequest) => {
        const q = searchQuery.toLowerCase();
        return (
          city.toLowerCase().includes(q) ||
          hospital.toLowerCase().includes(q) ||
          patientName.toLowerCase().includes(q) ||
          bloodType.toLowerCase().includes(q)
        );
      })
    : MOCK_REQUESTS;

  const sortedData = [...filteredData].sort((a, b) => {
    if (filters.sortBy === "Newest First") {
      return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time);
    }
    if (filters.sortBy === "Nearest First") {
      return parseFloat(a.distance) - parseFloat(b.distance);
    }
    if (filters.sortBy === "Most Units") {
      return b.units - a.units;
    }
    return 0;
  });

  return (
    <>
      <ScreenWrapper
        backgroundColor={colors.background}
        safeArea
        disableBottomSafeArea={true}
        scrollable={false}
        style={styles.wrapper}
        header={
          <AppHeader
            title="Blood Requests"
            showBackButton
            onBackPress={() => navigation.goBack()}
            rightComponent={
              <TouchableOpacity
                onPress={() => setSheetVisible(true)}
                activeOpacity={0.75}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={{ position: "relative" }}
              >
                <AnyIcon
                  type={Icons.Feather}
                  name="sliders"
                  size={moderateScale(16)}
                  color={colors.text}
                />
                {activeFilterCount > 0 && <View style={styles.filterBadge} />}
              </TouchableOpacity>
            }
            titleSize={15}
            hasBorder={true}
          />
        }
      >
        <AppFlashList
          ref={listRef}
          data={sortedData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RequestCard {...item} />}
          estimatedItemSize={120}
          ListHeaderComponent={
            <ListHeader
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              resultsCount={sortedData.length}
              sortBy={filters.sortBy}
              onSortToggle={handleSortToggle}
            />
          }
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => (
            <View style={{ height: verticalScale(10) }} />
          )}
          ListFooterComponent={<View style={{ height: verticalScale(28) }} />}
        />
      </ScreenWrapper>

      <FilterSheet
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        filters={filters}
        setFilters={setFilters}
      />

      <SortSheet
        visible={sortVisible}
        onClose={() => setSortVisible(false)}
        selectedSort={filters.sortBy}
        onSelectSort={handleSelectSort}
      />
    </>
  );
};

export default FeedScreen;
