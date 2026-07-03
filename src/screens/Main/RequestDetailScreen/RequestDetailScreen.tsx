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
} from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import Svg, { Circle, Line, Path } from "react-native-svg";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ScreenWrapper from "@components/ScreenWrapper";
import AppHeader from "@components/AppHeader";
import AppText from "@components/AppText";
import AppImage from "@components/AppImage";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import { UserStackParamList } from "@shared/interfaces/navigation/navigation-params.interface";
import { ROUTES } from "@utils/Routes";
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
  const { request } = route.params;

  const [matchSheetVisible, setMatchSheetVisible] = useState(false);
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);

  const isFormValid = checked1 && checked2 && checked3;
  const cfg = URGENCY_CONFIG[request.urgency];

  const handleShare = useCallback(async () => {
    try {
      await Share.share({
        message: `🚨 URGENT BLOOD REQUEST 🚨\n\nPatient Name: ${request.patientName}\nBlood Type Required: ${request.bloodType}\nRequired Units: ${request.units}\nHospital: ${request.hospital}, ${request.city}\nUrgency: ${cfg.label}\n\nPlease share this message or contact the hospital immediately!`,
      });
    } catch (error: any) {
      console.log("Error sharing request:", error.message);
    }
  }, [request, cfg]);

  const handleContact = useCallback(() => {
    const message = `Hi, I saw your urgent blood request on LifeLink for ${request.bloodType} blood for patient ${request.patientName} at ${request.hospital}. I would like to help!`;
    const phone = "+9242111222333";

    Alert.alert(
      "Contact Recipient",
      "Choose how you want to reach out to the requester:",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Direct Phone Call",
          onPress: () => {
            Linking.openURL(`tel:${phone}`).catch(() => {
              Alert.alert("Error", "Could not initiate call.");
            });
          },
        },
        {
          text: "Send SMS Text",
          onPress: () => {
            const smsUrl = `sms:${phone}${
              Platform.OS === "ios" ? "&" : "?"
            }body=${encodeURIComponent(message)}`;
            Linking.openURL(smsUrl).catch(() => {
              Alert.alert("Error", "Could not open messaging client.");
            });
          },
        },
        {
          text: "WhatsApp Message",
          onPress: () => {
            const waUrl = `whatsapp://send?phone=${phone}&text=${encodeURIComponent(
              message,
            )}`;
            Linking.openURL(waUrl).catch(() => {
              const waWebUrl = `https://wa.me/${phone.replace(
                "+",
                "",
              )}?text=${encodeURIComponent(message)}`;
              Linking.openURL(waWebUrl).catch(() => {
                Alert.alert("Error", "Could not open WhatsApp.");
              });
            });
          },
        },
      ],
    );
  }, [request]);

  const handleConfirmMatch = useCallback(() => {
    setMatchSheetVisible(false);
    setChecked1(false);
    setChecked2(false);
    setChecked3(false);

    setTimeout(() => {
      Alert.alert(
        "Match Confirmed! 🎉",
        `Thank you for saving a life!\n\nYour profile info was shared with ${request.hospital}. Please coordinates with hospital reception or wait for contact request.`,
        [{ text: "Okay" }],
      );
    }, 400);
  }, [request]);

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
            title="Request Details"
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
                  {request.distance} away
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
                name="activity"
                size={moderateScale(14)}
                color={colors.primary}
              />
              <AppText bold FONT_13 style={styles.timelineTitle}>
                Request Timeline
              </AppText>
            </View>
            {renderTimelineStep(
              "clock",
              "Request Broadcasted",
              `Posted in Lahore feed (${request.time})`,
              true,
            )}
            {renderTimelineStep(
              "users",
              "Compatible Matchmaking",
              "Checking active donors matching blood profile",
              true,
            )}
            {renderTimelineStep(
              "heart",
              "Donor Commitment",
              "Awaiting blood matching coordinates",
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
              "Units Needed",
              `${request.units} ${request.units === 1 ? "Unit" : "Units"}`,
            )}
            {renderInfoRow("clock", "Time Requested", request.time)}
            {renderInfoRow("home", "Hospital", request.hospital)}
            {renderInfoRow("navigation", "City", request.city)}
            {renderInfoRow(
              "map",
              "State / Province",
              request.state || "Punjab",
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

            {/* Vector Map Drawing */}
            <View style={styles.mapCanvas}>
              <Svg height="100%" width="100%" viewBox="0 0 320 140">
                {/* Street Grid background lines */}
                <Line
                  x1="10"
                  y1="25"
                  x2="310"
                  y2="25"
                  stroke="#E4E7EC"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <Line
                  x1="10"
                  y1="70"
                  x2="310"
                  y2="70"
                  stroke="#E4E7EC"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <Line
                  x1="10"
                  y1="115"
                  x2="310"
                  y2="115"
                  stroke="#E4E7EC"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <Line
                  x1="45"
                  y1="10"
                  x2="45"
                  y2="130"
                  stroke="#E4E7EC"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <Line
                  x1="160"
                  y1="10"
                  x2="160"
                  y2="130"
                  stroke="#E4E7EC"
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <Line
                  x1="265"
                  y1="10"
                  x2="265"
                  y2="130"
                  stroke="#E4E7EC"
                  strokeWidth="6"
                  strokeLinecap="round"
                />

                {/* Routing Line (Primary Red Color Dashed path) */}
                <Path
                  d="M 45 115 L 45 70 L 160 70 L 160 25"
                  fill="none"
                  stroke={colors.primary}
                  strokeWidth="3.5"
                  strokeDasharray="6,4"
                  strokeLinecap="round"
                />

                {/* Donor Home Node (Green Pin) */}
                <Circle
                  cx="45"
                  cy="115"
                  r="9"
                  fill={colors.success}
                  fillOpacity="0.25"
                />
                <Circle cx="45" cy="115" r="4.5" fill={colors.success} />

                {/* Destination Hospital Node (Red Droplet Pin) */}
                <Circle
                  cx="160"
                  cy="25"
                  r="13"
                  fill={colors.primary}
                  fillOpacity="0.2"
                />
                <Circle cx="160" cy="25" r="6" fill={colors.primary} />
              </Svg>

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
                    {request.city} · {request.distance} away
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

      {/* Premium Match Screening Sheet Modal */}
      <Modal
        visible={matchSheetVisible}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={() => setMatchSheetVisible(false)}
      >
        <Pressable
          style={styles.modalBackdrop}
          onPress={() => setMatchSheetVisible(false)}
        >
          <Pressable
            style={[
              styles.sheetContainer,
              { paddingBottom: Math.max(moderateScale(20), insets.bottom) },
            ]}
            onPress={() => {}}
          >
            {/* Modal Header */}
            <View style={styles.sheetHeader}>
              <View style={styles.sheetTitleRow}>
                <AnyIcon
                  type={Icons.Feather}
                  name="shield"
                  size={moderateScale(16)}
                  color={colors.primary}
                />
                <AppText bold FONT_16 style={styles.sheetTitle}>
                  Donor Screening
                </AppText>
              </View>
              <TouchableOpacity
                onPress={() => setMatchSheetVisible(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <AnyIcon
                  type={Icons.Ionicons}
                  name="close"
                  size={moderateScale(18)}
                  color={colors.text}
                />
              </TouchableOpacity>
            </View>

            <AppText regular FONT_12 style={styles.sheetSubText}>
              Please verify your eligibility before committing to this match
              coordinates for Mayo Emergency.
            </AppText>

            {/* Checklist */}
            <View style={styles.checklist}>
              {/* Check 1 */}
              <TouchableOpacity
                style={[styles.checkRow, checked1 && styles.checkRowChecked]}
                onPress={() => setChecked1(!checked1)}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.checkBox, checked1 && styles.checkBoxChecked]}
                >
                  {checked1 && (
                    <AnyIcon
                      type={Icons.Ionicons}
                      name="checkmark"
                      size={moderateScale(12)}
                      color={colors.white}
                    />
                  )}
                </View>
                <AppText medium FONT_11 style={styles.checkText}>
                  My blood group is matching {request.bloodType}
                </AppText>
              </TouchableOpacity>

              {/* Check 2 */}
              <TouchableOpacity
                style={[styles.checkRow, checked2 && styles.checkRowChecked]}
                onPress={() => setChecked2(!checked2)}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.checkBox, checked2 && styles.checkBoxChecked]}
                >
                  {checked2 && (
                    <AnyIcon
                      type={Icons.Ionicons}
                      name="checkmark"
                      size={moderateScale(12)}
                      color={colors.white}
                    />
                  )}
                </View>
                <AppText medium FONT_11 style={styles.checkText}>
                  I feel fit and healthy today (no fever or cold)
                </AppText>
              </TouchableOpacity>

              {/* Check 3 */}
              <TouchableOpacity
                style={[styles.checkRow, checked3 && styles.checkRowChecked]}
                onPress={() => setChecked3(!checked3)}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.checkBox, checked3 && styles.checkBoxChecked]}
                >
                  {checked3 && (
                    <AnyIcon
                      type={Icons.Ionicons}
                      name="checkmark"
                      size={moderateScale(12)}
                      color={colors.white}
                    />
                  )}
                </View>
                <AppText medium FONT_11 style={styles.checkText}>
                  I haven't donated blood or gotten tattoos in last 3 months
                </AppText>
              </TouchableOpacity>
            </View>

            {/* CTA Confirm Button */}
            <TouchableOpacity
              style={[
                styles.confirmBtn,
                !isFormValid && styles.confirmBtnDisabled,
              ]}
              disabled={!isFormValid}
              onPress={handleConfirmMatch}
              activeOpacity={0.8}
            >
              <AnyIcon
                type={Icons.Feather}
                name="heart"
                size={moderateScale(14)}
                color={colors.white}
              />
              <AppText bold FONT_13 style={styles.confirmBtnText}>
                Confirm Donation Match
              </AppText>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default RequestDetailScreen;
