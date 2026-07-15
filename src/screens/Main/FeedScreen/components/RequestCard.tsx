import React from "react";
import { View, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { moderateScale } from "react-native-size-matters";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { withOpacity } from "@theme/colors";
import { ROUTES } from "@utils/Routes";
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
  distance,
  latitude,
  longitude,
}) => {
  const navigation = useNavigation<any>();
  const cfg = URGENCY_CONFIG[urgency];

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View
          style={[
            styles.bloodBadge,
            { backgroundColor: withOpacity(cfg.color, 0.09) },
          ]}
        >
          <Text extraBold FONT_16 style={{ color: cfg.color }}>
            {bloodType}
          </Text>
        </View>

        <View style={styles.cardInfo}>
          <Text
            semiBold
            FONT_13
            style={{ color: colors.text }}
            numberOfLines={1}
          >
            {patientName}
          </Text>
          <Text regular FONT_11 style={styles.hospitalText} numberOfLines={1}>
            {hospital} · {city}
          </Text>
          <View style={styles.metaRow}>
            <View style={styles.metaChip}>
              <AnyIcon
                type={Icons.Feather}
                name="droplet"
                size={moderateScale(10)}
                color={colors.textSecondary}
              />
              <Text regular FONT_10 style={{ color: colors.textSecondary }}>
                {units} {units === 1 ? "unit" : "units"}
              </Text>
            </View>
            <View style={styles.metaChip}>
              <AnyIcon
                type={Icons.Feather}
                name="map-pin"
                size={moderateScale(10)}
                color={colors.textSecondary}
              />
              <Text regular FONT_10 style={{ color: colors.textSecondary }}>
                {distance}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardRight}>
          <View
            style={[
              styles.urgencyPill,
              { backgroundColor: withOpacity(cfg.color, 0.1) },
            ]}
          >
            <View style={[styles.urgencyDot, { backgroundColor: cfg.color }]} />
            <Text semiBold FONT_10 style={{ color: cfg.color }}>
              {cfg.label}
            </Text>
          </View>
          <Text regular FONT_10 style={styles.timeText}>
            {time}
          </Text>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.cardBottom}>
        <TouchableOpacity
          style={styles.detailBtn}
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
              },
            })
          }
        >
          <Text semiBold FONT_12 style={{ color: colors.primary }}>
            View Details
          </Text>
          <AnyIcon
            type={Icons.Feather}
            name="arrow-right"
            size={moderateScale(13)}
            color={colors.primary}
          />
        </TouchableOpacity>

        <View style={styles.actionDivider} />

        <TouchableOpacity style={styles.shareBtn} activeOpacity={0.7}>
          <AnyIcon
            type={Icons.Feather}
            name="share-2"
            size={moderateScale(13)}
            color={colors.gray600}
          />
          <Text medium FONT_11 style={{ color: colors.gray600 }}>
            Share
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RequestCard;
