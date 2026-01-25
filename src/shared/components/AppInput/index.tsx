import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { colors } from "@theme/colors";
import Text from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { Controller } from "react-hook-form";
import { useSelector } from "react-redux";
import { selectIsRtl } from "@store/slices/appSlice";

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
  iconSize = moderateScale(18),
  marginBottom = verticalScale(12),
  name,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isRtl = useSelector(selectIsRtl);

  const renderInput = (fieldProps?: any) => (
    <TextInput
      autoCapitalize="none"
      {...props}
      {...fieldProps}
      value={fieldProps?.value ?? value}
      onChangeText={fieldProps?.onChange ?? onChangeText}
      placeholder={placeholder}
      placeholderTextColor={colors.placeholder}
      keyboardType={keyboardType}
      secureTextEntry={secureText ? !showPassword : false}
      style={[
        styles.input,
        {
          color: colors.text,
          textAlign: isRtl ? "right" : "left",
        },
        inputStyle,
      ]}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        setFocused(false);
        fieldProps?.onBlur?.(e);
      }}
    />
  );

  return (
    <View style={{ marginBottom }}>
      {label && (
        <Text semiBold FONT_14 style={[styles.label, { color: colors.text }]}>
          {label}
        </Text>
      )}

      <View
        style={[
          styles.container,
          {
            borderColor: error
              ? colors.error
              : focused
                ? colors.primary
                : colors.border,
            backgroundColor: colors.card,
          },
          containerStyle,
        ]}
      >
        <View
          style={[
            styles.inputRow,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          {iconName && (
            <AnyIcon
              type={iconType}
              name={iconName}
              size={iconSize}
              color={focused ? colors.primary : colors.textSecondary}
              style={[
                styles.icon,
                { [isRtl ? "marginLeft" : "marginRight"]: scale(10) },
              ]}
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
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {error && (
        <Text FONT_12 style={[styles.errorText, { color: colors.error }]}>
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
