import React from "react";
import {
  View,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { scale, moderateScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { selectIsRtl } from "@store/slices/appSlice";
import { UrgentRequest } from "../types";
import { cardStyles as styles } from "../HomeScreen.styles";

interface UrgentRequestCardProps extends UrgentRequest {
  onPress?: () => void;
}

const URGENCY_CONFIG = {
  critical: { color: colors.danger, icon: "alert-circle" },
  urgent: { color: colors.warning, icon: "alert-triangle" },
  normal: { color: colors.success, icon: "clock" },
};

const UrgentRequestCard: React.FC<UrgentRequestCardProps> = ({
  bloodType,
  hospital,
  city,
  units,
  urgency,
  time,
  distance,
  onPress,
}) => {
  const config = URGENCY_CONFIG[urgency];
  const isRtl = useSelector(selectIsRtl);
  const { t } = useTranslation();
  const { width: windowWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const usableWidth = windowWidth - insets.left - insets.right;
  const cardWidth = (usableWidth - moderateScale(20) - scale(12)) / 2;

  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={[styles.accentBar, { backgroundColor: config.color }]} />

      <View style={styles.inner}>
        <View
          style={[
            styles.topRow,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          <View
            style={[
              styles.bloodPill,
              { borderColor: withOpacity(config.color, 0.35) },
            ]}
          >
            <Text extraBold FONT_16 style={{ color: config.color }}>
              {bloodType}
            </Text>
          </View>

          <View
            style={[
              styles.badge,
              { flexDirection: isRtl ? "row-reverse" : "row" },
            ]}
          >
            <AnyIcon
              type={Icons.Feather}
              name={config.icon}
              size={moderateScale(9)}
              color={config.color}
            />
            <Text
              semiBold
              FONT_9
              style={{ color: config.color, marginLeft: scale(3) }}
            >
              {t(`home.${urgency}`)}
            </Text>
          </View>
        </View>

        <Text
          semiBold
          FONT_12
          numberOfLines={2}
          style={[styles.hospital, { textAlign: isRtl ? "right" : "left" }]}
        >
          {hospital}
        </Text>

        <View
          style={[
            styles.metaRow,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          <AnyIcon
            type={Icons.Feather}
            name="map-pin"
            size={moderateScale(9)}
            color={colors.textSecondary}
          />
          <Text
            medium
            FONT_10
            numberOfLines={1}
            style={{
              color: colors.textSecondary,
              marginLeft: scale(3),
              flex: 1,
            }}
          >
            {city}
            {distance ? ` · ${distance}` : ""}
          </Text>
        </View>

        <View style={styles.divider} />

        <View
          style={[
            styles.footer,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          <View
            style={[
              styles.footerItem,
              { flexDirection: isRtl ? "row-reverse" : "row" },
            ]}
          >
            <AnyIcon
              type={Icons.Ionicons}
              name="water-outline"
              size={moderateScale(10)}
              color={colors.textSecondary}
            />
            <Text
              medium
              FONT_10
              style={{ color: colors.textSecondary, marginLeft: scale(3) }}
            >
              {units} {units === 1 ? t("home.unit") : t("home.units")}
            </Text>
          </View>
          <Text medium FONT_9 style={{ color: colors.textSecondary }}>
            {time}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default UrgentRequestCard;
