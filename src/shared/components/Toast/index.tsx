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
import { colors } from "@theme/colors";
import { fontFamily } from "@theme/fonts";

type ToastType = "success" | "info" | "warning" | "danger";

const toastIcons: Record<ToastType, { name: string; color: string }> = {
  success: { name: "checkcircle", color: colors.success },
  info: { name: "infocirlce", color: colors.info },
  warning: { name: "warning", color: colors.warning },
  danger: { name: "closecircle", color: colors.danger },
};

const CARD_BG = colors.white;
const TITLE_COLOR = colors.textPrimary;
const DESC_COLOR = colors.textSecondary;

const ToastView = ({
  text1,
  text2,
  type,
  onPress,
}: BaseToastProps & { type: ToastType; onPress?: () => void }) => {
  const iconData = toastIcons[type] || toastIcons.info;
  const translateY = useRef(new Animated.Value(-28)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 240,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start();
  }, [translateY, opacity]);

  const handleDismiss = () => {
    // slide up then hide
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -28,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 180,
        easing: Easing.linear,
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
        onPress={handleDismiss}
        style={[styles.container, { backgroundColor: CARD_BG }]}
      >
        <View style={[styles.accent, { backgroundColor: iconData.color }]} />

        <View style={styles.iconBox}>
          <View
            style={[styles.iconCircle, { backgroundColor: iconData.color }]}
          >
            <AnyIcon
              type={Icons.AntDesign}
              name={iconData.name}
              size={18}
              color={colors.white}
            />
          </View>
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {text1}
          </Text>
          {text2 ? (
            <Text
              style={styles.description}
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {text2}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity
          onPress={handleDismiss}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <AnyIcon
            type={Icons.AntDesign}
            name="close"
            size={18}
            color={DESC_COLOR}
          />
        </TouchableOpacity>
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
  duration = 3500,
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
    // ensure wrapper sits above other UI
    zIndex: 9999,
    elevation: 9999,
    paddingHorizontal: 8,
    // top spacing bias is handled by <Toast position="top" topOffset={...} />
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "94%",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: Platform.OS === "ios" ? 0.08 : 0.22,
    shadowRadius: 18,
    elevation: 8,
    overflow: "hidden",
  },
  accent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  iconBox: {
    marginLeft: 8,
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary ?? "#007AFF", // fallback
  },
  textContainer: {
    flex: 1,
    paddingRight: 8,
  },
  title: {
    fontSize: 15,
    color: TITLE_COLOR,
    fontFamily: fontFamily.BOLD,
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: DESC_COLOR,
    fontFamily: fontFamily.REGULAR,
    lineHeight: 18,
  },
});
