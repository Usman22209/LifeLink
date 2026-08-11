import React from "react";
import { View, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
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
  const formattedDate = new Date(item.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const cfg = URGENCY_CONFIG[item.request.urgency];

  return (
    <TouchableOpacity
      style={styles.donationCard}
      activeOpacity={0.7}
      onPress={() => onPress(item)}
    >
      <View style={[styles.cardAccent, { backgroundColor: cfg.color }]} />
      <View style={styles.cardBody}>
        <View style={styles.cardTopRow}>
          <View style={styles.cardInfoSection}>
            <AppText semiBold FONT_13 style={styles.patientName}>
              {item.request.patientName}
            </AppText>
            <View style={styles.hospitalRow}>
              <AnyIcon
                type={Icons.Feather}
                name="home"
                size={moderateScale(10)}
                color={colors.textSecondary}
              />
              <AppText regular FONT_11 style={styles.hospitalName}>
                {item.hospitalName}
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
              {item.bloodType}
            </AppText>
          </View>
        </View>

        <View style={styles.cardDivider} />

        <View style={styles.cardFooter}>
          <View style={styles.cardMeta}>
            <View style={styles.metaChip}>
              <AnyIcon
                type={Icons.Feather}
                name="calendar"
                size={moderateScale(10)}
                color={colors.textSecondary}
              />
              <AppText regular FONT_10 style={styles.metaText}>
                {formattedDate}
              </AppText>
            </View>
            <View style={styles.metaChip}>
              <AnyIcon
                type={Icons.Feather}
                name="droplet"
                size={moderateScale(10)}
                color={colors.textSecondary}
              />
              <AppText regular FONT_10 style={styles.metaText}>
                {item.units} {item.units === 1 ? "unit" : "units"}
              </AppText>
            </View>
          </View>
          <View style={styles.viewDetailRow}>
            <AppText semiBold FONT_11 style={styles.viewDetailText}>
              Details
            </AppText>
            <AnyIcon
              type={Icons.Feather}
              name="chevron-right"
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
