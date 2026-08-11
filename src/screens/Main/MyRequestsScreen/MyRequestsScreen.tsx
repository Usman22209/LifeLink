import React, { useState } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Platform,
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

const PAD = scale(16);

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

  const getStatusInfo = (item: any) => {
    const isExpired = item.status === "expired" || item.is_expired;
    const isFulfilled = item.status === "fulfilled" || item.status === "completed";
    if (isFulfilled) return { label: "Fulfilled", color: colors.success };
    if (isExpired) return { label: "Expired", color: colors.textSecondary };
    return { label: item.time_left || "Active", color: colors.success };
  };

  return (
    <ScreenWrapper backgroundColor={colors.background} safeArea>
      <AppHeader title="My Requests" showBackButton />

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
        {/* ─── Summary Stats Card ─── */}
        <View style={styles.card}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text bold FONT_20 style={{ color: colors.primary }}>
                {totalCreated}
              </Text>
              <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: verticalScale(2) }}>
                Posted
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text bold FONT_20 style={{ color: colors.warning }}>
                {activeCount}
              </Text>
              <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: verticalScale(2) }}>
                Active
              </Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text bold FONT_20 style={{ color: colors.success }}>
                {totalFulfilled}
              </Text>
              <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: verticalScale(2) }}>
                Received
              </Text>
            </View>
          </View>
        </View>

        {/* ─── Filter Tabs ─── */}
        <View style={styles.tabsRow}>
          {([
            { key: "all", label: "All" },
            { key: "active", label: "Active" },
            { key: "fulfilled", label: "Fulfilled" },
            { key: "expired", label: "Expired" },
          ] as const).map((tab) => {
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

        {/* ─── Results ─── */}
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
              No Requests Found
            </Text>
            <Text regular FONT_12 style={{ color: colors.textSecondary, marginTop: verticalScale(4), textAlign: "center" }}>
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
            const status = getStatusInfo(item);

            return (
              <View key={item.id} style={styles.card}>
                {/* Top row */}
                <View style={styles.requestTopRow}>
                  <View style={styles.bloodBadge}>
                    <Text extraBold FONT_16 style={{ color: colors.primary }}>
                      {item.blood_group || item.bloodType}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text semiBold FONT_13 style={{ color: colors.text }} numberOfLines={1}>
                      {item.patient_name || item.patientName || "Blood Needed"}
                    </Text>
                    <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: verticalScale(2) }} numberOfLines={1}>
                      {item.hospital_name || item.hospital}
                    </Text>
                  </View>
                  <View style={[styles.statusPill, { backgroundColor: withOpacity(status.color, 0.1) }]}>
                    <View style={[styles.statusDot, { backgroundColor: status.color }]} />
                    <Text bold FONT_10 style={{ color: status.color }}>
                      {status.label}
                    </Text>
                  </View>
                </View>

                {/* Progress */}
                <View style={styles.hairline} />
                <View style={styles.progressSection}>
                  <View style={styles.progressLabelRow}>
                    <Text regular FONT_11 style={{ color: colors.textSecondary }}>
                      Progress
                    </Text>
                    <Text semiBold FONT_11 style={{ color: progress >= 100 ? colors.success : colors.primary }}>
                      {fulfilled}/{required} units · {progress}%
                    </Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View
                      style={[
                        styles.progressFill,
                        {
                          width: `${progress}%`,
                          backgroundColor: progress >= 100 ? colors.success : colors.primary,
                        },
                      ]}
                    />
                  </View>
                </View>

                {/* Footer */}
                <View style={styles.hairline} />
                <View style={styles.cardFooter}>
                  <TouchableOpacity
                    style={styles.footerBtn}
                    activeOpacity={0.7}
                    onPress={() =>
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
                  >
                    <AnyIcon type={Icons.Feather} name="eye" size={moderateScale(13)} color={colors.textSecondary} />
                    <Text semiBold FONT_11 style={{ color: colors.textSecondary, marginLeft: scale(5) }}>
                      Details
                    </Text>
                  </TouchableOpacity>

                  <View style={styles.footerDivider} />

                  <TouchableOpacity
                    style={styles.footerBtn}
                    activeOpacity={0.7}
                    onPress={() =>
                      navigation.navigate(ROUTES.TRACK_REQUEST, {
                        requestId: item.id,
                        request: item,
                      })
                    }
                  >
                    <AnyIcon type={Icons.Feather} name="activity" size={moderateScale(13)} color={colors.primary} />
                    <Text semiBold FONT_11 style={{ color: colors.primary, marginLeft: scale(5) }}>
                      Track
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
  scrollContent: {
    paddingHorizontal: PAD,
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(28),
  },

  /* ── Shared Card ── */
  card: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(14),
    borderWidth: 1,
    borderColor: colors.gray300,
    padding: moderateScale(14),
    marginBottom: verticalScale(12),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  hairline: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.gray300,
    marginVertical: verticalScale(10),
  },

  /* ── Stats ── */
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: verticalScale(28),
    backgroundColor: colors.gray300,
  },

  /* ── Tabs ── */
  tabsRow: {
    flexDirection: "row",
    marginBottom: verticalScale(14),
    gap: scale(8),
  },
  tabChip: {
    paddingHorizontal: scale(14),
    paddingVertical: verticalScale(7),
    borderRadius: moderateScale(20),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  tabChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  /* ── Loading / Empty ── */
  loadingWrap: {
    paddingVertical: verticalScale(40),
    alignItems: "center",
  },
  emptyState: {
    paddingVertical: verticalScale(40),
    alignItems: "center",
  },
  emptyIconWrap: {
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(26),
    backgroundColor: colors.gray100,
    justifyContent: "center",
    alignItems: "center",
  },

  /* ── Request Card ── */
  requestTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bloodBadge: {
    width: moderateScale(46),
    height: moderateScale(46),
    borderRadius: moderateScale(12),
    backgroundColor: withOpacity(colors.primary, 0.09),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(20),
    gap: scale(4),
  },
  statusDot: {
    width: moderateScale(5),
    height: moderateScale(5),
    borderRadius: moderateScale(3),
  },

  /* ── Progress ── */
  progressSection: {},
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  progressTrack: {
    height: verticalScale(6),
    borderRadius: moderateScale(3),
    backgroundColor: colors.gray100,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: moderateScale(3),
  },

  /* ── Footer ── */
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(2),
  },
  footerDivider: {
    width: StyleSheet.hairlineWidth,
    height: verticalScale(18),
    backgroundColor: colors.gray300,
    marginHorizontal: scale(8),
  },
});

export default MyRequestsScreen;
