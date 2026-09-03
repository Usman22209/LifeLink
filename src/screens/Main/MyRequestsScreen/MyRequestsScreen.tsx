import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import ScreenWrapper from "@components/ScreenWrapper";
import AppHeader from "@components/AppHeader";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { ROUTES } from "@utils/Routes";
import useTranslation from "@shared/hooks/useTranslation";
import { selectIsRtl } from "@store/slices/appSlice";
import { useMyBloodRequests } from "@shared/query/blood-requests/useBloodRequests";

import { SummaryStatsCard } from "./components/SummaryStatsCard";
import { MyRequestCard } from "./components/MyRequestCard";
import { styles } from "./MyRequestsScreen.styles";

const MyRequestsScreen: React.FC = () => {
  const { t } = useTranslation();
  const isRtl = useSelector(selectIsRtl);
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState<"all" | "active" | "fulfilled" | "expired">("all");

  const { data: myRequestsData, isLoading, refetch, isRefetching } = useMyBloodRequests();

  const rawData: any = myRequestsData;
  const requestsList = Array.isArray(rawData)
    ? rawData
    : rawData?.data?.requests || rawData?.requests || rawData?.data || [];

  const filteredRequests = requestsList.filter((item: any) => {
    if (activeTab === "active") return item.status === "open" || item.status === "partially_fulfilled";
    if (activeTab === "fulfilled") return item.status === "fulfilled" || item.status === "completed";
    if (activeTab === "expired") return item.status === "expired" || item.is_expired;
    return true;
  });

  const totalCreated = requestsList.length;
  const activeCount = requestsList.filter(
    (item: any) => (item.status === "open" || item.status === "partially_fulfilled") && !item.is_expired
  ).length;
  const totalFulfilled = requestsList.reduce(
    (acc: number, item: any) => acc + (item.fulfilled_units || 0),
    0
  );

  const tabs = [
    { key: "all", label: t("myRequests.all") || "All" },
    { key: "active", label: t("myRequests.active") || "Active" },
    { key: "fulfilled", label: t("myRequests.fulfilled") || "Fulfilled" },
    { key: "expired", label: t("myRequests.expired") || "Expired" },
  ] as const;

  return (
    <ScreenWrapper backgroundColor={colors.background} safeArea>
      <AppHeader
        title={t("myRequests.title") || "My Requests"}
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
      >
        {/* Summary Stats Card */}
        <SummaryStatsCard
          totalCreated={totalCreated}
          activeCount={activeCount}
          totalFulfilled={totalFulfilled}
        />

        {/* Filter Tabs */}
        <View style={[styles.tabsRow, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabChip, isActive && styles.tabChipActive]}
                activeOpacity={0.7}
                onPress={() => setActiveTab(tab.key as any)}
              >
                <Text
                  semiBold
                  FONT_11
                  style={{ color: isActive ? colors.white : colors.textSecondary }}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Results */}
        {isLoading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : filteredRequests.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <AnyIcon
                type={Icons.Feather}
                name="droplet"
                size={moderateScale(24)}
                color={colors.textSecondary}
              />
            </View>
            <Text semiBold FONT_14 style={{ color: colors.text, marginTop: verticalScale(12) }}>
              {t("myRequests.noRequestsFound") || "No Requests Found"}
            </Text>
            <Text regular FONT_12 style={{ color: colors.textSecondary, marginTop: verticalScale(4), textAlign: "center" }}>
              {activeTab === "all"
                ? (t("myRequests.noRequestsAll") || "You haven't posted any blood requests yet.")
                : (t("myRequests.noRequestsTab", { tab: t(`myRequests.${activeTab}`) || activeTab }) || `No ${activeTab} blood requests.`)}
            </Text>
          </View>
        ) : (
          filteredRequests.map((item: any) => (
            <MyRequestCard
              key={item.id}
              item={item}
              onDetails={() =>
                navigation.navigate(ROUTES.REQUEST_DETAIL, {
                  request: {
                    ...item,
                    patientName: item.patient_name || item.patientName,
                    bloodType: item.blood_group || item.bloodType,
                    hospital: item.hospital_name || item.hospital,
                    city: item.city_id || item.city,
                    units: item.units_required || item.units,
                  },
                })
              }
              onTrack={() =>
                navigation.navigate(ROUTES.TRACK_REQUEST, {
                  requestId: item.id,
                  request: item,
                })
              }
            />
          ))
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

export default MyRequestsScreen;
