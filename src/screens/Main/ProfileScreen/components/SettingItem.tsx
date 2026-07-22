import React from "react";
import { View, TouchableOpacity, Switch } from "react-native";
import { scale, moderateScale } from "react-native-size-matters";
import { useSelector } from "react-redux";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import { selectIsRtl } from "@store/slices/appSlice";
import { styles } from "../ProfileScreen.styles";

interface SettingItemProps {
  iconName: string;
  label: string;
  onPress?: () => void;
  isLast?: boolean;
  iconColor?: string;
  textColor?: string;
  valueLabel?: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchValueChange?: (value: boolean) => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
  iconName,
  label,
  onPress,
  isLast = false,
  iconColor = colors.primary,
  textColor,
  valueLabel,
  hasSwitch = false,
  switchValue = false,
  onSwitchValueChange,
}) => {
  const isRtl = useSelector(selectIsRtl);
  return (
    <View>
      <TouchableOpacity
        style={[
          styles.itemRow,
          { flexDirection: isRtl ? "row-reverse" : "row" },
        ]}
        onPress={hasSwitch ? undefined : onPress}
        disabled={hasSwitch}
        activeOpacity={hasSwitch ? 1 : 0.7}
      >
        <View
          style={[
            styles.itemLeft,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          <View
            style={[
              styles.iconWrap,
              {
                backgroundColor: withOpacity(iconColor, 0.08),
                marginRight: isRtl ? 0 : scale(12),
                marginLeft: isRtl ? scale(12) : 0,
              },
            ]}
          >
            <AnyIcon
              type={Icons.Feather}
              name={iconName}
              size={moderateScale(14)}
              color={iconColor}
            />
          </View>
          <Text
            medium
            FONT_13
            style={[
              styles.itemLabel,
              { textAlign: isRtl ? "right" : "left" },
              textColor ? { color: textColor } : undefined,
            ]}
          >
            {label}
          </Text>
        </View>

        <View
          style={{
            flexDirection: isRtl ? "row-reverse" : "row",
            alignItems: "center",
          }}
        >
          {hasSwitch ? (
            <Switch
              value={switchValue}
              onValueChange={onSwitchValueChange}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
              ios_backgroundColor={colors.border}
            />
          ) : (
            <>
              {valueLabel && (
                <Text
                  regular
                  FONT_12
                  style={{
                    color: colors.textSecondary,
                    marginRight: isRtl ? 0 : scale(6),
                    marginLeft: isRtl ? scale(6) : 0,
                  }}
                >
                  {valueLabel}
                </Text>
              )}
              <AnyIcon
                type={Icons.Feather}
                name={isRtl ? "chevron-left" : "chevron-right"}
                size={moderateScale(14)}
                color={colors.textSecondary}
              />
            </>
          )}
        </View>
      </TouchableOpacity>
      {!isLast && <View style={styles.divider} />}
    </View>
  );
};

export default SettingItem;
