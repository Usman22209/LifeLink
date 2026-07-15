import React from "react";
import { View } from "react-native";
import { scale, moderateScale } from "react-native-size-matters";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import { styles } from "../ProfileScreen.styles";

const StatsSection: React.FC = () => {
  return (
    <View style={styles.statsContainer}>
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
          Donations
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
          Lives Saved
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
          <Text bold FONT_12 style={[styles.statValue, { color: colors.success }]}>
            Eligible
          </Text>
        </View>
        <Text regular FONT_10 style={styles.statLabel}>
          Status
        </Text>
      </View>
    </View>
  );
};

export default StatsSection;
