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
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      disabled={disabled || loading}
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: backgroundColor ?? colors.primary,
          marginBottom,
        },
        isNotFull && styles.autoWidth,
        disabled && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text
          bold
          FONT_16
          style={[styles.text, { color: textColor }, textStyle]}
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
