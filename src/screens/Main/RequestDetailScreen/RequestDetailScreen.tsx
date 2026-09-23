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
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { ROUTES } from "@utils/Routes";
import useTranslation from "@shared/hooks/useTranslation";
import { selectLanguage } from "@store/slices/appSlice";
import { useSelector } from "react-redux";
import { selectUser } from "@store/slices/authSlice";
import { useGetProfile, usePublicProfile } from "@shared/query/profile/useProfile";
import {
  requireCompleteProfile,
  isProfileComplete,
} from "@shared/utils/profileUtils";
import { useUserLocation, formatDistance } from "@shared/utils/locationService";
import { URGENCY_CONFIG } from "@screens/Main/FeedScreen/types";
import type { UserStackParamList } from "@shared/interfaces/navigation/navigation-params.interface";
import { getCityNameById, getProvinceByCityId } from "@shared/utils/cityUtils";
import {
  useAcceptBloodRequest,
  useMyDonations,
} from "@shared/query/donations/useDonations";
import { useBloodRequestDetails } from "@shared/query/blood-requests/useBloodRequests";
import { useChatThreads } from "@shared/query/chat/useChat";
import EligibilityChecklistModal from "@components/EligibilityChecklistModal";
import ReportModal from "@shared/components/ReportModal";
import DonationPledgedModal from "@components/DonationPledgedModal";

import { HeroBanner } from "./components/HeroBanner";
import { MedicalCaseNotesCard } from "./components/MedicalCaseNotesCard";
import { BloodCompatibilityCard } from "./components/BloodCompatibilityCard";
import { TimelineCard } from "./components/TimelineCard";
import { DetailsSheet } from "./components/DetailsSheet";
import { MapPreviewCard } from "./components/MapPreviewCard";
import { StickyFooterActions } from "./components/StickyFooterActions";
import { isBloodCompatible } from "@shared/utils/bloodCompatibility";
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

  const reduxUser = useSelector(selectUser);
  const { data: profile } = useGetProfile();
  const rawUser =
    profile?.data || profile?.user || profile?.profile || profile || reduxUser;
  const user = rawUser?.user || rawUser?.profile || rawUser;
  const currentUserId = user?.id || reduxUser?.id;
  const currentUserPhone = String(
    user?.phone ||
    (user as any)?.contact_number ||
    reduxUser?.phone ||
    "",
  ).replace(/[^\d]/g, "");

  const rawParams: any = route.params || {};
  const rawRequest: any =
    rawParams.request ||
    (rawParams.requestId ? { id: rawParams.requestId } : null) ||
    (rawParams.id ? { id: rawParams.id } : null) ||
    rawParams ||
    {};

  const targetRequestId =
    rawRequest?.id || rawParams.requestId || rawParams.id;

  const { data: requestDetails } = useBloodRequestDetails(
    targetRequestId,
    !!targetRequestId,
  );
  const detailData: any = requestDetails?.data || requestDetails || {};

  const { data: chatThreadsData } = useChatThreads();
  const threadsList = Array.isArray(chatThreadsData?.data)
    ? chatThreadsData.data
    : Array.isArray(chatThreadsData)
      ? chatThreadsData
      : [];

  const { data: myDonationsData } = useMyDonations();
  const myDonationsList: any[] = Array.isArray(myDonationsData?.history)
    ? myDonationsData.history
    : Array.isArray(myDonationsData?.data)
      ? myDonationsData.data
      : Array.isArray(myDonationsData)
        ? myDonationsData
        : [];

  const resolvedRequesterId =
    detailData?.requester_id ||
    detailData?.requesterId ||
    detailData?.requester?.id ||
    detailData?.user_id ||
    rawRequest?.requester_id ||
    rawRequest?.requesterId ||
    rawRequest?.requester?.id ||
    rawRequest?.user_id;

  const rawReqPhone = String(
    detailData?.contact_number ||
    detailData?.contactNumber ||
    detailData?.requester?.phone ||
    rawRequest?.contact_number ||
    rawRequest?.contactNumber ||
    rawRequest?.requester?.phone ||
    "",
  ).replace(/[^\d]/g, "");

  const isOwner = useMemo(() => {
    if (!currentUserId || !resolvedRequesterId) {
      return false;
    }
    return (
      String(currentUserId).trim().toLowerCase() ===
      String(resolvedRequesterId).trim().toLowerCase()
    );
  }, [currentUserId, resolvedRequesterId]);

  const { data: requesterProfile, isLoading: isRequesterProfileLoading } =
    usePublicProfile(resolvedRequesterId, rawReqPhone);

  const shouldHidePhone = Boolean(
    (isOwner &&
      (user?.hide_phone_number ||
        reduxUser?.hide_phone_number ||
        profile?.hide_phone_number)) ||
    detailData?.hide_phone_number ||
    rawRequest?.hide_phone_number ||
    requesterProfile?.hide_phone_number ||
    requesterProfile?.data?.hide_phone_number ||
    detailData?.requester?.hide_phone_number ||
    rawRequest?.requester?.hide_phone_number,
  );

  const request = useMemo(() => {
    const combined = { ...rawRequest, ...detailData };

    return {
      ...combined,
      id: combined.id || targetRequestId || detailData?.id || rawRequest?.id || "",
      patientName:
        combined.patientName || combined.patient_name || "Anonymous Patient",
      bloodType: combined.bloodType || combined.blood_group || "O+",
      hospital: combined.hospital || combined.hospital_name || "Hospital",
      city: combined.city || combined.city_id || "",
      units: combined.units || combined.units_required || 1,
      urgency: (combined.urgency || "normal").toLowerCase(),
      time: combined.time || "Recently",
      time_left: combined.time_left || "",
      patientImage:
        combined.patientImage ||
        combined.patient_image ||
        combined.requester?.profile_image ||
        requesterProfile?.profile_image,
      latitude: combined.latitude ? Number(combined.latitude) : undefined,
      longitude: combined.longitude ? Number(combined.longitude) : undefined,
      distance: combined.distance || "",
      requester_id:
        combined.requester_id ||
        combined.requesterId ||
        combined.requester?.id ||
        resolvedRequesterId,
      contact_number: shouldHidePhone
        ? undefined
        : combined.contact_number ||
          combined.contactNumber ||
          combined.requester?.phone,
      contactNumber: shouldHidePhone ? undefined : combined.contactNumber,
      hide_phone_number: shouldHidePhone,
    };
  }, [rawRequest, detailData, requesterProfile, resolvedRequesterId, shouldHidePhone]);

  const existingThread = useMemo(() => {
    if (!request.id) return null;
    return threadsList.find(
      (t: any) => String(t.request_id || t.request?.id) === String(request.id),
    );
  }, [threadsList, request.id]);

  const isFromMyDonations = Boolean(
    rawParams?.isFromMyDonations || rawRequest?.isFromMyDonations,
  );

  const passedDonationStatus =
    rawParams?.donationStatus ||
    rawRequest?.donationStatus ||
    (isFromMyDonations ? "intent" : null);

  const passedDonationId =
    rawParams?.donationId || rawRequest?.donationId;

  const existingDonation = useMemo(() => {
    if (!request.id && !passedDonationId) return null;
    return myDonationsList.find(
      (d: any) =>
        (request.id &&
          (String(d.request?.id || d.request_id) === String(request.id) ||
            String(d.requestId) === String(request.id) ||
            String(d.id) === String(request.id))) ||
        (passedDonationId && String(d.id) === String(passedDonationId)),
    );
  }, [myDonationsList, request.id, passedDonationId]);

  const [justPledged, setJustPledged] = useState(false);

  const effectiveDonationStatus =
    existingDonation?.status ||
    passedDonationStatus ||
    (isFromMyDonations ? "intent" : null);

  const donationCompleted =
    effectiveDonationStatus === "completed" ||
    effectiveDonationStatus === "fulfilled" ||
    Boolean(
      isFromMyDonations &&
        (request?.status === "fulfilled" || request?.status === "completed"),
    );

  const donationPledged =
    !donationCompleted &&
    (justPledged ||
      effectiveDonationStatus === "intent" ||
      isFromMyDonations ||
      Boolean(existingDonation && existingDonation.status !== "completed"));

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
    : request.distance &&
        request.distance !== "N/A" &&
        request.distance !== "0 km"
      ? `${request.distance} away`
      : "";

  const mapOverlayText = [cityName, displayDistance]
    .filter(Boolean)
    .join(" · ");

  const [matchSheetVisible, setMatchSheetVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [pledgedModalVisible, setPledgedModalVisible] = useState(false);
  const [isAlreadyPledgedModal, setIsAlreadyPledgedModal] = useState(false);
  const { mutateAsync: acceptBloodRequestMutate, isPending: isAccepting } =
    useAcceptBloodRequest();

  const urgencyKey = (request?.urgency?.toLowerCase() ||
    "normal") as keyof typeof URGENCY_CONFIG;
  const cfg = URGENCY_CONFIG[urgencyKey] || URGENCY_CONFIG.normal;
  const isUrgent = urgencyKey === "urgent" || urgencyKey === "critical";



  const donorBloodGroup =
    user?.blood_group || (user as any)?.bloodType || reduxUser?.blood_group;
  const patientBloodGroup = request.bloodType || (request as any)?.blood_group;
  const isCompatible = useMemo(
    () => isBloodCompatible(donorBloodGroup, patientBloodGroup),
    [donorBloodGroup, patientBloodGroup],
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

  const participant = useMemo(() => {
    const rawPId = existingThread?.participant?.id;
    const pId =
      (rawPId && rawPId !== "usr_unknown" ? rawPId : resolvedRequesterId) || null;
    const pName =
      existingThread?.participant?.name ||
      detailData?.requester?.full_name ||
      detailData?.requester?.name ||
      (request as any)?.requester?.full_name ||
      (request as any)?.requester?.name ||
      (request as any)?.user?.full_name ||
      (request as any)?.user?.name ||
      request?.patientName;

    const isValidAvatar = (url?: string | null) =>
      Boolean(
        url &&
        typeof url === "string" &&
        url.trim().length > 0 &&
        !url.includes("cdn.lifelink.org") &&
        (url.startsWith("http://") || url.startsWith("https://")),
      );

    const candidates = [
      detailData?.requester?.profile_image,
      (request as any)?.requester?.profile_image,
      existingThread?.participant?.avatar,
      (existingThread as any)?.participant?.profile_image,
      request?.patientImage,
      (request as any)?.patient_image,
    ];
    let pAvatar: string | undefined = undefined;
    for (const c of candidates) {
      if (isValidAvatar(c)) {
        pAvatar = c;
        break;
      }
    }

    return {
      id: pId,
      name: pName,
      avatar: pAvatar,
    };
  }, [existingThread, resolvedRequesterId, detailData, request]);

  const handleContact = useCallback(() => {
    if (isOwner) {
      (navigation as any).navigate(ROUTES.MY_REQUESTS);
      return;
    }
    const isUserOnboarded =
      user?.is_onboarded === true || isProfileComplete(user);
    if (!isUserOnboarded && !requireCompleteProfile(user, navigation, t)) {
      return;
    }
    (navigation as any).navigate(ROUTES.CHAT, {
      request,
      threadId: existingThread?.id,
      participant,
    });
  }, [navigation, request, user, t, isOwner, existingThread, participant]);

  const handleManageRequest = useCallback(() => {
    (navigation as any).navigate(ROUTES.MY_REQUESTS);
  }, [navigation]);

  const handleConfirmMatch = useCallback(async () => {
    if (isOwner) {
      Alert.alert(
        "Action Not Allowed",
        "You cannot donate blood to your own request.",
      );
      return;
    }
    const isUserOnboarded =
      user?.is_onboarded === true || isProfileComplete(user);
    if (!isUserOnboarded && !requireCompleteProfile(user, navigation, t)) {
      return;
    }
    if (!request.id) return;
    try {
      await acceptBloodRequestMutate(request.id);
      setJustPledged(true);
      setMatchSheetVisible(false);
      setIsAlreadyPledgedModal(false);
      setPledgedModalVisible(true);
    } catch (err: any) {
      setMatchSheetVisible(false);
      Alert.alert("Error", err?.message || "Could not respond to request.");
    }
  }, [isOwner, acceptBloodRequestMutate, request.id, navigation, user, t]);

  const canCall = Boolean(
    !isOwner &&
    !isRequesterProfileLoading &&
    !shouldHidePhone &&
    !request.hide_phone_number &&
    (request.contact_number || request.contactNumber),
  );

  const handleCall = useCallback(() => {
    const rawPhone = request.contact_number || request.contactNumber;
    if (!rawPhone || request.hide_phone_number || shouldHidePhone) {
      Alert.alert(
        "Direct Call Unavailable",
        "This user prefers in-app chat. Please tap Message to contact them directly.",
      );
      return;
    }
    const cleanPhone = String(rawPhone).replace(/[^\d+]/g, "");
    const phoneUrl = `tel:${cleanPhone}`;
    Linking.openURL(phoneUrl).catch(() => {
      Alert.alert(
        "Cannot Make Call",
        `Unable to initiate phone call to ${rawPhone} on this device.`,
      );
    });
  }, [request, shouldHidePhone]);

  const handleNavigate = useCallback(() => {
    const query = encodeURIComponent(
      `${request.hospital}, ${cityName || request.city}`,
    );
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
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <TouchableOpacity
                  style={styles.headerShareBtn}
                  onPress={handleShare}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <AnyIcon
                    type={Icons.Feather}
                    name="share-2"
                    size={moderateScale(15)}
                    color={colors.text}
                  />
                </TouchableOpacity>
                {!isOwner && (
                  <TouchableOpacity
                    style={styles.headerReportPill}
                    onPress={() => setReportModalVisible(true)}
                    activeOpacity={0.7}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <AnyIcon
                      type={Icons.Feather}
                      name="shield"
                      size={moderateScale(12)}
                      color={colors.error}
                    />
                    <AppText bold FONT_11 style={styles.headerReportText}>
                      {t("requestDetail.report") || "Report"}
                    </AppText>
                  </TouchableOpacity>
                )}
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
          <HeroBanner
            request={request}
            cfg={cfg}
            displayDistance={displayDistance}
          />

          {!isOwner && (
            <BloodCompatibilityCard
              donorBloodGroup={donorBloodGroup}
              patientBloodGroup={patientBloodGroup}
              onShare={handleShare}
            />
          )}

          <MedicalCaseNotesCard bloodType={request.bloodType} />

          <TimelineCard request={request} cityName={cityName} />

          <DetailsSheet
            request={request}
            cityName={cityName}
            provinceName={provinceName}
          />

          <MapPreviewCard
            request={request}
            mapOverlayText={mapOverlayText}
            onNavigate={handleNavigate}
          />

          {!isOwner && (
            <TouchableOpacity
              style={styles.safetyReportCard}
              onPress={() => setReportModalVisible(true)}
              activeOpacity={0.8}
            >
              <View style={styles.safetyReportLeft}>
                <View style={styles.safetyShieldWrap}>
                  <AnyIcon
                    type={Icons.Feather}
                    name="shield"
                    size={moderateScale(16)}
                    color={colors.textSecondary}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <AppText bold FONT_12 style={{ color: colors.text }}>
                    {t("requestDetail.suspiciousTitle") ||
                      "Notice something suspicious?"}
                  </AppText>
                  <AppText
                    regular
                    FONT_11
                    style={{ color: colors.textSecondary, marginTop: 1 }}
                  >
                    {t("requestDetail.suspiciousDesc") ||
                      "Report fake or fraudulent blood requests to protect our community."}
                  </AppText>
                </View>
              </View>
              <View style={styles.reportBadge}>
                <AppText bold FONT_11 style={{ color: colors.error }}>
                  {t("requestDetail.report") || "Report"}
                </AppText>
                <AnyIcon
                  type={Icons.Feather}
                  name="chevron-right"
                  size={moderateScale(12)}
                  color={colors.error}
                />
              </View>
            </TouchableOpacity>
          )}
        </ScrollView>

        <StickyFooterActions
          insetsBottom={insets.bottom}
          isOwner={isOwner}
          canCall={canCall}
          donationPledged={donationPledged}
          donationCompleted={donationCompleted}
          isUrgent={isUrgent}
          isCompatible={isCompatible}
          onCall={handleCall}
          onContact={handleContact}
          onShare={handleShare}
          onDonate={() => {
            if (!isCompatible) {
              handleShare();
              return;
            }

            if (donationPledged) {
              setIsAlreadyPledgedModal(true);
              setPledgedModalVisible(true);
              return;
            }
            if (donationCompleted) {
              Alert.alert(
                "Donation Completed",
                "Thank you! Your donation for this patient has already been confirmed as fulfilled.",
                [
                  {
                    text: "View My Donations",
                    onPress: () =>
                      (navigation as any).navigate(ROUTES.MY_DONATIONS),
                  },
                  { text: "OK", style: "cancel" },
                ],
              );
              return;
            }

            if (user?.stats?.is_eligible === false) {
              const reason = user?.stats?.next_eligible_date
                ? `You have an active donation cooldown until ${user.stats.next_eligible_date}.`
                : "You are currently marked as ineligible to donate blood based on your health screening.";
              Alert.alert(
                "Donor Eligibility Notice",
                `${reason}\n\nWould you like to review your screening questionnaire?`,
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Review Questionnaire",
                    onPress: () =>
                      (navigation as any).navigate(ROUTES.DONOR_QUESTIONNAIRE, {
                        isEditing: true,
                      }),
                  },
                ],
              );
              return;
            }

            setMatchSheetVisible(true);
          }}
          onManageRequest={handleManageRequest}
          onViewMyDonations={() =>
            (navigation as any).navigate(ROUTES.MY_DONATIONS)
          }
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

      <DonationPledgedModal
        isVisible={pledgedModalVisible}
        onClose={() => setPledgedModalVisible(false)}
        isAlreadyPledged={
          isAlreadyPledgedModal || isFromMyDonations || donationPledged
        }
        hospitalName={request.hospital}
        patientName={request.patientName}
        bloodType={request.bloodType}
        onOpenChat={() => {
          setPledgedModalVisible(false);
          (navigation as any).navigate(ROUTES.CHAT, {
            request,
            threadId: existingThread?.id,
            participant,
          });
        }}
        onViewMyDonations={() => {
          setPledgedModalVisible(false);
          (navigation as any).navigate(ROUTES.MY_DONATIONS);
        }}
      />
    </View>
  );
};

export default RequestDetailScreen;
