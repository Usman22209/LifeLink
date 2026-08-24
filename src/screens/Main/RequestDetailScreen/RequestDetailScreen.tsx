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
import { useAcceptBloodRequest } from "@shared/query/donations/useDonations";
import EligibilityChecklistModal from "@components/EligibilityChecklistModal";

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

  // Normalize request schema to handle both camelCase and backend snake_case properties
  const request = useMemo(() => {
    return {
      ...rawRequest,
      id: rawRequest.id || "",
      patientName: rawRequest.patientName || rawRequest.patient_name || "Anonymous Patient",
      bloodType: rawRequest.bloodType || rawRequest.blood_group || "O+",
      hospital: rawRequest.hospital || rawRequest.hospital_name || "Hospital",
      city: rawRequest.city || rawRequest.city_id || "",
      units: rawRequest.units || rawRequest.units_required || 1,
      urgency: (rawRequest.urgency || "normal").toLowerCase(),
      time: rawRequest.time || "Recently",
      time_left: rawRequest.time_left || "",
      patientImage: rawRequest.patientImage || rawRequest.patient_image || rawRequest.requester?.profile_image,
      latitude: rawRequest.latitude ? Number(rawRequest.latitude) : undefined,
      longitude: rawRequest.longitude ? Number(rawRequest.longitude) : undefined,
      distance: rawRequest.distance || "",
    };
  }, [rawRequest]);

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
  const { mutateAsync: acceptBloodRequestMutate, isPending: isAccepting } =
    useAcceptBloodRequest();

  const urgencyKey = (request?.urgency?.toLowerCase() || "normal") as keyof typeof URGENCY_CONFIG;
  const cfg = URGENCY_CONFIG[urgencyKey] || URGENCY_CONFIG.normal;

  const reduxUser = useSelector(selectUser);
  const { data: profile } = useGetProfile();
  const user = profile || reduxUser;

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
    if (user && !requireCompleteProfile(user, navigation, t)) {
      return;
    }
    (navigation as any).navigate(ROUTES.CHAT, { request });
  }, [navigation, request, user, t]);

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
              (navigation as any).navigate(ROUTES.CHAT, { request }),
          },
        ],
      );
    } catch (err: any) {
      setMatchSheetVisible(false);
      Alert.alert("Error", err?.message || "Could not respond to request.");
    }
  }, [acceptBloodRequestMutate, request, navigation, user, t]);

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
          onContact={handleContact}
          onDonate={() => setMatchSheetVisible(true)}
        />
      </ScreenWrapper>

      <EligibilityChecklistModal
        isVisible={matchSheetVisible}
        onClose={() => setMatchSheetVisible(false)}
        onConfirm={handleConfirmMatch}
        isLoading={isAccepting}
      />
    </View>
  );
};

export default RequestDetailScreen;
