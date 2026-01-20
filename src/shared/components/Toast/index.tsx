import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import Toast, { BaseToastProps } from "react-native-toast-message";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import { fontFamily } from "@theme/fonts";

type ToastType = "success" | "info" | "warning" | "danger";

const toastIcons: Record<ToastType, { name: string; color: string }> = {
  success: { name: "checkcircle", color: colors.success },
  info: { name: "infocirlce", color: colors.info },
  warning: { name: "warning", color: colors.warning },
  danger: { name: "closecircle", color: colors.danger },
};

const ToastView = ({
  text1,
  text2,
  type,
  onPress,
}: BaseToastProps & { type: ToastType; onPress?: () => void }) => {
  const iconData = toastIcons[type] || toastIcons.info;
  const translateY = useRef(new Animated.Value(-20)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.back(1)),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, opacity]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -20,
        duration: 250,
        easing: Easing.in(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => Toast.hide());
  };

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress || handleDismiss}
        style={styles.container}
      >
        <View style={[styles.accent, { backgroundColor: iconData.color }]} />

        <View style={styles.contentRow}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: withOpacity(iconData.color, 0.12) },
            ]}
          >
            <AnyIcon
              type={Icons.AntDesign}
              name={iconData.name}
              size={20}
              color={iconData.color}
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {text1}
            </Text>
            {text2 ? (
              <Text style={styles.description} numberOfLines={2}>
                {text2}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={handleDismiss}
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <AnyIcon
              type={Icons.AntDesign}
              name="close"
              size={16}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export const toastConfig = {
  success: (props: BaseToastProps) => <ToastView {...props} type="success" />,
  info: (props: BaseToastProps) => <ToastView {...props} type="info" />,
  warning: (props: BaseToastProps) => <ToastView {...props} type="warning" />,
  danger: (props: BaseToastProps) => <ToastView {...props} type="danger" />,
};

export const showToast = (
  type: ToastType,
  title: string,
  description?: string,
  duration = 4000,
) => {
  Toast.show({
    type,
    text1: title,
    text2: description,
    visibilityTime: duration,
  });
};

export const showSuccessToast = (
  title: string,
  description?: string,
  duration?: number,
) => showToast("success", title, description, duration);
export const showErrorToast = (
  title: string,
  description?: string,
  duration?: number,
) => showToast("danger", title, description, duration);
export const showInfoToast = (
  title: string,
  description?: string,
  duration?: number,
) => showToast("info", title, description, duration);
export const showWarningToast = (
  title: string,
  description?: string,
  duration?: number,
) => showToast("warning", title, description, duration);

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    alignItems: "center",
    zIndex: 9999,
    elevation: 9999,
    paddingHorizontal: 16,
  },
  container: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: 16,
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  accent: {
    width: 6,
    height: "100%",
  },
  contentRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    color: colors.text,
    fontFamily: fontFamily.BOLD,
    lineHeight: 20,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: fontFamily.MEDIUM,
    lineHeight: 18,
    marginTop: 2,
  },
  closeButton: {
    padding: 2,
  },
});
