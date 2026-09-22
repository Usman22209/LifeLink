import React from "react";
import { View, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { selectIsRtl } from "@store/slices/appSlice";
import { BloodRequest, URGENCY_CONFIG } from "@screens/Main/FeedScreen/types";
import { styles } from "../MyDonationsScreen.styles";

export interface DonationLog {
  id: string;
  hospitalName: string;
  date: string;
  units: number;
  bloodType: string;
  request: BloodRequest;
}

interface DonationItemProps {
  item: DonationLog;
  onPress: (item: DonationLog) => void;
}

const DonationItem: React.FC<DonationItemProps> = ({ item, onPress }) => {
  const { t } = useTranslation();
  const isRtl = useSelector(selectIsRtl);

  const formattedDate =
    item.date && !isNaN(new Date(item.date).getTime())
      ? new Date(item.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "Recently";

  const urgencyKey = (
    item.request?.urgency || "normal"
  ).toLowerCase() as keyof typeof URGENCY_CONFIG;
  const cfg = URGENCY_CONFIG[urgencyKey] || URGENCY_CONFIG.normal;

  const req = item.request as any;
  const patientName =
    req?.patientName ||
    req?.patient_name ||
    "Blood Request";

  const hospitalName =
    item.hospitalName ||
    req?.hospital ||
    req?.hospital_name ||
    "Hospital";

  const bloodType =
    item.bloodType ||
    req?.bloodType ||
    req?.blood_group ||
    "O+";

  const units = item.units || 1;

  return (
    <TouchableOpacity
      style={[
        styles.donationCard,
        { flexDirection: isRtl ? "row-reverse" : "row" },
      ]}
      activeOpacity={0.7}
      onPress={() => onPress(item)}
    >
      <View style={[styles.cardAccent, { backgroundColor: cfg.color }]} />
      <View style={styles.cardBody}>
        <View
          style={[
            styles.cardTopRow,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          <View
            style={[
              styles.cardInfoSection,
              { alignItems: isRtl ? "flex-end" : "flex-start" },
            ]}
          >
            <AppText
              semiBold
              FONT_13
              style={[styles.patientName, { textAlign: isRtl ? "right" : "left" }]}
            >
              {patientName}
            </AppText>
            <View
              style={[
                styles.hospitalRow,
                { flexDirection: isRtl ? "row-reverse" : "row" },
              ]}
            >
              <AnyIcon
                type={Icons.Feather}
                name="home"
                size={moderateScale(10)}
                color={colors.textSecondary}
              />
              <AppText
                regular
                FONT_11
                style={[
                  styles.hospitalName,
                  {
                    marginHorizontal: moderateScale(4),
                    textAlign: isRtl ? "right" : "left",
                  },
                ]}
              >
                {hospitalName}
              </AppText>
            </View>
          </View>
          <View
            style={[
              styles.bloodBadge,
              { backgroundColor: withOpacity(cfg.color, 0.09) },
            ]}
          >
            <AppText extraBold FONT_14 style={{ color: cfg.color }}>
              {bloodType}
            </AppText>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View
          style={[
            styles.cardFooter,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          <View
            style={[
              styles.cardMeta,
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
                name="calendar"
                size={moderateScale(10)}
                color={colors.textSecondary}
              />
              <AppText
                regular
                FONT_10
                style={[styles.metaText, { marginHorizontal: moderateScale(4) }]}
              >
                {formattedDate}
              </AppText>
            </View>
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
              <AppText
                regular
                FONT_10
                style={[styles.metaText, { marginHorizontal: moderateScale(4) }]}
              >
                {units} {units === 1 ? (t("feed.unit") || "unit") : (t("feed.units") || "units")}
              </AppText>
            </View>
          </View>
          <View
            style={[
              styles.viewDetailRow,
              { flexDirection: isRtl ? "row-reverse" : "row" },
            ]}
          >
            <AppText semiBold FONT_11 style={styles.viewDetailText}>
              {t("feed.viewDetails") || "Details"}
            </AppText>
            <AnyIcon
              type={Icons.Feather}
              name={isRtl ? "chevron-left" : "chevron-right"}
              size={moderateScale(13)}
              color={colors.primary}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DonationItem;
