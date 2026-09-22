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
  isRtl?: boolean;
}

const AlertCard: React.FC<AlertCardProps> = (props) => {
  const { title, body, time, read, type, onPress, isRtl = false } = props;

  const config = ALERT_TYPE_CONFIG[type] || ALERT_TYPE_CONFIG.system;

  return (
    <View style={[styles.card, !read && styles.cardUnread]}>
      <TouchableOpacity
        onPress={() => onPress(props)}
        activeOpacity={0.75}
        style={[
          styles.cardContent,
          { flexDirection: isRtl ? "row-reverse" : "row" },
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: config.bg }]}>
          <AnyIcon
            type={Icons.Feather}
            name={config.icon}
            size={moderateScale(17)}
            color={config.accent}
          />
        </View>

        <View style={styles.cardBody}>
          <View
            style={[
              styles.cardHeader,
              { flexDirection: isRtl ? "row-reverse" : "row" },
            ]}
          >
            <View
              style={[
                styles.titleRow,
                { flexDirection: isRtl ? "row-reverse" : "row" },
              ]}
            >
              {!read && <View style={styles.unreadDot} />}
              <AppText
                bold={!read}
                semiBold={read}
                FONT_13
                style={[
                  styles.cardTitle,
                  { color: read ? colors.textSecondary : colors.text },
                ]}
                numberOfLines={1}
              >
                {title}
              </AppText>
            </View>

            <AppText regular FONT_11 style={styles.timeText}>
              {time}
            </AppText>
          </View>

          <AppText regular FONT_12 style={styles.cardMessage} numberOfLines={2}>
            {body}
          </AppText>
        </View>

        <View style={styles.chevronWrap}>
          <AnyIcon
            type={Icons.Feather}
            name={isRtl ? "chevron-left" : "chevron-right"}
            size={moderateScale(16)}
            color={colors.gray600}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default AlertCard;
