import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import Text from "@components/AppText";
import ScreenWrapper from "@components/ScreenWrapper";
import AppHeader from "@components/AppHeader";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";

const FILTERS = ["All", "Urgent", "Nearby", "My Requests"];

const MOCK_REQUESTS = [
  {
    id: "1",
    bloodType: "B+",
    patientName: "Ahmed Khan",
    hospital: "Mayo Hospital",
    city: "Lahore",
    units: 3,
    urgency: "critical" as const,
    time: "2h ago",
    distance: "3.2 km",
  },
  {
    id: "2",
    bloodType: "A-",
    patientName: "Sara Malik",
    hospital: "Jinnah Hospital",
    city: "Lahore",
    units: 2,
    urgency: "urgent" as const,
    time: "4h ago",
    distance: "5.1 km",
  },
  {
    id: "3",
    bloodType: "O+",
    patientName: "Anonymous",
    hospital: "Services Hospital",
    city: "Lahore",
    units: 1,
    urgency: "normal" as const,
    time: "6h ago",
    distance: "1.8 km",
  },
];

const URGENCY_COLORS = {
  critical: colors.danger,
  urgent: colors.warning,
  normal: colors.success,
};

const FeedScreen = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const isRtl = I18nManager.isRTL;

  return (
    <ScreenWrapper
      backgroundColor={colors.background}
      safeArea={false}
      style={styles.wrapper}
      header={<AppHeader title="Feed" />}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContainer}
      >
        {FILTERS.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterPill,
                {
                  backgroundColor: isActive
                    ? colors.primary
                    : colors.card,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                semiBold
                FONT_12
                style={{
                  color: isActive ? colors.white : colors.textSecondary,
                }}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.feedList}
      >
        {MOCK_REQUESTS.map((request) => (
          <FeedRequestCard key={request.id} {...request} />
        ))}
        <View style={{ height: verticalScale(20) }} />
      </ScrollView>
    </ScreenWrapper>
  );
};

export default FeedScreen;



interface FeedRequestCardProps {
  bloodType: string;
  patientName: string;
  hospital: string;
  city: string;
  units: number;
  urgency: "critical" | "urgent" | "normal";
  time: string;
  distance: string;
}

const FeedRequestCard: React.FC<FeedRequestCardProps> = ({
  bloodType,
  patientName,
  hospital,
  city,
  units,
  urgency,
  time,
  distance,
}) => {
  const urgencyColor = URGENCY_COLORS[urgency];
  const isRtl = I18nManager.isRTL;

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
            { backgroundColor: withOpacity(urgencyColor, 0.1) },
          ]}
        >
          <Text extraBold FONT_18 style={{ color: urgencyColor }}>
            {bloodType}
          </Text>
        </View>

        <View
          style={[
            styles.cardInfo,
            { alignItems: isRtl ? "flex-end" : "flex-start" },
          ]}
        >
          <Text semiBold FONT_14 style={{ color: colors.text }}>
            {patientName}
          </Text>
          <Text
            medium
            FONT_12
            style={{ color: colors.textSecondary, marginTop: verticalScale(2) }}
          >
            {hospital}, {city}
          </Text>
          <Text
            medium
            FONT_10
            style={{ color: colors.textSecondary, marginTop: verticalScale(2) }}
          >
            {units} {units === 1 ? "unit" : "units"} needed · {distance}
          </Text>
        </View>

        <View style={styles.cardMeta}>
          <View
            style={[
              styles.urgencyTag,
              { backgroundColor: withOpacity(urgencyColor, 0.1) },
            ]}
          >
            <Text semiBold FONT_9 style={{ color: urgencyColor, textTransform: "capitalize" }}>
              {urgency}
            </Text>
          </View>
          <Text medium FONT_9 style={{ color: colors.textSecondary, marginTop: verticalScale(4) }}>
            {time}
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.cardActions,
          { flexDirection: isRtl ? "row-reverse" : "row" },
        ]}
      >
        <TouchableOpacity style={styles.respondButton} activeOpacity={0.8}>
          <AnyIcon
            type={Icons.Feather}
            name="heart"
            size={moderateScale(14)}
            color={colors.white}
          />
          <Text semiBold FONT_12 style={{ color: colors.white, marginLeft: scale(6) }}>
            Respond
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton} activeOpacity={0.7}>
          <AnyIcon
            type={Icons.Feather}
            name="share-2"
            size={moderateScale(14)}
            color={colors.primary}
          />
          <Text semiBold FONT_12 style={{ color: colors.primary, marginLeft: scale(6) }}>
            Share
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: { flex: 1 },

  filterContainer: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    gap: scale(8),
  },
  filterPill: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(7),
    borderRadius: moderateScale(20),
  },

  feedList: {
    paddingHorizontal: scale(16),
    gap: verticalScale(12),
  },

  card: {
    backgroundColor: colors.card,
    borderRadius: moderateScale(16),
    padding: moderateScale(14),
  },
  cardTop: {
    alignItems: "flex-start",
    gap: scale(12),
  },
  bloodBadge: {
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(14),
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    flex: 1,
  },
  cardMeta: {
    alignItems: "flex-end",
  },
  urgencyTag: {
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(3),
    borderRadius: moderateScale(6),
  },
  cardActions: {
    marginTop: verticalScale(12),
    paddingTop: verticalScale(12),
    borderTopWidth: 1,
    borderTopColor: withOpacity(colors.border, 0.5),
    gap: scale(10),
  },
  respondButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: verticalScale(9),
    borderRadius: moderateScale(10),
  },
  shareButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: withOpacity(colors.primary, 0.08),
    paddingVertical: verticalScale(9),
    borderRadius: moderateScale(10),
  },
});
