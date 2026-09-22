import React, { useState, useCallback, useRef } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
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
  FilterState,
  DEFAULT_FILTERS,
  countActiveFilters,
  BloodRequest,
} from "./types";
import { styles } from "./FeedScreen.styles";

import { useSelector } from "react-redux";
import useTranslation from "@shared/hooks/useTranslation";
import { selectIsRtl } from "@store/slices/appSlice";

import { useInfiniteBloodRequestFeed } from "@shared/query/blood-requests/useBloodRequests";
import { getCityNameById } from "@shared/utils/cityUtils";
import {
  useUserLocation,
  calculateDistanceKm,
} from "@shared/utils/locationService";

interface ListHeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  resultsCount: number;
  sortBy: string;
  onSortToggle: () => void;
}

const formatRelativeTime = (dateStr?: string): string => {
  if (!dateStr) return "Recently";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Recently";

  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const ListHeader: React.FC<ListHeaderProps> = React.memo(
  ({ searchQuery, setSearchQuery, resultsCount, sortBy, onSortToggle }) => {
    const { t } = useTranslation();
    const isRtl = useSelector(selectIsRtl);

    const getSortByLabel = (sortVal: string) => {
      switch (sortVal) {
        case "Newest First":
          return t("feed.newestFirst");
        case "Nearest First":
          return t("feed.nearestFirst");
        case "Most Units":
          return t("feed.mostUnits");
        default:
          return sortVal;
      }
    };

    return (
      <View>
        <View style={[styles.searchRow, { paddingHorizontal: 0 }]}>
          <View
            style={[
              styles.searchBox,
              { flexDirection: isRtl ? "row-reverse" : "row" },
            ]}
          >
            <AnyIcon
              type={Icons.Feather}
              name="search"
              size={moderateScale(15)}
              color={colors.textSecondary}
            />
            <TextInput
              style={[
                styles.searchInput,
                { textAlign: isRtl ? "right" : "left" },
              ]}
              placeholder={t("feed.searchPlaceholder")}
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

        <View
          style={[
            styles.resultsBar,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          <AppText medium FONT_12 style={{ color: colors.textSecondary }}>
            <AppText semiBold FONT_12 style={{ color: colors.text }}>
              {resultsCount}
            </AppText>{" "}
            {t("feed.requestsFound")}
          </AppText>
          <TouchableOpacity
            style={[
              styles.sortPill,
              { flexDirection: isRtl ? "row-reverse" : "row" },
            ]}
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
              {getSortByLabel(sortBy)}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  },
);

const FeedScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const listRef = useRef<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sortVisible, setSortVisible] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const userLocation = useUserLocation();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isRefetching,
    refetch,
  } = useInfiniteBloodRequestFeed({
    limit: 10,
    search: searchQuery.trim() || undefined,
    blood_group: filters.bloodType !== "All" ? filters.bloodType : undefined,
    urgency: filters.urgency !== "All" ? filters.urgency : undefined,
    sort_by:
      filters.sortBy === "Most Units"
        ? "most_units"
        : filters.sortBy === "Nearest First"
          ? "nearest"
          : "created_at",
    lat: userLocation?.latitude,
    lng: userLocation?.longitude,
  });

  const activeFilterCount = countActiveFilters(filters);

  const handleSortToggle = useCallback(() => {
    setSortVisible(true);
  }, []);

  const handleSelectSort = useCallback((val: string) => {
    setFilters((prev) => ({ ...prev, sortBy: val }));
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

  const fetchedItems = data?.pages
    ? data.pages.flatMap((page: any) =>
        page?.data?.requests
          ? page.data.requests
          : page?.requests
            ? page.requests
            : page?.data
              ? page.data
              : Array.isArray(page)
                ? page
                : [],
      )
    : [];

  const rawItems = fetchedItems;

  const formattedRequests: BloodRequest[] = rawItems.map((item: any) => ({
    id: String(item.id),
    bloodType: item.blood_group || item.bloodType || "O+",
    patientName: item.patient_name || item.patientName || "Anonymous Patient",
    hospital: item.hospital_name || item.hospital || "Hospital",
    city: item.city_id || item.city || "",
    state: item.state || "",
    patientImage: item.requester?.profile_image || item.patientImage,
    units: item.units_required ?? item.units ?? 1,
    urgency: item.urgency || "normal",
    time: formatRelativeTime(item.created_at || item.time),
    distance: item.distance || "",
    latitude: item.latitude ? Number(item.latitude) : undefined,
    longitude: item.longitude ? Number(item.longitude) : undefined,
    requester_id: item.requester_id || item.requester?.id,
  }));

  const filteredData = formattedRequests.filter((item: BloodRequest) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const resolvedCity = getCityNameById(item.city).toLowerCase();
      const match =
        resolvedCity.includes(q) ||
        item.hospital.toLowerCase().includes(q) ||
        item.patientName.toLowerCase().includes(q) ||
        item.bloodType.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (filters.bloodType !== "All") {
      if (item.bloodType.toUpperCase() !== filters.bloodType.toUpperCase()) {
        return false;
      }
    }

    if (filters.urgency !== "All") {
      const itemUrgency = item.urgency.toLowerCase();
      const filterUrgency = filters.urgency.toLowerCase();
      const isHighUrgentMatch =
        (filterUrgency === "high" || filterUrgency === "urgent") &&
        (itemUrgency === "high" || itemUrgency === "urgent");
      if (itemUrgency !== filterUrgency && !isHighUrgentMatch) {
        return false;
      }
    }

    if (filters.distance !== "Any Distance") {
      const matchNum = filters.distance.match(/\d+/);
      const maxKm = matchNum ? parseInt(matchNum[0], 10) : Infinity;

      let itemKm: number | null = null;
      if (
        userLocation?.latitude !== undefined &&
        userLocation?.longitude !== undefined &&
        item.latitude !== undefined &&
        item.longitude !== undefined
      ) {
        itemKm = calculateDistanceKm(
          userLocation.latitude,
          userLocation.longitude,
          item.latitude,
          item.longitude,
        );
      } else if (item.distance) {
        const parsed = parseFloat(item.distance);
        if (!isNaN(parsed)) itemKm = parsed;
      }

      if (itemKm !== null && itemKm > maxKm) {
        return false;
      }
    }

    return true;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (filters.sortBy === "Newest First") {
      return parseTimeToMinutes(a.time) - parseTimeToMinutes(b.time);
    }
    if (filters.sortBy === "Nearest First") {
      return parseFloat(a.distance || "999") - parseFloat(b.distance || "999");
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
            title={t("feed.title")}
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
          refreshing={isRefetching}
          onRefresh={refetch}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListHeaderComponent={
            <ListHeader
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              resultsCount={sortedData.length}
              sortBy={filters.sortBy}
              onSortToggle={handleSortToggle}
            />
          }
          ListEmptyComponent={
            isLoading ? (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: verticalScale(60),
                }}
              >
                <ActivityIndicator size="large" color={colors.primary} />
                <AppText
                  regular
                  FONT_12
                  style={{
                    color: colors.textSecondary,
                    marginTop: verticalScale(12),
                  }}
                >
                  {t("feed.loading") || "Finding blood requests near you..."}
                </AppText>
              </View>
            ) : (
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  paddingVertical: verticalScale(60),
                  paddingHorizontal: moderateScale(24),
                }}
              >
                <View
                  style={{
                    width: moderateScale(56),
                    height: moderateScale(56),
                    borderRadius: moderateScale(28),
                    backgroundColor: "#FFEBEE",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: verticalScale(14),
                  }}
                >
                  <AnyIcon
                    type={Icons.Feather}
                    name="inbox"
                    size={moderateScale(26)}
                    color={colors.primary}
                  />
                </View>
                <AppText
                  bold
                  FONT_15
                  style={{
                    color: colors.text,
                    textAlign: "center",
                    marginBottom: verticalScale(6),
                  }}
                >
                  {t("feed.noRequests") || "No Blood Requests Found"}
                </AppText>
                <AppText
                  regular
                  FONT_12
                  style={{
                    color: colors.textSecondary,
                    textAlign: "center",
                    lineHeight: 18,
                  }}
                >
                  {searchQuery.trim() || activeFilterCount > 0
                    ? "Try adjusting your filters or search terms to find more requests."
                    : "There are no active blood requests right now. Check back soon!"}
                </AppText>
              </View>
            )
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
