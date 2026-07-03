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
import Text from "@components/AppText";
import AppButton from "@components/AppButton";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import {
  FilterState,
  DEFAULT_FILTERS,
  URGENCY_OPTIONS,
  SORT_OPTIONS,
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
}

const OptionRow: React.FC<OptionRowProps> = ({ label, icon, options, selected, onSelect }) => (
  <View style={s.group}>
    <View style={s.groupHeader}>
      <View style={s.groupIconWrap}>
        <AnyIcon type={Icons.Feather} name={icon} size={moderateScale(13)} color={colors.primary} />
      </View>
      <Text semiBold FONT_13 style={{ color: colors.text }}>
        {label}
      </Text>
    </View>
    <View style={s.optionWrap}>
      {options.map((opt) => {
        const active = selected === opt;
        return (
          <TouchableOpacity
            key={opt}
            style={[s.option, active && s.optionActive]}
            onPress={() => onSelect(opt)}
            activeOpacity={0.7}
          >
            {active && <View style={s.optionDot} />}
            <Text medium FONT_12 style={{ color: active ? colors.primary : colors.gray600 }}>
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterState;
  setFilters: (f: FilterState) => void;
}

const FilterSheet: React.FC<FilterSheetProps> = ({ visible, onClose, filters, setFilters }) => {
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState<FilterState>(filters);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderRelease: (_, g) => {
        if (g.dy > 40) onClose();
      },
    })
  ).current;

  const handleApply = () => { setFilters(draft); onClose(); };
  const handleReset = () => setDraft(DEFAULT_FILTERS);

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

        <View style={[s.container, { paddingBottom: insets.bottom + verticalScale(16) }]}>
          <View style={s.handleWrap} {...panResponder.panHandlers}>
            <View style={s.handle} />
          </View>

          <View style={s.header}>
            <View>
              <Text bold FONT_16 style={{ color: colors.text }}>
                Filter Requests
              </Text>
              <Text regular FONT_11 style={{ color: colors.textSecondary, marginTop: verticalScale(1) }}>
                Narrow down by urgency, distance & more
              </Text>
            </View>
            <TouchableOpacity
              style={s.closeBtn}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <AnyIcon type={Icons.Ionicons} name="close" size={moderateScale(16)} color={colors.gray600} />
            </TouchableOpacity>
          </View>

          <View style={s.divider} />

          <OptionRow label="Urgency"    icon="alert-circle" options={URGENCY_OPTIONS}  selected={draft.urgency}   onSelect={(v) => setDraft({ ...draft, urgency: v })} />
          <OptionRow label="Sort By"    icon="bar-chart-2"  options={SORT_OPTIONS}     selected={draft.sortBy}    onSelect={(v) => setDraft({ ...draft, sortBy: v })} />
          <OptionRow label="Distance"   icon="map-pin"      options={DISTANCE_OPTIONS} selected={draft.distance}  onSelect={(v) => setDraft({ ...draft, distance: v })} />
          <OptionRow label="Blood Type" icon="droplet"      options={BLOOD_OPTIONS}    selected={draft.bloodType} onSelect={(v) => setDraft({ ...draft, bloodType: v })} />

          <View style={s.footer}>
            <TouchableOpacity style={s.resetBtn} onPress={handleReset} activeOpacity={0.7}>
              <AnyIcon type={Icons.Feather} name="rotate-ccw" size={moderateScale(13)} color={colors.gray600} />
              <Text medium FONT_13 style={{ color: colors.gray600 }}>
                Reset
              </Text>
            </TouchableOpacity>
            <AppButton
              title="Show Results"
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
