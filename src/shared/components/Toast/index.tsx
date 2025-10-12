import React from 'react';
import { View, Text, Animated, Easing, StyleSheet } from 'react-native';
import Toast, { BaseToastProps } from 'react-native-toast-message';
import AnyIcon, { Icons } from '@components/AnyIcon';
import { colors } from '@theme/colors';
import { fontFamily } from '@theme/fonts';

type ToastType = 'success' | 'info' | 'warning' | 'danger';

const toastIcons: Record<ToastType, { name: string; color: string }> = {
  success: { name: 'checkcircle', color: colors.success },
  info: { name: 'infocirlce', color: colors.info },
  warning: { name: 'warning', color: colors.warning },
  danger: { name: 'closecircle', color: colors.danger },
};

const ToastView = ({
  text1,
  text2,
  type,
}: BaseToastProps & { type: ToastType }) => {
  const iconData = toastIcons[type] || toastIcons.info;
  const scaleAnim = new Animated.Value(0.8);

  Animated.timing(scaleAnim, {
    toValue: 1,
    duration: 400,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: iconData.color },
      ]}>
      <Animated.View
        style={[
          styles.iconWrapper,
          { transform: [{ scale: scaleAnim }] },
        ]}>
        <AnyIcon
          type={Icons.AntDesign}
          name={iconData.name}
          size={28}
          color={colors.white}
        />
      </Animated.View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{text1}</Text>
        {text2 ? <Text style={styles.description}>{text2}</Text> : null}
      </View>
    </View>
  );
};

export const toastConfig = {
  success: (props: BaseToastProps) => <ToastView {...props} type="success" />,
  info: (props: BaseToastProps) => <ToastView {...props} type="info" />,
  warning: (props: BaseToastProps) => <ToastView {...props} type="warning" />,
  danger: (props: BaseToastProps) => <ToastView {...props} type="danger" />,
};

export const showSuccessToast = (message: string, description?: string) => {
  Toast.show({ type: 'success', text1: message, text2: description });
};

export const showErrorToast = (message: string, description?: string) => {
  Toast.show({ type: 'danger', text1: message, text2: description });
};

export const showInfoToast = (message: string, description?: string) => {
  Toast.show({ type: 'info', text1: message, text2: description });
};

export const showWarningToast = (message: string, description?: string) => {
  Toast.show({ type: 'warning', text1: message, text2: description });
};

const styles = StyleSheet.create({
  container: {
    elevation: 9999,
    borderRadius: 25,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'center',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  iconWrapper: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'left',
    fontFamily: fontFamily.BOLD,
  },
  description: {
    fontSize: 14,
    color: colors.white,
    fontFamily: fontFamily.REGULAR,
    marginTop: 4,
    opacity: 0.9,
  },
});
