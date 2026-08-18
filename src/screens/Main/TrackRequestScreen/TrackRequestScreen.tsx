import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { useRoute, useNavigation } from "@react-navigation/native";
import ScreenWrapper from "@components/ScreenWrapper";
import AppHeader from "@components/AppHeader";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { ROUTES } from "@utils/Routes";
import { useBloodRequestDetails, useUpdateBloodRequest } from "@shared/query/blood-requests/useBloodRequests";
import { useDonationsForRequest, useUpdateDonationStatus } from "@shared/query/donations/useDonations";
import { DonationStatus, BloodRequestStatus } from "@shared/interfaces/models/blood-request.interface";

import { PatientSummaryCard } from "./components/PatientSummaryCard";
import { DonationProgressCard } from "./components/DonationProgressCard";
import { DonorCard } from "./components/DonorCard";
import { styles } from "./TrackRequestScreen.styles";

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
        {/* Patient Summary Card */}
        <PatientSummaryCard
          request={request}
          unitsRequired={unitsRequired}
          isExpired={isExpired}
          isFulfilled={isFulfilled}
        />

        {/* Progress Card */}
        <DonationProgressCard
          progressPercent={progressPercent}
          fulfilledUnits={fulfilledUnits}
          unitsRemaining={unitsRemaining}
          unitsRequired={unitsRequired}
          donationsCount={donationsList.length}
        />

        {/* Donors Section Header */}
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
          donationsList.map((donation: any) => (
            <DonorCard
              key={donation.id}
              donation={donation}
              isUpdatingDonation={isUpdatingDonation}
              onConfirmReceived={handleConfirmUnitReceived}
              onMessage={() =>
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
            />
          ))
        )}

        {/* Close Request Button */}
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

export default TrackRequestScreen;
