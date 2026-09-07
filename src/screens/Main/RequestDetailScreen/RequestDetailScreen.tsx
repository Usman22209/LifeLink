import React, { useState, useCallback, useMemo } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
  Linking,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { moderateScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenWrapper from "@components/ScreenWrapper";
import AppHeader from "@components/AppHeader";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { ROUTES } from "@utils/Routes";
import useTranslation from "@shared/hooks/useTranslation";
import { selectLanguage } from "@store/slices/appSlice";
import { useSelector } from "react-redux";
import { selectUser } from "@store/slices/authSlice";
import { useGetProfile } from "@shared/query/profile/useProfile";
import { requireCompleteProfile } from "@shared/utils/profileUtils";
import { useUserLocation, formatDistance } from "@shared/utils/locationService";
import { URGENCY_CONFIG } from "@screens/Main/FeedScreen/types";
import type { UserStackParamList } from "@shared/interfaces/navigation/navigation-params.interface";
import { getCityNameById, getProvinceByCityId } from "@shared/utils/cityUtils";
import { useAcceptBloodRequest, useMyDonations } from "@shared/query/donations/useDonations";
import { useBloodRequestDetails } from "@shared/query/blood-requests/useBloodRequests";
import { useChatThreads } from "@shared/query/chat/useChat";
import EligibilityChecklistModal from "@components/EligibilityChecklistModal";
import ReportModal from "@shared/components/ReportModal";

import { HeroBanner } from "./components/HeroBanner";
import { MedicalCaseNotesCard } from "./components/MedicalCaseNotesCard";
import { TimelineCard } from "./components/TimelineCard";
import { DetailsSheet } from "./components/DetailsSheet";
import { MapPreviewCard } from "./components/MapPreviewCard";
import { StickyFooterActions } from "./components/StickyFooterActions";
import { styles } from "./RequestDetailScreen.styles";

type RequestDetailScreenRouteProp = RouteProp<
  UserStackParamList,
  typeof ROUTES.REQUEST_DETAIL
>;

const RequestDetailScreen: React.FC = () => {
  const route = useRoute<RequestDetailScreenRouteProp>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const selectedLang = useSelector(selectLanguage);
  const userLocation = useUserLocation();

  const rawRequest: any = route.params?.request || {};

  const { data: requestDetails } = useBloodRequestDetails(rawRequest.id, !!rawRequest.id);
  const detailData: any = requestDetails?.data || requestDetails || {};

  // Fetch existing chat threads to avoid duplicate thread creation
  const { data: chatThreadsData } = useChatThreads();
  const threadsList = Array.isArray(chatThreadsData?.data)
    ? chatThreadsData.data
    : Array.isArray(chatThreadsData)
    ? chatThreadsData
    : [];

  // Fetch user donations to check if already pledged for this request
  const { data: myDonationsData } = useMyDonations();
  const myDonationsList: any[] = Array.isArray(myDonationsData?.history)
    ? myDonationsData.history
    : Array.isArray(myDonationsData?.data)
    ? myDonationsData.data
    : Array.isArray(myDonationsData)
    ? myDonationsData
    : [];

  // Normalize request schema to handle both camelCase and backend snake_case properties
  const request = useMemo(() => {
    const combined = { ...rawRequest, ...detailData };
    return {
      ...combined,
      id: combined.id || "",
      patientName: combined.patientName || combined.patient_name || "Anonymous Patient",
      bloodType: combined.bloodType || combined.blood_group || "O+",
      hospital: combined.hospital || combined.hospital_name || "Hospital",
      city: combined.city || combined.city_id || "",
      units: combined.units || combined.units_required || 1,
      urgency: (combined.urgency || "normal").toLowerCase(),
      time: combined.time || "Recently",
      time_left: combined.time_left || "",
      patientImage: combined.patientImage || combined.patient_image || combined.requester?.profile_image,
      latitude: combined.latitude ? Number(combined.latitude) : undefined,
      longitude: combined.longitude ? Number(combined.longitude) : undefined,
      distance: combined.distance || "",
      requester_id: combined.requester_id || combined.requesterId || combined.requester?.id,
      contact_number: combined.contact_number || combined.contactNumber || combined.requester?.phone,
      hide_phone_number: Boolean(
        combined.hide_phone_number ||
        combined.requester?.hide_phone_number ||
        detailData.hide_phone_number ||
        detailData.requester?.hide_phone_number
      ),
    };
  }, [rawRequest, detailData]);

  const existingThread = useMemo(() => {
    if (!request.id) return null;
    return threadsList.find(
      (t: any) =>
        String(t.request_id || t.request?.id) === String(request.id)
    );
  }, [threadsList, request.id]);

  const existingDonation = useMemo(() => {
    if (!request.id) return null;
    return myDonationsList.find(
      (d: any) =>
        (String(d.request?.id || d.request_id) === String(request.id) ||
          String(d.requestId) === String(request.id)) &&
        d.status !== "cancelled"
    );
  }, [myDonationsList, request.id]);

  const donationPledged = Boolean(existingDonation && existingDonation.status === "intent");
  const donationCompleted = Boolean(existingDonation && existingDonation.status === "completed");

  const cityName = useMemo(
    () => getCityNameById(request.city, selectedLang),
    [request.city, selectedLang],
  );

  const provinceName = useMemo(
    () => getProvinceByCityId(request.city),
    [request.city],
  );

  const computedDist = formatDistance(userLocation, {
    latitude: request.latitude,
    longitude: request.longitude,
  });

  const displayDistance = computedDist
    ? `${computedDist} away`
    : request.distance && request.distance !== "N/A" && request.distance !== "0 km"
    ? `${request.distance} away`
    : "";

  const mapOverlayText = [cityName, displayDistance].filter(Boolean).join(" · ");

  const [matchSheetVisible, setMatchSheetVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const { mutateAsync: acceptBloodRequestMutate, isPending: isAccepting } =
    useAcceptBloodRequest();

  const urgencyKey = (request?.urgency?.toLowerCase() || "normal") as keyof typeof URGENCY_CONFIG;
  const cfg = URGENCY_CONFIG[urgencyKey] || URGENCY_CONFIG.normal;

  const reduxUser = useSelector(selectUser);
  const { data: profile } = useGetProfile();
  const rawUser = profile?.data || profile?.user || profile?.profile || profile || reduxUser;
  const user = rawUser?.user || rawUser?.profile || rawUser;
  const currentUserId = user?.id || reduxUser?.id;

  const requesterId =
    detailData?.requester_id ||
    detailData?.requesterId ||
    detailData?.requester?.id ||
    request?.requester_id ||
    rawRequest?.requester_id ||
    rawRequest?.requesterId ||
    rawRequest?.requester?.id;

  const isOwner = Boolean(
    currentUserId &&
      requesterId &&
      String(currentUserId).trim().toLowerCase() === String(requesterId).trim().toLowerCase()
  );

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `🚨 ${t("feed.title")}: ${request.bloodType} required for ${request.patientName} at ${request.hospital}, ${cityName || "nearby"}. Please help save a life!`,
      });
    } catch (error: any) {
      console.log("Error sharing request:", error.message);
    }
  }, [request, cityName, t]);

  const handleContact = useCallback(() => {
    if (isOwner) {
      (navigation as any).navigate(ROUTES.MY_REQUESTS);
      return;
    }
    if (user && !requireCompleteProfile(user, navigation, t)) {
      return;
    }
    (navigation as any).navigate(ROUTES.CHAT, {
      request,
      threadId: existingThread?.id,
    });
  }, [navigation, request, user, t, isOwner, existingThread]);

  const handleManageRequest = useCallback(() => {
    (navigation as any).navigate(ROUTES.MY_REQUESTS);
  }, [navigation]);

  const handleConfirmMatch = useCallback(async () => {
    if (user && !requireCompleteProfile(user, navigation, t)) {
      return;
    }
    if (!request.id) return;
    try {
      await acceptBloodRequestMutate(request.id);
      setMatchSheetVisible(false);

      Alert.alert(
        "Donation Pledged! 🎉",
        `Thank you for offering to save a life!\n\nWe have initiated a chat thread with the requester for ${request.hospital}.`,
        [
          {
            text: "Open Chat",
            onPress: () =>
              (navigation as any).navigate(ROUTES.CHAT, {
                request,
                threadId: existingThread?.id,
              }),
          },
        ],
      );
    } catch (err: any) {
      setMatchSheetVisible(false);
      Alert.alert("Error", err?.message || "Could not respond to request.");
    }
  }, [acceptBloodRequestMutate, request, navigation, user, t, existingThread]);

  const canCall = Boolean(
    !isOwner &&
      !request.hide_phone_number &&
      (request.contact_number || request.contactNumber)
  );

  const handleCall = useCallback(() => {
    const rawPhone = request.contact_number || request.contactNumber;
    if (!rawPhone) {
      Alert.alert(
        "Direct Call Unavailable",
        "This user prefers in-app chat. Please tap Message to contact them directly.",
      );
      return;
    }
    const cleanPhone = String(rawPhone).replace(/[^\d+]/g, "");
    const phoneUrl = `tel:${cleanPhone}`;
    Linking.canOpenURL(phoneUrl)
      .then((supported) => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert(
            "Cannot Make Call",
            `Unable to initiate phone call to ${rawPhone} on this device.`,
          );
        }
      })
      .catch(() => {
        Linking.openURL(phoneUrl);
      });
  }, [request]);

  const handleNavigate = useCallback(() => {
    const query = encodeURIComponent(`${request.hospital}, ${cityName || request.city}`);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
    Linking.openURL(url).catch((err) => {
      console.log("Error launching native maps:", err.message);
      Alert.alert(
        "Navigation Error",
        "Could not launch map directions automatically.",
      );
    });
  }, [request, cityName]);

  return (
    <View style={styles.wrapper}>
      <ScreenWrapper
        backgroundColor={colors.background}
        safeArea
        scrollable={false}
        header={
          <AppHeader
            title={t("requestDetail.title")}
            showBackButton
            onBackPress={() => navigation.goBack()}
            rightComponent={
              <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
                <TouchableOpacity
                  onPress={handleShare}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <AnyIcon
                    type={Icons.Feather}
                    name="share-2"
                    size={moderateScale(18)}
                    color={colors.text}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setReportModalVisible(true)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <AnyIcon
                    type={Icons.Feather}
                    name="flag"
                    size={moderateScale(17)}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              </View>
            }
            titleSize={15}
            hasBorder={true}
          />
        }
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Cardless Hero Banner */}
          <HeroBanner
            request={request}
            cfg={cfg}
            displayDistance={displayDistance}
          />

          {/* Medical Case Notes */}
          <MedicalCaseNotesCard bloodType={request.bloodType} />

          {/* Donation Step Timeline */}
          <TimelineCard request={request} cityName={cityName} />

          {/* Unified Details Sheet */}
          <DetailsSheet
            request={request}
            cityName={cityName}
            provinceName={provinceName}
          />

          {/* Vector Map Preview Card (Android only) */}
          <MapPreviewCard
            request={request}
            mapOverlayText={mapOverlayText}
            onNavigate={handleNavigate}
          />
        </ScrollView>

        {/* Sticky Actions Footer */}
        <StickyFooterActions
          insetsBottom={insets.bottom}
          isOwner={isOwner}
          canCall={canCall}
          donationPledged={donationPledged}
          donationCompleted={donationCompleted}
          onCall={handleCall}
          onContact={handleContact}
          onDonate={() => {
            if (donationPledged) {
              Alert.alert(
                "Donation Pledged",
                "You have already offered to donate for this patient. The requester will confirm the donation once fulfilled at the hospital.",
                [
                  {
                    text: "View My Donations",
                    onPress: () => (navigation as any).navigate(ROUTES.MY_DONATIONS),
                  },
                  { text: "OK", style: "cancel" },
                ],
              );
              return;
            }
            if (donationCompleted) {
              Alert.alert(
                "Donation Completed",
                "Thank you! Your donation for this patient has already been confirmed as fulfilled.",
                [
                  {
                    text: "View My Donations",
                    onPress: () => (navigation as any).navigate(ROUTES.MY_DONATIONS),
                  },
                  { text: "OK", style: "cancel" },
                ],
              );
              return;
            }
            setMatchSheetVisible(true);
          }}
          onManageRequest={handleManageRequest}
          onViewMyDonations={() => (navigation as any).navigate(ROUTES.MY_DONATIONS)}
        />
      </ScreenWrapper>

      <EligibilityChecklistModal
        isVisible={matchSheetVisible}
        onClose={() => setMatchSheetVisible(false)}
        onConfirm={handleConfirmMatch}
        isLoading={isAccepting}
      />

      <ReportModal
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
        targetType="request"
        targetId={String(request.id)}
        targetTitle={`Request: ${request.patientName} (${request.bloodType})`}
      />
    </View>
  );
};

export default RequestDetailScreen;
