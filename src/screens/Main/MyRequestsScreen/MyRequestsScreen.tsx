import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import ScreenWrapper from "@components/ScreenWrapper";
import AppHeader from "@components/AppHeader";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import { ROUTES } from "@utils/Routes";
import { useMyBloodRequests } from "@shared/query/blood-requests/useBloodRequests";
import useTranslation from "@shared/hooks/useTranslation";

const MyRequestsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
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

  return (
    <ScreenWrapper backgroundColor={colors.background} safeArea>
      <AppHeader title="My Blood Requests" showBackButton />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
          />
        }
      >
        {/* Top Impact Stats Bar */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text bold FONT_18 style={{ color: colors.primary }}>
              {totalCreated}
            </Text>
            <Text regular FONT_10 style={styles.statLabel}>
              Posted
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text bold FONT_18 style={{ color: colors.warning }}>
              {activeCount}
            </Text>
            <Text regular FONT_10 style={styles.statLabel}>
              Active Now
            </Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text bold FONT_18 style={{ color: colors.success }}>
              {totalFulfilled}
            </Text>
            <Text regular FONT_10 style={styles.statLabel}>
              Units Received
            </Text>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabsRow}>
          {[
            { key: "all", label: "All" },
            { key: "active", label: "Active" },
            { key: "fulfilled", label: "Fulfilled" },
            { key: "expired", label: "Expired" },
          ].map((tab) => {
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

        {/* Body Content */}
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
                size={moderateScale(32)}
                color={colors.primary}
              />
            </View>
            <Text bold FONT_16 style={{ color: colors.text, marginTop: verticalScale(12) }}>
              No Requests Found
            </Text>
            <Text regular FONT_12 style={styles.emptySub}>
              {activeTab === "all"
                ? "You haven't posted any blood requests yet."
                : `No ${activeTab} blood requests.`}
            </Text>
          </View>
        ) : (
          filteredRequests.map((item: any) => {
            const fulfilled = item.fulfilled_units || 0;
            const required = item.units_required || item.units || 1;
            const progress = Math.min(100, Math.round((fulfilled / required) * 100));
            const isExpired = item.status === "expired" || item.is_expired;

            return (
              <View key={item.id} style={styles.requestCard}>
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.bloodBadge}>
                    <Text extraBold FONT_14 style={{ color: colors.primary }}>
                      {item.blood_group || item.bloodType}
                    </Text>
                  </View>
                  <View style={styles.headerTextWrap}>
                    <Text bold FONT_14 style={{ color: colors.text }} numberOfLines={1}>
                      {item.patient_name || item.patientName || "Blood Needed"}
                    </Text>
                    <Text regular FONT_11 style={{ color: colors.textSecondary }} numberOfLines={1}>
                      {item.hospital_name || item.hospital}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor: isExpired
                          ? withOpacity(colors.textSecondary, 0.1)
                          : item.status === "fulfilled"
                          ? withOpacity(colors.success, 0.1)
                          : withOpacity(colors.warning, 0.1),
                      },
                    ]}
                  >
                    <Text
                      bold
                      FONT_10
                      style={{
                        color: isExpired
                          ? colors.textSecondary
                          : item.status === "fulfilled"
                          ? colors.success
                          : colors.warning,
                      }}
                    >
                      {isExpired
                        ? "EXPIRED"
                        : item.status === "fulfilled"
                        ? "FULFILLED"
                        : item.time_left || "ACTIVE"}
                    </Text>
                  </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressContainer}>
                  <View style={styles.progressLabelRow}>
                    <Text semiBold FONT_11 style={{ color: colors.text }}>
                      Donation Progress
                    </Text>
                    <Text bold FONT_11 style={{ color: colors.primary }}>
                      {fulfilled} / {required} Units ({progress}%)
                    </Text>
                  </View>
                  <View style={styles.progressBarTrack}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${progress}%` },
                      ]}
                    />
                  </View>
                </View>

                {/* Footer Action */}
                <View style={styles.cardFooter}>
                  <TouchableOpacity
                    style={styles.trackBtn}
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.navigate(ROUTES.TRACK_REQUEST, {
                        requestId: item.id,
                        request: item,
                      })
                    }
                  >
                    <AnyIcon
                      type={Icons.Feather}
                      name="bar-chart-2"
                      size={moderateScale(14)}
                      color={colors.white}
                    />
                    <Text bold FONT_12 style={{ color: colors.white, marginLeft: scale(6) }}>
                      Track Responders & Progress
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(24),
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: colors.card,
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(12),
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: verticalScale(16),
    borderWidth: 1,
    borderColor: colors.border,
  },
  statBox: {
    alignItems: "center",
  },
  statLabel: {
    color: colors.textSecondary,
    marginTop: verticalScale(2),
  },
  statDivider: {
    width: 1,
    height: verticalScale(24),
    backgroundColor: colors.border,
  },
  tabsRow: {
    flexDirection: "row",
    marginBottom: verticalScale(16),
    gap: scale(8),
  },
  tabChip: {
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(6),
    borderRadius: moderateScale(20),
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  loadingWrap: {
    paddingVertical: verticalScale(40),
    alignItems: "center",
  },
  emptyState: {
    paddingVertical: verticalScale(40),
    alignItems: "center",
  },
  emptyIconWrap: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(30),
    backgroundColor: withOpacity(colors.primary, 0.1),
    justifyContent: "center",
    alignItems: "center",
  },
  emptySub: {
    color: colors.textSecondary,
    marginTop: verticalScale(4),
  },
  requestCard: {
    backgroundColor: colors.card,
    borderRadius: moderateScale(16),
    padding: moderateScale(14),
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  bloodBadge: {
    width: moderateScale(38),
    height: moderateScale(38),
    borderRadius: moderateScale(10),
    backgroundColor: withOpacity(colors.primary, 0.1),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(10),
  },
  headerTextWrap: {
    flex: 1,
  },
  statusPill: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(8),
  },
  progressContainer: {
    marginBottom: verticalScale(14),
  },
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(6),
  },
  progressBarTrack: {
    height: verticalScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: colors.gray100 || colors.border,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: moderateScale(4),
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  trackBtn: {
    flex: 1,
    height: verticalScale(40),
    borderRadius: moderateScale(10),
    backgroundColor: colors.primary,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MyRequestsScreen;
