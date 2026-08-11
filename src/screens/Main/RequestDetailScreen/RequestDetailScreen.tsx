import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  Linking,
  Modal,
  Pressable,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenWrapper from "@components/ScreenWrapper";
import AppHeader from "@components/AppHeader";
import AppText from "@components/AppText";
import AppImage from "@components/AppImage";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { useSelector } from "react-redux";
import { selectLanguage } from "@store/slices/appSlice";
import { getCityNameById, getProvinceByCityId } from "@shared/utils/cityUtils";
import { useUserLocation, formatDistance } from "@shared/utils/locationService";
import { colors, withOpacity } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { UserStackParamList } from "@shared/interfaces/navigation/navigation-params.interface";
import { ROUTES } from "@utils/Routes";
import { useAcceptBloodRequest } from "@shared/query/donations/useDonations";
import EligibilityChecklistModal from "@components/EligibilityChecklistModal";
import { URGENCY_CONFIG } from "../FeedScreen/types";
import { styles } from "./RequestDetailScreen.styles";

type RequestDetailScreenRouteProp = RouteProp<
  UserStackParamList,
  typeof ROUTES.REQUEST_DETAIL
>;

const RequestDetailScreen = () => {
  const route = useRoute<RequestDetailScreenRouteProp>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const selectedLang = useSelector(selectLanguage);
  const userLocation = useUserLocation();
  const { request } = route.params;

  const cityName = getCityNameById(request.city, selectedLang);
  const provinceName = request.state || getProvinceByCityId(request.city) || "Punjab";

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

  const [mapReady, setMapReady] = useState(false);
  const [matchSheetVisible, setMatchSheetVisible] = useState(false);
  const { mutateAsync: acceptBloodRequestMutate, isPending: isAccepting } =
    useAcceptBloodRequest();


  const urgencyKey = (request?.urgency?.toLowerCase() || "normal") as keyof typeof URGENCY_CONFIG;
  const cfg = URGENCY_CONFIG[urgencyKey] || URGENCY_CONFIG.normal;

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `🚨 ${t("feed.title")}: ${request.bloodType} required for ${request.patientName} at ${request.hospital}, ${cityName}. Please help save a life!`,
      });
    } catch (error: any) {
      console.log("Error sharing request:", error.message);
    }
  }, [request, cityName, t]);

  const handleContact = useCallback(() => {
    (navigation as any).navigate(ROUTES.CHAT, { request });
  }, [navigation, request]);

  const handleConfirmMatch = useCallback(async () => {
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
  }, [acceptBloodRequestMutate, request, navigation]);

  const handleNavigate = useCallback(() => {
    const query = encodeURIComponent(`${request.hospital}, ${request.city}`);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
    Linking.openURL(url).catch((err) => {
      console.log("Error launching native maps:", err.message);
      Alert.alert(
        "Navigation Error",
        "Could not launch map directions automatically.",
      );
    });
  }, [request]);

  const renderInfoRow = (
    icon: string,
    label: string,
    value: string | number,
    isLast = false,
  ) => (
    <View style={[styles.infoRow, isLast && { borderBottomWidth: 0 }]}>
      <View style={styles.infoRowLeft}>
        <AnyIcon
          type={Icons.Feather}
          name={icon}
          size={moderateScale(12)}
          color={colors.primary}
        />
        <AppText bold FONT_10 style={styles.infoLabel}>
          {label.toUpperCase()}
        </AppText>
      </View>
      <AppText semiBold FONT_13 style={styles.infoValue}>
        {value}
      </AppText>
    </View>
  );

  const renderTimelineStep = (
    icon: string,
    title: string,
    desc: string,
    isActive: boolean,
    isLast = false,
  ) => (
    <View style={styles.timelineRow}>
      <View style={styles.timelineStep}>
        <View
          style={[
            styles.timelineCircle,
            isActive && styles.timelineCircleActive,
          ]}
        >
          <AnyIcon
            type={Icons.Feather}
            name={icon}
            size={moderateScale(10)}
            color={isActive ? colors.white : colors.gray600}
          />
        </View>
        {!isLast && (
          <View
            style={[styles.timelineLine, isActive && styles.timelineLineActive]}
          />
        )}
      </View>
      <View style={styles.timelineContent}>
        <AppText semiBold FONT_12 style={styles.stepTitle}>
          {title}
        </AppText>
        <AppText regular FONT_10 style={styles.stepDesc}>
          {desc}
        </AppText>
      </View>
    </View>
  );

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
          <View style={styles.heroSection}>
            <View style={styles.avatarContainer}>
              <AppImage
                source={{
                  uri:
                    request?.patientImage ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
                }}
                style={styles.patientAvatar}
              />
              <LinearGradient
                colors={
                  request.urgency === "critical"
                    ? ["#E53935", "#FF8A80"]
                    : ["#F57C00", "#FFB74D"]
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.overlappingBadge}
              >
                <AppText extraBold style={styles.badgeTextSmall}>
                  {request.bloodType}
                </AppText>
              </LinearGradient>
            </View>
            <AppText bold FONT_18 style={styles.patientName}>
              {request.patientName}
            </AppText>
            <AppText regular style={styles.subtitleText}>
              Needs emergency blood donation
            </AppText>

            <View style={styles.urgencyRow}>
              <View
                style={[
                  styles.urgencyPill,
                  {
                    backgroundColor: withOpacity(cfg.color, 0.06),
                    borderColor: withOpacity(cfg.color, 0.2),
                  },
                ]}
              >
                <View
                  style={[styles.urgencyDot, { backgroundColor: cfg.color }]}
                />
                <AppText semiBold FONT_10 style={{ color: cfg.color }}>
                  {cfg.label}
                </AppText>
              </View>
              <View style={styles.distancePill}>
                <AnyIcon
                  type={Icons.Feather}
                  name="map-pin"
                  size={moderateScale(9)}
                  color={colors.textSecondary}
                />
                <AppText semiBold FONT_10 style={styles.distanceText}>
                  {displayDistance || "Nearby"}
                </AppText>
              </View>
            </View>
          </View>

          {/* Medical Case Notes */}
          <View style={styles.caseNotesCard}>
            <AnyIcon
              type={Icons.Feather}
              name="info"
              size={moderateScale(15)}
              color={colors.primary}
              style={{ marginTop: verticalScale(1) }}
            />
            <View style={{ flex: 1 }}>
              <AppText bold FONT_13 style={styles.caseNotesTitle}>
                Medical Case Summary
              </AppText>
              <AppText regular FONT_11 style={styles.caseNotesText}>
                Emergency surgery request at Mayo Intensive Care Unit. The
                patient requires compatibly matched {request.bloodType} blood
                due to severe blood loss. Please respond if you are matching.
              </AppText>
            </View>
          </View>

          {/* Donation Step Timeline */}
          <View style={styles.timelineContainer}>
            <View style={styles.timelineHeader}>
              <AnyIcon
                type={Icons.Feather}
                name="clock"
                size={moderateScale(14)}
                color={colors.primary}
              />
              <AppText bold FONT_13 style={styles.timelineTitle}>
                Request Schedule & Timeline
              </AppText>
            </View>
            {renderTimelineStep(
              "calendar",
              "Request Broadcasted",
              `Created & broadcasted to ${cityName} donors (${request.time || "Recently"})`,
              true,
            )}
            {renderTimelineStep(
              "clock",
              "Urgency & Expiry Window",
              request.time_left
                ? `Active countdown: ${request.time_left}`
                : request.urgency === "critical"
                ? "Emergency Request — Expires in 48 hours"
                : "Standard Emergency — Active for 7 days",
              true,
            )}
            {renderTimelineStep(
              "heart",
              "Donation Match Progress",
              (request as any).fulfilled_units
                ? `${(request as any).fulfilled_units} of ${request.units} Units Received`
                : "Live Matchmaking Active — Donors being notified",
              false,
              true,
            )}
          </View>

          {/* Unified Details Sheet */}
          <View style={styles.infoContainer}>
            {renderInfoRow("user", "Patient", request.patientName)}
            {renderInfoRow("droplet", "Blood Group", request.bloodType)}
            {renderInfoRow(
              "database",
              "Units Required",
              `${request.units} ${request.units === 1 ? "Unit" : "Units"}`,
            )}
            {renderInfoRow("clock", "Time Posted", request.time || "Just now")}
            {renderInfoRow("alert-circle", "Required Deadline", request.time_left ? `${request.time_left} remaining` : "Immediate")}
            {renderInfoRow("home", "Hospital", request.hospital)}
            {renderInfoRow("navigation", "City", cityName)}
            {renderInfoRow(
              "map",
              "State / Province",
              provinceName,
              true,
            )}
          </View>

          {/* Vector Map Preview Card */}
          <View style={styles.mapCard}>
            <View style={styles.mapHeader}>
              <View style={styles.mapTitleRow}>
                <AnyIcon
                  type={Icons.Feather}
                  name="map"
                  size={moderateScale(14)}
                  color={colors.primary}
                />
                <View>
                  <AppText bold FONT_13 style={styles.mapTitle}>
                    Navigation Route
                  </AppText>
                  <AppText regular style={styles.mapSubtitle}>
                    Directions to destination hospital
                  </AppText>
                </View>
              </View>
            </View>
            <View style={styles.mapCanvas}>
              {!mapReady ? (
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: colors.gray100,
                    justifyContent: "center",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: colors.gray300,
                    borderRadius: moderateScale(10),
                    borderStyle: "dashed",
                    padding: moderateScale(16),
                    margin: moderateScale(8),
                  }}
                  activeOpacity={0.85}
                  onPress={() => setMapReady(true)}
                >
                  <View style={{
                    width: moderateScale(38),
                    height: moderateScale(38),
                    borderRadius: moderateScale(19),
                    backgroundColor: withOpacity(colors.primary, 0.08),
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: verticalScale(6)
                  }}>
                    <AnyIcon
                      type={Icons.Feather}
                      name="map-pin"
                      size={moderateScale(18)}
                      color={colors.primary}
                    />
                  </View>
                  <AppText bold FONT_11 style={{ color: colors.text }}>
                    Load Interactive Map
                  </AppText>
                  <AppText regular FONT_9 style={{ color: colors.textSecondary, marginTop: verticalScale(2), textAlign: "center" }}>
                    Tap to render exact hospital route on map
                  </AppText>
                </TouchableOpacity>
              ) : (
                <MapView
                  provider={PROVIDER_DEFAULT}
                  style={{ width: "100%", height: "100%" }}
                  key={`map-${request.latitude || 31.5723}-${request.longitude || 74.3213}`}
                  initialRegion={{
                    latitude: request.latitude || 31.5723,
                    longitude: request.longitude || 74.3213,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  pitchEnabled={false}
                  rotateEnabled={false}
                >
                  <Marker
                    coordinate={{
                      latitude: request.latitude || 31.5723,
                      longitude: request.longitude || 74.3213,
                    }}
                    title={request.hospital}
                    description={`Emergency Blood Request: ${request.bloodType}`}
                  >
                    <View
                      style={{
                        backgroundColor: colors.primary,
                        padding: moderateScale(6),
                        borderRadius: moderateScale(16),
                        borderWidth: 2,
                        borderColor: colors.white,
                        alignItems: "center",
                        justifyContent: "center",
                        ...Platform.select({
                          ios: {
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.25,
                            shadowRadius: 3,
                          },
                          android: { elevation: 4 },
                        }),
                      }}
                    >
                      <AnyIcon
                        type={Icons.Feather}
                        name="droplet"
                        size={moderateScale(14)}
                        color={colors.white}
                      />
                    </View>
                  </Marker>
                </MapView>
              )}

              {/* Floating Action Overlay on Map Canvas */}
              <View style={styles.mapOverlay}>
                <View style={styles.mapOverlayLeft}>
                  <AppText
                    bold
                    FONT_11
                    style={styles.mapOverlayHospital}
                    numberOfLines={1}
                  >
                    {request.hospital}
                  </AppText>
                  <AppText regular style={styles.mapOverlayDistance}>
                    {mapOverlayText}
                  </AppText>
                </View>
                <TouchableOpacity
                  style={styles.navigateBtn}
                  onPress={handleNavigate}
                  activeOpacity={0.8}
                >
                  <AnyIcon
                    type={Icons.Feather}
                    name="navigation"
                    size={moderateScale(10)}
                    color={colors.white}
                  />
                  <AppText bold FONT_10 style={styles.navigateBtnText}>
                    Navigate
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Sticky Actions Footer */}
        <View
          style={[
            styles.footer,
            { paddingBottom: Math.max(moderateScale(12), insets.bottom) },
          ]}
        >
          <TouchableOpacity
            style={styles.contactBtn}
            onPress={handleContact}
            activeOpacity={0.75}
          >
            <AnyIcon
              type={Icons.Feather}
              name="message-square"
              size={moderateScale(14)}
              color={colors.text}
            />
            <AppText bold FONT_12 style={styles.contactText}>
              Message
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.donateBtn}
            onPress={() => setMatchSheetVisible(true)}
            activeOpacity={0.8}
          >
            <AnyIcon
              type={Icons.Feather}
              name="heart"
              size={moderateScale(14)}
              color={colors.white}
            />
            <AppText bold FONT_12 style={styles.donateText}>
              Donate Now
            </AppText>
          </TouchableOpacity>
        </View>
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
