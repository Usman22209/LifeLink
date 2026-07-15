import React from "react";
import { View, StyleSheet, TouchableOpacity, I18nManager } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors } from "@theme/colors";

export interface AppHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  rightIcon?: string;
  rightIconType?: any;
  onRightPress?: () => void;
  rightComponent?: React.ReactNode;
  leftComponent?: React.ReactNode;
  backgroundColor?: string;
  titleColor?: string;
  iconColor?: string;
  hasBorder?: boolean;
  titleSize?: number;
}

const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  rightIcon,
  rightIconType = Icons.MaterialIcons,
  onRightPress,
  rightComponent,
  leftComponent,
  backgroundColor = colors.background,
  titleColor = colors.text,
  iconColor = colors.text,
  hasBorder = true,
  titleSize = 16,
}) => {
  const navigation = useNavigation();
  const isRtl = I18nManager.isRTL;
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor,
          paddingTop: insets.top,
          borderBottomWidth: hasBorder ? StyleSheet.hairlineWidth : 0,
          borderBottomColor: colors.gray300,
        },
      ]}
    >
      <View
        style={[
          styles.headerRow,
          { flexDirection: isRtl ? "row-reverse" : "row" },
        ]}
      >
        <View
          style={[
            styles.actionContainer,
            { alignItems: isRtl ? "flex-end" : "flex-start" },
          ]}
        >
          {leftComponent
            ? leftComponent
            : showBackButton && (
                <TouchableOpacity
                  onPress={handleBack}
                  style={styles.iconButton}
                  activeOpacity={0.6}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <AnyIcon
                    type={Icons.Ionicons}
                    name={isRtl ? "chevron-forward" : "chevron-back"}
                    size={moderateScale(20)}
                    color={iconColor}
                  />
                </TouchableOpacity>
              )}
        </View>

        <View style={styles.titleContainer}>
          {title && (
            <Text
              bold
              FONT_16
              style={[
                styles.titleText,
                { color: titleColor, fontSize: moderateScale(titleSize) },
              ]}
              numberOfLines={1}
            >
              {title}
            </Text>
          )}
        </View>

        <View
          style={[
            styles.actionContainer,
            { alignItems: isRtl ? "flex-start" : "flex-end" },
          ]}
        >
          {rightComponent
            ? rightComponent
            : rightIcon && (
                <TouchableOpacity
                  onPress={onRightPress}
                  style={styles.iconButton}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <AnyIcon
                    type={rightIconType}
                    name={rightIcon}
                    size={moderateScale(20)}
                    color={iconColor}
                  />
                </TouchableOpacity>
              )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    zIndex: 10,
  },
  headerRow: {
    paddingVertical: verticalScale(10),
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: scale(16),
  },
  actionContainer: {
    width: scale(60),
    alignItems: "flex-start",
    justifyContent: "center",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    textAlign: "center",
  },
  iconButton: {
    paddingVertical: verticalScale(4),
    justifyContent: "center",
    alignItems: "flex-start",
  },
});

export default AppHeader;
