import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";
import Text from "@components/AppText";
import { colors } from "@theme/colors";

interface AppButtonProps {
  title: string;
  onPress: () => void;

  /** Visual control */
  backgroundColor?: string;
  textColor?: string;

  /** Layout */
  style?: ViewStyle;
  textStyle?: TextStyle;
  marginBottom?: number;
  isNotFull?: boolean;

  /** States */
  disabled?: boolean;
  loading?: boolean;

  /** Variants */
  variant?: "primary" | "outline" | "text";
}

const AppButton: React.FC<AppButtonProps> = ({
  title,
  onPress,
  backgroundColor,
  textColor = colors.white,
  style,
  textStyle,
  marginBottom,
  isNotFull = false,
  disabled = false,
  loading = false,
  variant = "primary",
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "outline":
        return {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: colors.primary,
        };
      case "text":
        return {
          backgroundColor: "transparent",
        };
      default:
        return {
          backgroundColor: backgroundColor ?? colors.primary,
        };
    }
  };

  const getTextColor = () => {
    if (textColor !== colors.white) return textColor;
    return variant === "outline" || variant === "text"
      ? colors.primary
      : colors.white;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.button,
        getVariantStyles(),
        {
          marginBottom,
        },
        isNotFull && styles.autoWidth,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text
          bold
          FONT_16
          style={[styles.text, { color: getTextColor() }, textStyle]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  button: {
    height: verticalScale(48),
    borderRadius: moderateScale(12),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(20),
    width: "100%",
  },
  text: {
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.5,
  },
  autoWidth: {
    width: "auto",
  },
});
