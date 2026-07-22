import React from "react";
import { View } from "react-native";
import { scale, moderateScale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { selectIsRtl } from "@store/slices/appSlice";
import { styles } from "../ProfileScreen.styles";

const StatsSection: React.FC = () => {
  const { t } = useTranslation();
  const isRtl = useSelector(selectIsRtl);
  return (
    <View
      style={[
        styles.statsContainer,
        { flexDirection: isRtl ? "row-reverse" : "row" },
      ]}
    >
      <View style={styles.statItem}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: scale(4),
          }}
        >
          <AnyIcon
            type={Icons.Feather}
            name="heart"
            size={moderateScale(13)}
            color={colors.primary}
          />
          <Text bold FONT_15 style={styles.statValue}>
            4
          </Text>
        </View>
        <Text regular FONT_10 style={styles.statLabel}>
          {t("profile.stats.donations")}
        </Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: scale(4),
          }}
        >
          <AnyIcon
            type={Icons.Feather}
            name="award"
            size={moderateScale(13)}
            color={colors.primary}
          />
          <Text bold FONT_15 style={styles.statValue}>
            12
          </Text>
        </View>
        <Text regular FONT_10 style={styles.statLabel}>
          {t("profile.stats.livesSaved")}
        </Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: scale(4),
          }}
        >
          <AnyIcon
            type={Icons.Feather}
            name="calendar"
            size={moderateScale(13)}
            color={colors.success}
          />
          <Text
            bold
            FONT_12
            style={[styles.statValue, { color: colors.success }]}
          >
            {t("profile.stats.eligible")}
          </Text>
        </View>
        <Text regular FONT_10 style={styles.statLabel}>
          {t("profile.stats.status")}
        </Text>
      </View>
    </View>
  );
};

export default StatsSection;
