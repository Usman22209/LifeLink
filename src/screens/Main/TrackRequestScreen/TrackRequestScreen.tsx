import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { useRoute, useNavigation } from "@react-navigation/native";
import ScreenWrapper from "@components/ScreenWrapper";
import AppHeader from "@components/AppHeader";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import { ROUTES } from "@utils/Routes";
import { useBloodRequestDetails, useUpdateBloodRequest } from "@shared/query/blood-requests/useBloodRequests";
import { useDonationsForRequest, useUpdateDonationStatus } from "@shared/query/donations/useDonations";
import { DonationStatus, BloodRequestStatus } from "@shared/interfaces/models/blood-request.interface";

const PAD = scale(16);

const TrackRequestScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { requestId, request: initialRequest } = route.params || {};

  const { data: requestDetailData, isLoading: isReqLoading, refetch: refetchReq } =
    useBloodRequestDetails(requestId, true);

  const request = requestDetailData?.data || requestDetailData || initialRequest || {};

  const { data: donationsData, isLoading: isDonationsLoading } =
    useDonationsForRequest(requestId, true);

  const { mutateAsync: updateDonationStatus, isPending: isUpdatingDonation } =
    useUpdateDonationStatus();

  const { mutateAsync: updateRequestStatus, isPending: isUpdatingReq } =
    useUpdateBloodRequest();

  const rawDonations: any = donationsData;
  const donationsList = rawDonations?.data?.donations || rawDonations?.donations || [];

  const unitsRequired = request.units_required || request.units || 1;
  const fulfilledUnits = request.fulfilled_units || request.fulfilledUnits || 0;
  const unitsRemaining = Math.max(0, unitsRequired - fulfilledUnits);
  const progressPercent = Math.min(100, Math.round((fulfilledUnits / unitsRequired) * 100));
  const isExpired = request.status === "expired" || request.is_expired;
  const isFulfilled = request.status === "fulfilled" || request.status === "completed";

  const urgencyKey = (request.urgency || "normal").toLowerCase();
  const urgencyColor =
    urgencyKey === "critical"
      ? colors.danger
      : urgencyKey === "high" || urgencyKey === "urgent"
      ? colors.warning
      : colors.info;

  const statusLabel = isFulfilled
    ? "Fulfilled"
    : isExpired
    ? "Expired"
    : "Active";
  const statusColor = isFulfilled
    ? colors.success
    : isExpired
    ? colors.textSecondary
    : colors.success;

  const handleConfirmUnitReceived = async (donationId: string, donorName: string) => {
    Alert.alert(
      "Confirm Donation",
      `Did ${donorName} donate 1 unit of blood?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Confirm",
          onPress: async () => {
            try {
              await updateDonationStatus({
                donationId,
                status: DonationStatus.COMPLETED,
              });
              refetchReq();
              Alert.alert("Success! 🎉", "Donation marked as received.");
            } catch (err: any) {
              Alert.alert("Error", err?.message || "Could not update donation status.");
            }
          },
        },
      ]
    );
  };

  const handleCloseRequest = async () => {
    Alert.alert(
      "Close Request",
      "Mark this request as fulfilled and close it?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Close Request",
          style: "destructive",
          onPress: async () => {
            try {
              await updateRequestStatus({
                id: requestId,
                data: { status: BloodRequestStatus.FULFILLED },
              });
              refetchReq();
              Alert.alert("Done", "Request has been marked as fulfilled.");
            } catch (err: any) {
              Alert.alert("Error", err?.message || "Could not close request.");
            }
          },
        },
      ]
    );
  };

  if (isReqLoading) {
    return (
      <ScreenWrapper backgroundColor={colors.background} safeArea>
        <AppHeader title="Track Request" showBackButton onBackPress={() => navigation.goBack()} />
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper backgroundColor={colors.background} safeArea>
      <AppHeader
        title="Track Request"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Patient Summary Card ─── */}
        <View style={styles.card}>
          <View style={styles.patientRow}>
            <View style={styles.bloodBadge}>
              <Text extraBold FONT_16 style={{ color: colors.primary }}>
                {request.blood_group || request.bloodType || "O+"}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text semiBold FONT_14 style={{ color: colors.text }} numberOfLines={1}>
                {request.patient_name || request.patientName || "Blood Request"}
              </Text>
              <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: verticalScale(2) }} numberOfLines={1}>
                {request.hospital_name || request.hospital || "Hospital"}
              </Text>
            </View>
            <View style={[styles.statusPill, { backgroundColor: withOpacity(statusColor, 0.1) }]}>
              <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
              <Text bold FONT_10 style={{ color: statusColor }}>
                {statusLabel}
              </Text>
            </View>
          </View>

          {/* Urgency + Time Left row */}
          <View style={styles.cardDivider} />
          <View style={styles.infoRow}>
            <View style={styles.infoChip}>
              <AnyIcon type={Icons.Feather} name="alert-circle" size={moderateScale(12)} color={urgencyColor} />
              <Text semiBold FONT_11 style={{ color: urgencyColor, marginLeft: scale(4) }}>
                {(request.urgency || "Normal").charAt(0).toUpperCase() + (request.urgency || "normal").slice(1)}
              </Text>
            </View>
            {request.time_left && !isExpired ? (
              <View style={styles.infoChip}>
                <AnyIcon type={Icons.Feather} name="clock" size={moderateScale(12)} color={colors.textSecondary} />
                <Text regular FONT_11 style={{ color: colors.textSecondary, marginLeft: scale(4) }}>
                  {request.time_left}
                </Text>
              </View>
            ) : null}
            <View style={styles.infoChip}>
              <AnyIcon type={Icons.Feather} name="droplet" size={moderateScale(12)} color={colors.primary} />
              <Text regular FONT_11 style={{ color: colors.textSecondary, marginLeft: scale(4) }}>
                {unitsRequired} unit{unitsRequired > 1 ? "s" : ""}
              </Text>
            </View>
          </View>
        </View>

        {/* ─── Progress Card ─── */}
        <View style={styles.card}>
          <View style={styles.progressHeader}>
            <Text semiBold FONT_13 style={{ color: colors.text }}>
              Donation Progress
            </Text>
            <Text bold FONT_14 style={{ color: progressPercent >= 100 ? colors.success : colors.primary }}>
              {progressPercent}%
            </Text>
          </View>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progressPercent}%`,
                  backgroundColor: progressPercent >= 100 ? colors.success : colors.primary,
                },
              ]}
            />
          </View>

          {/* Stats 2×2 Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statsGridRow}>
              <View style={styles.statItem}>
                <Text bold FONT_18 style={{ color: colors.success }}>
                  {fulfilledUnits}
                </Text>
                <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: verticalScale(2) }}>
                  Received
                </Text>
              </View>
              <View style={styles.statVerticalDivider} />
              <View style={styles.statItem}>
                <Text bold FONT_18 style={{ color: unitsRemaining > 0 ? colors.danger : colors.success }}>
                  {unitsRemaining}
                </Text>
                <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: verticalScale(2) }}>
                  Remaining
                </Text>
              </View>
            </View>
            <View style={styles.statsHorizontalDivider} />
            <View style={styles.statsGridRow}>
              <View style={styles.statItem}>
                <Text bold FONT_18 style={{ color: colors.text }}>
                  {unitsRequired}
                </Text>
                <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: verticalScale(2) }}>
                  Total Needed
                </Text>
              </View>
              <View style={styles.statVerticalDivider} />
              <View style={styles.statItem}>
                <Text bold FONT_18 style={{ color: colors.info }}>
                  {donationsList.length}
                </Text>
                <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: verticalScale(2) }}>
                  Pledged
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ─── Donors Section ─── */}
        <View style={styles.sectionHeader}>
          <Text semiBold FONT_14 style={{ color: colors.text }}>
            Responding Donors
          </Text>
          <Text regular FONT_11 style={{ color: colors.textSecondary }}>
            {donationsList.length} donor{donationsList.length !== 1 ? "s" : ""}
          </Text>
        </View>

        {isDonationsLoading ? (
          <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: verticalScale(20) }} />
        ) : donationsList.length === 0 ? (
          <View style={styles.card}>
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <AnyIcon type={Icons.Feather} name="users" size={moderateScale(22)} color={colors.textSecondary} />
              </View>
              <Text semiBold FONT_13 style={{ color: colors.text, marginTop: verticalScale(10) }}>
                No Donors Yet
              </Text>
              <Text regular FONT_11 style={{ color: colors.textSecondary, textAlign: "center", marginTop: verticalScale(4), lineHeight: moderateScale(16) }}>
                Matching donors in your area are being notified about this request.
              </Text>
            </View>
          </View>
        ) : (
          donationsList.map((donation: any) => {
            const donorName = donation.donor?.full_name || "Volunteer Donor";
            const donorPhone = donation.donor?.phone || "";
            const isCompleted = donation.status === "completed";

            return (
              <View key={donation.id} style={styles.card}>
                <View style={styles.donorRow}>
                  <View style={styles.donorAvatar}>
                    <Text bold FONT_13 style={{ color: colors.primary }}>
                      {donorName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text semiBold FONT_13 style={{ color: colors.text }} numberOfLines={1}>
                      {donorName}
                    </Text>
                    {donorPhone ? (
                      <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: verticalScale(1) }}>
                        {donorPhone}
                      </Text>
                    ) : null}
                  </View>
                  <View
                    style={[
                      styles.donorBadge,
                      {
                        backgroundColor: isCompleted
                          ? withOpacity(colors.success, 0.1)
                          : withOpacity(colors.warning, 0.1),
                      },
                    ]}
                  >
                    <Text bold FONT_10 style={{ color: isCompleted ? colors.success : colors.warning }}>
                      {isCompleted ? "Donated" : "Pledged"}
                    </Text>
                  </View>
                </View>

                {/* Action buttons */}
                <View style={styles.cardDivider} />
                <View style={styles.donorActions}>
                  <TouchableOpacity
                    style={styles.actionBtnOutline}
                    activeOpacity={0.7}
                    onPress={() =>
                      navigation.navigate(ROUTES.CHAT, {
                        request: {
                          ...request,
                          id: requestId,
                          patientName: request.patient_name || request.patientName,
                          bloodType: request.blood_group || request.bloodType,
                          hospital: request.hospital_name || request.hospital,
                          city: request.city_id || request.city,
                        },
                      })
                    }
                  >
                    <AnyIcon type={Icons.Feather} name="message-circle" size={moderateScale(13)} color={colors.text} />
                    <Text semiBold FONT_11 style={{ color: colors.text, marginLeft: scale(5) }}>
                      Message
                    </Text>
                  </TouchableOpacity>

                  {!isCompleted ? (
                    <TouchableOpacity
                      style={styles.actionBtnPrimary}
                      activeOpacity={0.8}
                      onPress={() => handleConfirmUnitReceived(donation.id, donorName)}
                      disabled={isUpdatingDonation}
                    >
                      <AnyIcon type={Icons.Feather} name="check" size={moderateScale(13)} color={colors.white} />
                      <Text semiBold FONT_11 style={{ color: colors.white, marginLeft: scale(5) }}>
                        Confirm Received
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            );
          })
        )}

        {/* ─── Close Request Button ─── */}
        {!isFulfilled && !isExpired ? (
          <TouchableOpacity
            style={styles.closeBtn}
            activeOpacity={0.8}
            onPress={handleCloseRequest}
            disabled={isUpdatingReq}
          >
            <AnyIcon type={Icons.Feather} name="x-circle" size={moderateScale(14)} color={colors.danger} />
            <Text semiBold FONT_12 style={{ color: colors.danger, marginLeft: scale(6) }}>
              Close Request
            </Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: PAD,
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(30),
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
  cardDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.gray300,
    marginVertical: verticalScale(10),
  },

  /* ── Patient Summary ── */
  patientRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bloodBadge: {
    width: moderateScale(46),
    height: moderateScale(46),
    borderRadius: moderateScale(12),
    backgroundColor: withOpacity(colors.primary, 0.09),
    alignItems: "center",
    justifyContent: "center",
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
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(14),
  },
  infoChip: {
    flexDirection: "row",
    alignItems: "center",
  },

  /* ── Progress ── */
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(10),
  },
  progressTrack: {
    height: verticalScale(8),
    borderRadius: moderateScale(4),
    backgroundColor: colors.gray100,
    overflow: "hidden",
    marginBottom: verticalScale(14),
  },
  progressFill: {
    height: "100%",
    borderRadius: moderateScale(4),
  },
  statsGrid: {
    backgroundColor: colors.gray100,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(12),
  },
  statsGridRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
    flex: 1,
    paddingVertical: verticalScale(4),
  },
  statVerticalDivider: {
    width: 1,
    height: verticalScale(28),
    backgroundColor: colors.gray300,
  },
  statsHorizontalDivider: {
    height: 1,
    backgroundColor: colors.gray300,
    marginHorizontal: scale(20),
    marginVertical: verticalScale(8),
  },

  /* ── Section Header ── */
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(10),
    marginTop: verticalScale(4),
  },

  /* ── Empty State ── */
  emptyState: {
    alignItems: "center",
    paddingVertical: verticalScale(16),
  },
  emptyIconWrap: {
    width: moderateScale(48),
    height: moderateScale(48),
    borderRadius: moderateScale(24),
    backgroundColor: colors.gray100,
    alignItems: "center",
    justifyContent: "center",
  },

  /* ── Donor Card ── */
  donorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  donorAvatar: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: withOpacity(colors.primary, 0.09),
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(10),
  },
  donorBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(20),
  },
  donorActions: {
    flexDirection: "row",
    gap: scale(8),
  },
  actionBtnOutline: {
    flex: 1,
    height: verticalScale(34),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: colors.gray300,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.white,
  },
  actionBtnPrimary: {
    flex: 1.3,
    height: verticalScale(34),
    borderRadius: moderateScale(10),
    backgroundColor: colors.success,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  /* ── Close Button ── */
  closeBtn: {
    height: verticalScale(44),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: withOpacity(colors.danger, 0.25),
    backgroundColor: withOpacity(colors.danger, 0.04),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(4),
  },
});

export default TrackRequestScreen;
