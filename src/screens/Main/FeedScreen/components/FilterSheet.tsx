import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  PanResponder,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import Text from "@components/AppText";
import AppButton from "@components/AppButton";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { selectIsRtl } from "@store/slices/appSlice";
import {
  FilterState,
  DEFAULT_FILTERS,
  SORT_OPTIONS,
  TIME_GAP_OPTIONS,
  DISTANCE_OPTIONS,
  BLOOD_OPTIONS,
} from "../types";
import { sheetStyles as s } from "../FeedScreen.styles";

interface OptionRowProps {
  label: string;
  icon: string;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  getOptionLabel: (opt: string) => string;
}

const OptionRow: React.FC<OptionRowProps> = ({
  label,
  icon,
  options,
  selected,
  onSelect,
  getOptionLabel,
}) => {
  const isRtl = useSelector(selectIsRtl);
  return (
    <View style={s.group}>
      <View
        style={[
          s.groupHeader,
          { flexDirection: isRtl ? "row-reverse" : "row" },
        ]}
      >
        <View style={s.groupIconWrap}>
          <AnyIcon
            type={Icons.Feather}
            name={icon}
            size={moderateScale(13)}
            color={colors.primary}
          />
        </View>
        <Text semiBold FONT_13 style={{ color: colors.text }}>
          {label}
        </Text>
      </View>
      <View
        style={[s.optionWrap, { flexDirection: isRtl ? "row-reverse" : "row" }]}
      >
        {options.map((opt) => {
          const active = selected === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[
                s.option,
                active && s.optionActive,
                { flexDirection: isRtl ? "row-reverse" : "row" },
              ]}
              onPress={() => onSelect(opt)}
              activeOpacity={0.7}
            >
              {active && <View style={s.optionDot} />}
              <Text
                medium
                FONT_12
                style={{ color: active ? colors.primary : colors.gray600 }}
              >
                {getOptionLabel(opt)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: (f: FilterState) => void;
}

const FilterSheet: React.FC<FilterSheetProps> = ({
  visible,
  onClose,
  filters,
  setFilters,
}) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const isRtl = useSelector(selectIsRtl);
  const [draft, setDraft] = useState<FilterState>(filters);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderRelease: (_, g) => {
        if (g.dy > 40) onClose();
      },
    }),
  ).current;

  const handleApply = () => {
    setFilters(draft);
    onClose();
  };
  const handleReset = () => setDraft(DEFAULT_FILTERS);

  const translateOption = (opt: string) => {
    switch (opt) {
      case "All":
        return t("feed.all");
      case "High":
      case "Urgent":
        return t("feed.high") || t("feed.urgent") || "High";
      case "Critical":
        return t("feed.critical");
      case "Normal":
        return t("feed.normal");
      case "Newest First":
        return t("feed.newestFirst");
      case "Closing Soonest":
        return t("feed.closingSoonest") || "Closing Soonest";
      case "Nearest First":
        return t("feed.nearestFirst");
      case "Most Units":
        return t("feed.mostUnits");
      case "Any Time":
        return t("feed.anyTime") || "Any Time";
      case "Within 6 Hours":
        return t("feed.within6Hours") || "Within 6 Hours";
      case "Within 12 Hours":
        return t("feed.within12Hours") || "Within 12 Hours";
      case "Within 24 Hours":
        return t("feed.within24Hours") || "Within 24 Hours";
      case "Within 3 Days":
        return t("feed.within3Days") || "Within 3 Days";
      case "Within 7 Days":
        return t("feed.within7Days") || "Within 7 Days";
      case "Within 1 Month":
        return t("feed.within1Month") || "Within 1 Month";
      case "Any":
        return t("feed.any");
      default:
        return opt;
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      statusBarTranslucent
      onRequestClose={onClose}
      onShow={() => setDraft(filters)}
    >
      <View style={s.modalWrap}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        <View
          style={[
            s.container,
            { paddingBottom: insets.bottom + verticalScale(16) },
          ]}
        >
          <View style={s.handleWrap} {...panResponder.panHandlers}>
            <View style={s.handle} />
          </View>

          <View
            style={[s.header, { flexDirection: isRtl ? "row-reverse" : "row" }]}
          >
            <View style={{ alignItems: isRtl ? "flex-end" : "flex-start" }}>
              <Text
                bold
                FONT_16
                style={{
                  color: colors.text,
                  textAlign: isRtl ? "right" : "left",
                }}
              >
                {t("feed.filterModalTitle")}
              </Text>
              <Text
                regular
                FONT_11
                style={{
                  color: colors.textSecondary,
                  marginTop: verticalScale(1),
                  textAlign: isRtl ? "right" : "left",
                }}
              >
                {t("feed.filterModalSubtitle")}
              </Text>
            </View>
            <TouchableOpacity
              style={s.closeBtn}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <AnyIcon
                type={Icons.Ionicons}
                name="close"
                size={moderateScale(16)}
                color={colors.gray600}
              />
            </TouchableOpacity>
          </View>

          <View style={s.divider} />

          <OptionRow
            label={t("feed.sortBy")}
            icon="bar-chart-2"
            options={SORT_OPTIONS}
            selected={draft.sortBy}
            onSelect={(v) => setDraft({ ...draft, sortBy: v })}
            getOptionLabel={translateOption}
          />
          <OptionRow
            label={t("feed.neededWithin") || "Needed Within"}
            icon="clock"
            options={TIME_GAP_OPTIONS}
            selected={draft.timeGap}
            onSelect={(v) => setDraft({ ...draft, timeGap: v })}
            getOptionLabel={translateOption}
          />
          <OptionRow
            label={t("feed.distance")}
            icon="map-pin"
            options={DISTANCE_OPTIONS}
            selected={draft.distance}
            onSelect={(v) => setDraft({ ...draft, distance: v })}
            getOptionLabel={translateOption}
          />
          <OptionRow
            label={t("feed.bloodType")}
            icon="droplet"
            options={BLOOD_OPTIONS}
            selected={draft.bloodType}
            onSelect={(v) => setDraft({ ...draft, bloodType: v })}
            getOptionLabel={translateOption}
          />

          <View
            style={[s.footer, { flexDirection: isRtl ? "row-reverse" : "row" }]}
          >
            <TouchableOpacity
              style={[
                s.resetBtn,
                { flexDirection: isRtl ? "row-reverse" : "row" },
              ]}
              onPress={handleReset}
              activeOpacity={0.7}
            >
              <AnyIcon
                type={Icons.Feather}
                name="rotate-ccw"
                size={moderateScale(13)}
                color={colors.gray600}
              />
              <Text medium FONT_13 style={{ color: colors.gray600 }}>
                {t("feed.reset")}
              </Text>
            </TouchableOpacity>
            <AppButton
              title={t("feed.showResults")}
              onPress={handleApply}
              style={s.applyBtn}
              textStyle={{ fontSize: moderateScale(13) }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterSheet;
