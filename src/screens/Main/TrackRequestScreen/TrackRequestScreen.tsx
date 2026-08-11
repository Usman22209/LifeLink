import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
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

  const handleConfirmUnitReceived = async (donationId: string, donorName: string) => {
    Alert.alert(
      "Confirm Blood Donation",
      `Did ${donorName} successfully donate 1 unit of blood for this request?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes, Confirm Received",
          onPress: async () => {
            try {
              await updateDonationStatus({
                donationId,
                status: DonationStatus.COMPLETED,
              });
              refetchReq();
              Alert.alert("Success! 🎉", "Donation progress updated successfully!");
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
      "Close Blood Request",
      "Are you sure you want to mark this request as fulfilled and close it?",
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
              Alert.alert("Closed", "Blood request has been marked as fulfilled.");
            } catch (err: any) {
              Alert.alert("Error", err?.message || "Could not close request.");
            }
          },
        },
      ]
    );
  };

  return (
    <ScreenWrapper backgroundColor={colors.background} safeArea>
      <AppHeader
        title="Track Request Progress"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Patient & Request Summary Card */}
        <View style={styles.requestHeroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.bloodPill}>
              <Text extraBold FONT_16 style={{ color: colors.primary }}>
                {request.blood_group || request.bloodType || "O+"}
              </Text>
            </View>
            <View style={styles.heroTextWrap}>
              <Text bold FONT_16 style={{ color: colors.text }}>
                {request.patient_name || request.patientName || "Blood Request"}
              </Text>
              <Text regular FONT_11 style={{ color: colors.textSecondary }}>
                {request.hospital_name || request.hospital || "Hospital"}
              </Text>
            </View>
            <View
              style={[
                styles.urgencyBadge,
                {
                  backgroundColor: isExpired
                    ? withOpacity(colors.textSecondary, 0.1)
                    : withOpacity(colors.danger, 0.1),
                },
              ]}
            >
              <Text
                bold
                FONT_10
                style={{
                  color: isExpired ? colors.textSecondary : colors.danger,
                }}
              >
                {isExpired ? "EXPIRED" : request.time_left || "ACTIVE"}
              </Text>
            </View>
          </View>
        </View>

        {/* Live Progress Card */}
        <View style={styles.progressCard}>
          <View style={styles.progressCardHeader}>
            <View style={styles.progressTitleRow}>
              <AnyIcon
                type={Icons.Feather}
                name="pie-chart"
                size={moderateScale(16)}
                color={colors.primary}
              />
              <Text bold FONT_14 style={styles.progressCardTitle}>
                Donation Completion
              </Text>
            </View>
            <Text bold FONT_14 style={{ color: colors.primary }}>
              {progressPercent}%
            </Text>
          </View>

          {/* Bar */}
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>

          {/* Metrics Grid */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricBox}>
              <Text bold FONT_16 style={{ color: colors.success }}>
                {fulfilledUnits}
              </Text>
              <Text regular FONT_10 style={styles.metricLabel}>
                Received
              </Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricBox}>
              <Text bold FONT_16 style={{ color: colors.danger }}>
                {unitsRemaining}
              </Text>
              <Text regular FONT_10 style={styles.metricLabel}>
                Units Left
              </Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricBox}>
              <Text bold FONT_16 style={{ color: colors.text }}>
                {unitsRequired}
              </Text>
              <Text regular FONT_10 style={styles.metricLabel}>
                Total Needed
              </Text>
            </View>
          </View>
        </View>

        {/* Responding Donors Section */}
        <View style={styles.sectionHeader}>
          <AnyIcon
            type={Icons.Feather}
            name="users"
            size={moderateScale(16)}
            color={colors.primary}
          />
          <Text bold FONT_15 style={styles.sectionTitle}>
            Pledged Donors ({donationsList.length})
          </Text>
        </View>

        {isDonationsLoading ? (
          <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} />
        ) : donationsList.length === 0 ? (
          <View style={styles.emptyDonorsCard}>
            <AnyIcon
              type={Icons.Feather}
              name="clock"
              size={moderateScale(28)}
              color={colors.textSecondary}
            />
            <Text bold FONT_13 style={{ color: colors.text, marginTop: verticalScale(8) }}>
              No Donors Pledged Yet
            </Text>
            <Text regular FONT_11 style={styles.emptySub}>
              Matching donors in your city are being notified of your emergency.
            </Text>
          </View>
        ) : (
          donationsList.map((donation: any) => {
            const donorName = donation.donor?.full_name || "Volunteer Donor";
            const donorPhone = donation.donor?.phone || "";
            const donorBlood = donation.donor?.blood_group || request.blood_group || "Match";
            const isCompleted = donation.status === "completed";

            return (
              <View key={donation.id} style={styles.donorCard}>
                <View style={styles.donorHeader}>
                  <View style={styles.donorAvatar}>
                    <Text bold FONT_14 style={{ color: colors.primary }}>
                      {donorName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.donorInfo}>
                    <Text bold FONT_14 style={{ color: colors.text }}>
                      {donorName}
                    </Text>
                    {donorPhone ? (
                      <Text regular FONT_11 style={{ color: colors.textSecondary }}>
                        {donorPhone}
                      </Text>
                    ) : null}
                  </View>
                  <View
                    style={[
                      styles.donorStatusBadge,
                      {
                        backgroundColor: isCompleted
                          ? withOpacity(colors.success, 0.1)
                          : withOpacity(colors.warning, 0.1),
                      },
                    ]}
                  >
                    <Text
                      bold
                      FONT_10
                      style={{
                        color: isCompleted ? colors.success : colors.warning,
                      }}
                    >
                      {isCompleted ? "DONATED ✅" : "PLEDGED ⏱️"}
                    </Text>
                  </View>
                </View>

                {/* Donor Actions */}
                <View style={styles.donorActionsRow}>
                  <TouchableOpacity
                    style={styles.chatBtn}
                    activeOpacity={0.75}
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
                    <AnyIcon
                      type={Icons.Feather}
                      name="message-square"
                      size={moderateScale(13)}
                      color={colors.text}
                    />
                    <Text bold FONT_11 style={{ color: colors.text, marginLeft: scale(4) }}>
                      Message
                    </Text>
                  </TouchableOpacity>

                  {!isCompleted ? (
                    <TouchableOpacity
                      style={styles.confirmBtn}
                      activeOpacity={0.8}
                      onPress={() => handleConfirmUnitReceived(donation.id, donorName)}
                      disabled={isUpdatingDonation}
                    >
                      <AnyIcon
                        type={Icons.Feather}
                        name="check-circle"
                        size={moderateScale(13)}
                        color={colors.white}
                      />
                      <Text bold FONT_11 style={{ color: colors.white, marginLeft: scale(4) }}>
                        Mark 1 Unit Received
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            );
          })
        )}

        {/* Close Request Button */}
        {request.status !== "fulfilled" && request.status !== "completed" ? (
          <TouchableOpacity
            style={styles.closeRequestBtn}
            activeOpacity={0.8}
            onPress={handleCloseRequest}
            disabled={isUpdatingReq}
          >
            <AnyIcon
              type={Icons.Feather}
              name="check-square"
              size={moderateScale(14)}
              color={colors.error}
            />
            <Text bold FONT_12 style={{ color: colors.error, marginLeft: scale(6) }}>
              Close Request Early
            </Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(28),
  },
  requestHeroCard: {
    backgroundColor: colors.card,
    borderRadius: moderateScale(16),
    padding: moderateScale(14),
    marginBottom: verticalScale(14),
    borderWidth: 1,
    borderColor: colors.border,
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  bloodPill: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(12),
    backgroundColor: withOpacity(colors.primary, 0.1),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(10),
  },
  heroTextWrap: {
    flex: 1,
  },
  urgencyBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(8),
  },
  progressCard: {
    backgroundColor: colors.card,
    borderRadius: moderateScale(16),
    padding: moderateScale(16),
    marginBottom: verticalScale(20),
    borderWidth: 1,
    borderColor: colors.border,
  },
  progressCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  progressTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressCardTitle: {
    color: colors.text,
    marginLeft: scale(8),
  },
  progressBarTrack: {
    height: verticalScale(10),
    borderRadius: moderateScale(5),
    backgroundColor: colors.gray100 || colors.border,
    overflow: "hidden",
    marginBottom: verticalScale(16),
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: moderateScale(5),
  },
  metricsGrid: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: colors.background,
    borderRadius: moderateScale(12),
    paddingVertical: verticalScale(10),
  },
  metricBox: {
    alignItems: "center",
  },
  metricLabel: {
    color: colors.textSecondary,
    marginTop: verticalScale(2),
  },
  metricDivider: {
    width: 1,
    height: verticalScale(20),
    backgroundColor: colors.border,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  sectionTitle: {
    color: colors.text,
    marginLeft: scale(8),
  },
  emptyDonorsCard: {
    backgroundColor: colors.card,
    borderRadius: moderateScale(16),
    paddingVertical: verticalScale(28),
    paddingHorizontal: scale(16),
    alignItems: "center",
    marginBottom: verticalScale(20),
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptySub: {
    color: colors.textSecondary,
    textAlign: "center",
    marginTop: verticalScale(4),
  },
  donorCard: {
    backgroundColor: colors.card,
    borderRadius: moderateScale(16),
    padding: moderateScale(14),
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: colors.border,
  },
  donorHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  donorAvatar: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: withOpacity(colors.primary, 0.1),
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(10),
  },
  donorInfo: {
    flex: 1,
  },
  donorStatusBadge: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(8),
  },
  donorActionsRow: {
    flexDirection: "row",
    gap: scale(8),
  },
  chatBtn: {
    flex: 1,
    height: verticalScale(36),
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  confirmBtn: {
    flex: 1.4,
    height: verticalScale(36),
    borderRadius: moderateScale(10),
    backgroundColor: colors.success,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  closeRequestBtn: {
    height: verticalScale(44),
    borderRadius: moderateScale(12),
    borderWidth: 1,
    borderColor: withOpacity(colors.error, 0.3),
    backgroundColor: withOpacity(colors.error, 0.05),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(12),
  },
});

export default TrackRequestScreen;
