import React from "react";
import { View, TouchableOpacity } from "react-native";
import { moderateScale } from "react-native-size-matters";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { Alert, ALERT_TYPE_CONFIG } from "../types";
import { styles } from "../NotificationsScreen.styles";

interface AlertCardProps extends Alert {
  onPress: (item: Alert) => void;
}

const AlertCard: React.FC<AlertCardProps> = ({
  id,
  type,
  title,
  body,
  time,
  read,
  urgency,
  bloodType,
  hospital,
  onPress,
}) => {
  const config = ALERT_TYPE_CONFIG[type];
  const accent = config.accent;

  const isNavigatable = type === "blood_request" || type === "donation_match";

  return (
    <View style={[styles.card, !read && styles.cardUnread]}>
      <TouchableOpacity
        onPress={() =>
          onPress({
            id,
            type,
            title,
            body,
            time,
            read,
            urgency,
            bloodType,
            hospital,
          })
        }
        activeOpacity={0.75}
        style={styles.cardContent}
      >
        <View style={styles.iconWrap}>
          <AnyIcon
            type={Icons.Feather}
            name={config.icon}
            size={moderateScale(18)}
            color={accent}
          />
        </View>

        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              {!read && <View style={styles.unreadInlineDot} />}
              <AppText
                semiBold={!read}
                medium={read}
                FONT_13
                style={[
                  styles.cardTitle,
                  { color: read ? colors.gray600 : colors.text },
                ]}
                numberOfLines={1}
              >
                {title}
              </AppText>
            </View>
          </View>

          <AppText regular FONT_12 style={styles.cardMessage} numberOfLines={2}>
            {body}
          </AppText>
        </View>

        <View style={styles.cardRight}>
          <AppText regular FONT_10 style={styles.timeText}>
            {time}
          </AppText>
          {isNavigatable ? (
            <View style={styles.chevronWrap}>
              <AnyIcon
                type={Icons.Feather}
                name="chevron-right"
                size={moderateScale(20)}
                color={colors.gray600}
              />
            </View>
          ) : (
            <View style={{ height: moderateScale(20) }} />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AlertCard;
