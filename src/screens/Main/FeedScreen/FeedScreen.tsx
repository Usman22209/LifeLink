import React, { useState } from "react";
import { View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import ScreenWrapper from "@components/ScreenWrapper";
import AppFlashList from "@components/AppList";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";

import FeedHeader from "./components/FeedHeader";
import RequestCard from "./components/RequestCard";
import FilterSheet from "./components/FilterSheet";
import {
  MOCK_REQUESTS,
  FilterState,
  DEFAULT_FILTERS,
  countActiveFilters,
} from "./types";
import { styles } from "./FeedScreen.styles";

const FeedScreen = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetVisible, setSheetVisible] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const activeFilterCount = countActiveFilters(filters);

  const filteredData = searchQuery.trim()
    ? MOCK_REQUESTS.filter(({ city, hospital, patientName, bloodType }) => {
        const q = searchQuery.toLowerCase();
        return (
          city.toLowerCase().includes(q) ||
          hospital.toLowerCase().includes(q) ||
          patientName.toLowerCase().includes(q) ||
          bloodType.toLowerCase().includes(q)
        );
      })
    : MOCK_REQUESTS;

  const ListHeader = (
    <View style={styles.resultsBar}>
      <AppText medium FONT_12 style={{ color: colors.textSecondary }}>
        <AppText semiBold FONT_12 style={{ color: colors.text }}>
          {filteredData.length}
        </AppText>{" "}
        requests found
      </AppText>
      <View style={styles.sortPill}>
        <AnyIcon
          type={Icons.Feather}
          name="bar-chart-2"
          size={moderateScale(11)}
          color={colors.gray600}
        />
        <AppText medium FONT_11 style={{ color: colors.gray600 }}>
          {filters.sortBy}
        </AppText>
      </View>
    </View>
  );

  return (
    <>
      <ScreenWrapper
        backgroundColor={colors.background}
        safeArea
        scrollable={false}
        style={styles.wrapper}
        header={
          <FeedHeader
            onBack={() => navigation.goBack()}
            count={MOCK_REQUESTS.length}
            activeFilterCount={activeFilterCount}
            onFilterPress={() => setSheetVisible(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        }
      >
        <AppFlashList
          data={filteredData}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <RequestCard {...item} />}
          estimatedItemSize={120}
          ListHeaderComponent={ListHeader}
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
    </>
  );
};

export default FeedScreen;
