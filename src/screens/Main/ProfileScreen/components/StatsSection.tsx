import React from "react";
import { View, TouchableOpacity } from "react-native";
import { scale, moderateScale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { selectIsRtl } from "@store/slices/appSlice";
import { ROUTES } from "@shared/utils/Routes";
import { styles } from "../ProfileScreen.styles";

interface StatsSectionProps {
  stats?: {
    donations_count?: number;
    lives_saved?: number;
    is_eligible?: boolean;
    next_eligible_date?: string | null;
  };
  onEligibilityPress?: () => void;
}

const StatsSection: React.FC<StatsSectionProps> = ({
  stats,
  onEligibilityPress,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const isRtl = useSelector(selectIsRtl);

  const donationsCount = stats?.donations_count ?? 0;
  const livesSaved = stats?.lives_saved ?? 0;
  const isEligible = stats?.is_eligible !== false;

  const handleEligibilityPress = () => {
    if (onEligibilityPress) {
      onEligibilityPress();
    } else {
      navigation.navigate(ROUTES.DONOR_QUESTIONNAIRE, { isEditing: true });
    }
  };

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
            {donationsCount}
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
            {livesSaved}
          </Text>
        </View>
        <Text regular FONT_10 style={styles.statLabel}>
          {t("profile.stats.livesSaved")}
        </Text>
      </View>
      <View style={styles.statDivider} />
      <TouchableOpacity
        style={styles.statItem}
        onPress={handleEligibilityPress}
        activeOpacity={0.7}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: scale(4),
          }}
        >
          <AnyIcon
            type={Icons.Feather}
            name={isEligible ? "check-circle" : "clock"}
            size={moderateScale(13)}
            color={isEligible ? colors.success : colors.warning}
          />
          <Text
            bold
            FONT_12
            style={[
              styles.statValue,
              { color: isEligible ? colors.success : colors.warning },
            ]}
          >
            {isEligible
              ? t("profile.stats.eligible") || "Eligible"
              : t("profile.stats.ineligible") || "Ineligible"}
          </Text>
        </View>
        <Text regular FONT_10 style={styles.statLabel}>
          {t("profile.stats.status")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default StatsSection;
