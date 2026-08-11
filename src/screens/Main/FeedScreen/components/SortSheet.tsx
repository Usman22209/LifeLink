import React, { useRef } from "react";
import {
  View,
  TouchableOpacity,
  PanResponder,
  Modal,
  Pressable,
  StyleSheet,
} from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSelector } from "react-redux";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { selectIsRtl } from "@store/slices/appSlice";
import { SORT_OPTIONS } from "../types";
import { sheetStyles as s } from "../FeedScreen.styles";

interface SortSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedSort: string;
  onSelectSort: (sortOption: string) => void;
}

const SORT_ICONS: Record<string, { lib: any; name: string }> = {
  "Newest First": { lib: Icons.Feather, name: "clock" },
  "Nearest First": { lib: Icons.Feather, name: "map-pin" },
  "Most Units": { lib: Icons.Feather, name: "database" },
};

const SortSheet: React.FC<SortSheetProps> = ({
  visible,
  onClose,
  selectedSort,
  onSelectSort,
}) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const isRtl = useSelector(selectIsRtl);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 5,
      onPanResponderRelease: (_, g) => {
        if (g.dy > 50) onClose();
      },
    }),
  ).current;

  const translateSortOption = (opt: string) => {
    switch (opt) {
      case "Newest First":
        return t("feed.newestFirst");
      case "Nearest First":
        return t("feed.nearestFirst");
      case "Most Units":
        return t("feed.mostUnits");
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
    >
      <Pressable style={s.modalWrap} onPress={onClose}>
        <Pressable
          style={[
            s.container,
            { paddingBottom: Math.max(insets.bottom, verticalScale(16)) },
          ]}
          onPress={() => {}}
        >
          {/* Drag Handle Indicator */}
          <View style={s.handleWrap} {...panResponder.panHandlers}>
            <View style={s.handle} />
          </View>

          {/* Header */}
          <View
            style={[
              s.header,
              { flexDirection: isRtl ? "row-reverse" : "row" },
            ]}
          >
            <View style={{ flex: 1, alignItems: isRtl ? "flex-end" : "flex-start" }}>
              <Text
                bold
                FONT_16
                style={{ color: colors.text, textAlign: isRtl ? "right" : "left" }}
              >
                {t("feed.sortModalTitle")}
              </Text>
              <Text
                regular
                FONT_11
                style={{
                  color: colors.textSecondary,
                  marginTop: verticalScale(2),
                  textAlign: isRtl ? "right" : "left",
                }}
              >
                {t("feed.sortModalSubtitle")}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={s.closeBtn}
              activeOpacity={0.6}
            >
              <AnyIcon
                type={Icons.Ionicons}
                name="close-outline"
                size={moderateScale(18)}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>

          <View style={s.divider} />

          {/* Clean Flat Options List */}
          <View style={styles.listContainer}>
            {SORT_OPTIONS.map((opt, index) => {
              const active = selectedSort === opt;
              const iconCfg = SORT_ICONS[opt] || { lib: Icons.Feather, name: "clock" };
              const isLast = index === SORT_OPTIONS.length - 1;

              return (
                <TouchableOpacity
                  key={opt}
                  style={[
                    styles.optionRow,
                    { flexDirection: isRtl ? "row-reverse" : "row" },
                    isLast && { borderBottomWidth: 0 },
                  ]}
                  onPress={() => {
                    onSelectSort(opt);
                    onClose();
                  }}
                  activeOpacity={0.6}
                >
                  <View
                    style={[
                      styles.optionRowLeft,
                      { flexDirection: isRtl ? "row-reverse" : "row" },
                    ]}
                  >
                    <View
                      style={[
                        styles.iconContainer,
                        active && styles.iconContainerActive,
                      ]}
                    >
                      <AnyIcon
                        type={iconCfg.lib}
                        name={iconCfg.name}
                        size={moderateScale(14)}
                        color={active ? colors.white : colors.gray600}
                      />
                    </View>
                    <Text
                      semiBold={active}
                      medium={!active}
                      FONT_13
                      style={{ color: active ? colors.primary : colors.text }}
                    >
                      {translateSortOption(opt)}
                    </Text>
                  </View>

                  {active && (
                    <AnyIcon
                      type={Icons.Ionicons}
                      name="checkmark"
                      size={moderateScale(18)}
                      color={colors.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default SortSheet;

const styles = StyleSheet.create({
  listContainer: {
    marginBottom: verticalScale(12),
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(14),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.gray300,
  },
  optionRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(12),
  },
  iconContainer: {
    width: moderateScale(30),
    height: moderateScale(30),
    borderRadius: moderateScale(15),
    backgroundColor: colors.gray100,
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainerActive: {
    backgroundColor: colors.primary,
  },
});
