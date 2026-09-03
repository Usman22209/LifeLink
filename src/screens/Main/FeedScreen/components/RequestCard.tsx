import React from "react";
import { View, TouchableOpacity, Share } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { moderateScale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { withOpacity } from "@theme/colors";
import { ROUTES } from "@utils/Routes";
import useTranslation from "@shared/hooks/useTranslation";
import { selectIsRtl, selectLanguage } from "@store/slices/appSlice";
import { getCityNameById } from "@shared/utils/cityUtils";
import { useUserLocation, formatDistance } from "@shared/utils/locationService";
import { BloodRequest, URGENCY_CONFIG } from "../types";
import { styles } from "../FeedScreen.styles";

type RequestCardProps = BloodRequest;

const RequestCard: React.FC<RequestCardProps> = ({
  id,
  bloodType,
  patientName,
  hospital,
  city,
  state,
  patientImage,
  units,
  urgency,
  time,
  time_left,
  distance,
  latitude,
  longitude,
  requester_id,
}) => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const isRtl = useSelector(selectIsRtl);
  const selectedLang = useSelector(selectLanguage);
  const userLocation = useUserLocation();

  const cityName = getCityNameById(city, selectedLang);
  const urgencyKey = (urgency?.toLowerCase() || "normal") as keyof typeof URGENCY_CONFIG;
  const cfg = URGENCY_CONFIG[urgencyKey] || URGENCY_CONFIG.normal;

  const computedDistance = formatDistance(userLocation, { latitude, longitude });
  const validDistance = computedDistance || (distance && distance !== "N/A" && distance !== "0 km" ? distance : "");

  const getUrgencyText = (urgencyVal: string) => {
    switch (urgencyVal?.toLowerCase()) {
      case "critical":
        return t("feed.critical");
      case "urgent":
      case "high":
        return t("feed.urgent");
      case "normal":
      default:
        return t("feed.normal");
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🚨 ${t("feed.title")}: ${bloodType} ${t("requestForm.bloodGroup")} required for ${patientName} at ${hospital}, ${city}. Please help save a life!`,
      });
    } catch (e) {
      // ignore share error
    }
  };

  return (
    <View style={styles.card}>
      <View
        style={[
          styles.cardTop,
          { flexDirection: isRtl ? "row-reverse" : "row" },
        ]}
      >
        <View
          style={[
            styles.bloodBadge,
            { backgroundColor: withOpacity(colors.primary, 0.09) },
          ]}
        >
          <Text extraBold FONT_16 style={{ color: colors.primary }}>
            {bloodType}
          </Text>
        </View>

        <View
          style={[
            styles.cardInfo,
            { alignItems: isRtl ? "flex-end" : "flex-start" },
          ]}
        >
          <Text
            semiBold
            FONT_13
            style={{ color: colors.text, textAlign: isRtl ? "right" : "left" }}
            numberOfLines={1}
          >
            {patientName}
          </Text>
          <Text
            regular
            FONT_11
            style={[styles.hospitalText, { textAlign: isRtl ? "right" : "left" }]}
            numberOfLines={1}
          >
            {hospital} · {cityName}
          </Text>
          <View
            style={[
              styles.metaRow,
              { flexDirection: isRtl ? "row-reverse" : "row" },
            ]}
          >
            <View
              style={[
                styles.metaChip,
                { flexDirection: isRtl ? "row-reverse" : "row" },
              ]}
            >
              <AnyIcon
                type={Icons.Feather}
                name="droplet"
                size={moderateScale(10)}
                color={colors.textSecondary}
              />
              <Text regular FONT_10 style={{ color: colors.textSecondary }}>
                {units} {units === 1 ? t("feed.unit") : t("feed.units")}
              </Text>
            </View>
            {validDistance ? (
              <View
                style={[
                  styles.metaChip,
                  { flexDirection: isRtl ? "row-reverse" : "row" },
                ]}
              >
                <AnyIcon
                  type={Icons.Feather}
                  name="map-pin"
                  size={moderateScale(10)}
                  color={colors.textSecondary}
                />
                <Text regular FONT_10 style={{ color: colors.textSecondary }}>
                  {validDistance}
                </Text>
              </View>
            ) : null}
            {time_left ? (
              <View
                style={[
                  styles.metaChip,
                  {
                    flexDirection: isRtl ? "row-reverse" : "row",
                    backgroundColor: withOpacity(colors.primary, 0.08),
                  },
                ]}
              >
                <AnyIcon
                  type={Icons.Feather}
                  name="clock"
                  size={moderateScale(10)}
                  color={colors.primary}
                />
                <Text semiBold FONT_10 style={{ color: colors.primary }}>
                  {time_left}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        <View
          style={[
            styles.cardRight,
            { alignItems: isRtl ? "flex-start" : "flex-end" },
          ]}
        >
          <View
            style={[
              styles.urgencyPill,
              {
                backgroundColor: withOpacity(cfg.color, 0.1),
                flexDirection: isRtl ? "row-reverse" : "row",
              },
            ]}
          >
            <View style={[styles.urgencyDot, { backgroundColor: cfg.color }]} />
            <Text semiBold FONT_10 style={{ color: cfg.color }}>
              {getUrgencyText(urgency)}
            </Text>
          </View>
          <Text regular FONT_10 style={styles.timeText}>
            {time}
          </Text>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View
        style={[
          styles.cardBottom,
          { flexDirection: isRtl ? "row-reverse" : "row" },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.detailBtn,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
          activeOpacity={0.75}
          onPress={() =>
            navigation.navigate(ROUTES.REQUEST_DETAIL, {
              request: {
                id,
                bloodType,
                patientName,
                hospital,
                city,
                state,
                patientImage,
                units,
                urgency,
                time,
                distance,
                latitude,
                longitude,
                requester_id,
              },
            })
          }
        >
          <Text semiBold FONT_12 style={{ color: colors.primary }}>
            {t("feed.viewDetails")}
          </Text>
          <AnyIcon
            type={Icons.Feather}
            name={isRtl ? "arrow-left" : "arrow-right"}
            size={moderateScale(13)}
            color={colors.primary}
          />
        </TouchableOpacity>

        <View style={styles.actionDivider} />

        <TouchableOpacity
          style={[
            styles.shareBtn,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
          activeOpacity={0.7}
          onPress={handleShare}
        >
          <AnyIcon
            type={Icons.Feather}
            name="share-2"
            size={moderateScale(13)}
            color={colors.gray600}
          />
          <Text medium FONT_11 style={{ color: colors.gray600 }}>
            {t("feed.share")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RequestCard;
