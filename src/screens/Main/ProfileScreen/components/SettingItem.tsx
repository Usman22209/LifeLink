import React from "react";
import { View, TouchableOpacity, Switch } from "react-native";
import { scale, moderateScale } from "react-native-size-matters";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
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
  return (
    <View>
      <TouchableOpacity
        style={styles.itemRow}
        onPress={hasSwitch ? undefined : onPress}
        disabled={hasSwitch}
        activeOpacity={hasSwitch ? 1 : 0.7}
      >
        <View style={styles.itemLeft}>
          <View style={[styles.iconWrap, { backgroundColor: withOpacity(iconColor, 0.08) }]}>
            <AnyIcon
              type={Icons.Feather}
              name={iconName}
              size={moderateScale(14)}
              color={iconColor}
            />
          </View>
          <Text medium FONT_13 style={[styles.itemLabel, textColor && { color: textColor }]}>
            {label}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
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
                  style={{ color: colors.textSecondary, marginRight: scale(6) }}
                >
                  {valueLabel}
                </Text>
              )}
              <AnyIcon
                type={Icons.Feather}
                name="chevron-right"
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
