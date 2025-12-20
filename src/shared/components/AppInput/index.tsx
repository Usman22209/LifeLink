import React, { useContext, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TextInputProps,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { ThemeContext } from "@providers/ThemeProvider";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { Control, Controller } from "react-hook-form";

import { AppInputProps } from "@shared/interfaces/components/app-input.interface";

const AppInput: React.FC<AppInputProps> = ({
  label,
  value = "",
  iconType,
  iconName,
  placeholder,
  secureText = false,
  onChangeText,
  error,
  inputStyle,
  containerStyle,
  keyboardType,
  control,
  name,
  ...props
}) => {
  const theme = useContext(ThemeContext);
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const renderInput = (fieldProps?: any) => (
    <TextInput
      {...props}
      {...fieldProps}
      value={fieldProps?.value ?? value}
      onChangeText={fieldProps?.onChange ?? onChangeText}
      placeholder={placeholder}
      placeholderTextColor={theme.placeholder}
      keyboardType={keyboardType}
      autoCapitalize="none"
      secureTextEntry={secureText ? !showPassword : false}
      style={[styles.input, { color: theme.text }, inputStyle]}
      onFocus={() => setFocused(true)}
      onBlur={fieldProps?.onBlur ?? (() => setFocused(false))}
    />
  );

  return (
    <View style={{ marginBottom: verticalScale(12) }}>
      {label && (
        <Text semiBold FONT_14 style={[styles.label, { color: theme.text }]}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.container,
          {
            borderColor: error
              ? theme.error
              : focused
                ? theme.primary
                : theme.border,
            backgroundColor: theme.card,
          },
          containerStyle,
        ]}
      >
        <View style={styles.inputRow}>
          {iconName && (
            <AnyIcon
              type={iconType}
              name={iconName}
              size={moderateScale(18)}
              color={focused ? theme.primary : theme.textSecondary}
              style={styles.icon}
            />
          )}

          {control && name ? (
            <Controller
              name={name}
              control={control}
              render={({ field: { onChange, onBlur, value } }) =>
                renderInput({ onChange, onBlur, value })
              }
            />
          ) : (
            renderInput()
          )}

          {secureText && (
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}
              activeOpacity={0.7}
            >
              <AnyIcon
                type={Icons.MaterialCommunityIcons}
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={moderateScale(18)}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {error && (
        <Text FONT_12 style={[styles.errorText, { color: theme.error }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default AppInput;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  icon: {
    marginRight: scale(10),
  },
  input: {
    flex: 1,
    fontSize: moderateScale(16),
    paddingVertical: verticalScale(6),
  },
  eyeIcon: {
    padding: scale(6),
  },
  label: {
    marginBottom: verticalScale(6),
  },
  errorText: {
    marginTop: verticalScale(4),
  },
});
