import React, { useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  I18nManager,
} from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Text from "@components/AppText";
import ScreenWrapper from "@components/ScreenWrapper";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";

// ─── Data ─────────────────────────────────────────────────────────────────────

const FILTERS = ["All", "Critical", "Urgent", "Normal", "Nearby"];

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
  {
    id: "4",
    bloodType: "AB-",
    patientName: "Bilal Raza",
    hospital: "Shaukat Khanum",
    city: "Lahore",
    units: 4,
    urgency: "critical" as const,
    time: "30m ago",
    distance: "7.0 km",
  },
];

const URGENCY_CONFIG = {
  critical: { color: colors.danger,  label: "Critical" },
  urgent:   { color: colors.warning, label: "Urgent"   },
  normal:   { color: colors.success, label: "Normal"   },
};

// ─── Page Header (passed to ScreenWrapper's `header` prop) ────────────────────
// Mirrors how AppHeader handles paddingTop: insets.top — no manual insets in body.

interface FeedHeaderProps {
  onBack: () => void;
  count: number;
}

const FeedHeader: React.FC<FeedHeaderProps> = ({ onBack, count }) => {
  const insets = useSafeAreaInsets();
  const isRtl = I18nManager.isRTL;

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: insets.top + verticalScale(10),
          flexDirection: isRtl ? "row-reverse" : "row",
        },
      ]}
    >
      <TouchableOpacity style={styles.iconBtn} onPress={onBack} activeOpacity={0.7}>
        <AnyIcon
          type={Icons.Ionicons}
          name={isRtl ? "chevron-forward" : "chevron-back"}
          size={moderateScale(22)}
          color={colors.text}
        />
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        <Text bold FONT_20 style={{ color: colors.text }}>
          Blood Requests
        </Text>
        <Text medium FONT_12 style={{ color: colors.textSecondary }}>
          {count} active requests near you
        </Text>
      </View>

      <TouchableOpacity style={styles.iconBtn} activeOpacity={0.75}>
        <AnyIcon type={Icons.Feather} name="sliders" size={moderateScale(18)} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};

// ─── Feed Card ────────────────────────────────────────────────────────────────

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
  const cfg = URGENCY_CONFIG[urgency];
  const isRtl = I18nManager.isRTL;

  return (
    <View style={styles.card}>
      {/* Left accent bar */}
      <View style={[styles.cardAccent, { backgroundColor: cfg.color }]} />

      <View style={styles.cardContent}>
        {/* ── Zone 1: blood tag · name + location · urgency dot + time ── */}
        <View style={[styles.cardRow, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
          {/* Blood type tag */}
          <View style={styles.bloodTag}>
            <Text extraBold FONT_14 style={{ color: colors.text }}>
              {bloodType}
            </Text>
          </View>

          {/* Name + hospital */}
          <View style={[styles.cardInfo, { alignItems: isRtl ? "flex-end" : "flex-start" }]}>
            <Text semiBold FONT_13 style={{ color: colors.text }} numberOfLines={1}>
              {patientName}
            </Text>
            <Text medium FONT_11 style={{ color: colors.textSecondary, marginTop: verticalScale(2) }} numberOfLines={1}>
              {hospital}, {city}
            </Text>
          </View>

          {/* Urgency dot + time */}
          <View style={{ alignItems: "flex-end" }}>
            <View style={[styles.cardRow, { gap: scale(4) }]}>
              <View style={[styles.dot, { backgroundColor: cfg.color }]} />
              <Text semiBold FONT_10 style={{ color: cfg.color }}>
                {cfg.label}
              </Text>
            </View>
            <Text medium FONT_10 style={{ color: colors.textSecondary, marginTop: verticalScale(4) }}>
              {time}
            </Text>
          </View>
        </View>

        {/* ── Zone 2: quiet meta line ── */}
        <Text medium FONT_11 style={styles.metaLine}>
          {units} {units === 1 ? "unit" : "units"} needed · {distance}
        </Text>

        {/* ── Zone 3: actions ── */}
        <View style={[styles.actionsRow, { flexDirection: isRtl ? "row-reverse" : "row" }]}>
          <TouchableOpacity style={styles.respondBtn} activeOpacity={0.82}>
            <Text semiBold FONT_12 style={{ color: colors.white }}>
              Respond
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareBtn} activeOpacity={0.75}>
            <AnyIcon type={Icons.Feather} name="share-2" size={moderateScale(14)} color={colors.gray600} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ─── Screen ───────────────────────────────────────────────────────────────────

const FeedScreen = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const navigation = useNavigation<any>();

  // Filter chip row — placed in FlatList's ListHeaderComponent
  const ListHeader = (
    <>
      {/* Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBar}
      >
        {FILTERS.map((f) => {
          const active = activeFilter === f;
          return (
            <TouchableOpacity
              key={f}
              style={[styles.chip, active && styles.chipActive]}
              activeOpacity={0.75}
              onPress={() => setActiveFilter(f)}
            >
              <Text semiBold FONT_12 style={{ color: active ? colors.white : colors.gray600 }}>
                {f}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Result count */}
      <Text medium FONT_12 style={styles.resultCount}>
        Showing {MOCK_REQUESTS.length} results
      </Text>
    </>
  );

  return (
    <ScreenWrapper
      backgroundColor={colors.background}
      safeArea             // handles bottom + side insets
      scrollable={false}   // FlatList handles its own scrolling
      style={styles.wrapper}
      header={
        <FeedHeader
          onBack={() => navigation.goBack()}
          count={MOCK_REQUESTS.length}
        />
      }
    >
      <FlatList
        data={MOCK_REQUESTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FeedRequestCard {...item} />}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: verticalScale(12) }} />}
        ListFooterComponent={<View style={{ height: verticalScale(24) }} />}
      />
    </ScreenWrapper>
  );
};

export default FeedScreen;

// ─── Styles ───────────────────────────────────────────────────────────────────

const CONTENT_PAD = scale(16);

const styles = StyleSheet.create({
  wrapper: { flex: 1 },

  // ── Header (lives in ScreenWrapper header slot) ──
  header: {
    alignItems: "center",
    paddingHorizontal: CONTENT_PAD,
    paddingBottom: verticalScale(14),
    gap: scale(10),
    backgroundColor: colors.background,
  },
  iconBtn: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray300,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Filter bar (scrolls with FlatList) ──
  filterBar: {
    
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(8),
    gap: scale(8),
  },
  chip: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(7),
    borderRadius: moderateScale(20),
    backgroundColor: colors.gray100,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  // Result count
  resultCount: {
    color: colors.textSecondary,
    paddingBottom: verticalScale(8),
  },

  // ── List ──
  list: {
    paddingHorizontal: CONTENT_PAD,
  },

  // ── Card ──
  card: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(14),
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.gray300,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardAccent: {
    width: moderateScale(4),
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: moderateScale(12),
    paddingVertical: moderateScale(12),
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(10),
  },
  // Blood type — plain square tag, no border or circle
  bloodTag: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(10),
    backgroundColor: colors.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
  cardInfo: {
    flex: 1,
  },
  // Small colored dot for urgency
  dot: {
    width: moderateScale(6),
    height: moderateScale(6),
    borderRadius: moderateScale(3),
  },
  // Quiet single-line meta below the main row
  metaLine: {
    color: colors.textSecondary,
    marginTop: verticalScale(8),
    marginBottom: verticalScale(10),
  },
  // Actions
  actionsRow: {
    alignItems: "center",
    gap: scale(8),
  },
  respondBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(10),
  },
  shareBtn: {
    width: moderateScale(38),
    height: moderateScale(38),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.gray100,
    borderRadius: moderateScale(10),
    borderWidth: 1,
    borderColor: colors.gray300,
  },
});
