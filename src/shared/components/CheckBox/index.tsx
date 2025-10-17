import { colors } from "@theme/colors";
import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface CheckBoxProps {
  isChecked?: boolean;
  onPress: () => void;
  size?: number;
  checkedColor?: string;
  uncheckedColor?: string;
  style?: ViewStyle;
}

const CheckBox: React.FC<CheckBoxProps> = ({
  isChecked = false,
  onPress,
  size = 24,
  checkedColor = colors.primary,
  uncheckedColor = colors.black,
  style,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
      <Icon
        name={isChecked ? "check-box" : "check-box-outline-blank"}
        size={size}
        color={isChecked ? checkedColor : uncheckedColor}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CheckBox;
