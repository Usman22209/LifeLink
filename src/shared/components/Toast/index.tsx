import React from 'react';
import {StatusBar, Animated, Easing, StyleProp, ViewStyle} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import AnyIcon, {Icons} from '@components/AnyIcon';
import {colors} from '@theme/colors';
import {fontFamily} from '@theme/fonts';

type ToastType = 'success' | 'info' | 'warning' | 'danger';

const toastConfig = {
  animation: {
    duration: 400,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  },
  style: {
    marginTop: StatusBar.currentHeight,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 25,
    flexDirection: 'row',
    width: '90%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

const toastIcons: Record<ToastType, {name: string; color: string}> = {
  success: {name: 'checkcircle', color: colors.success},
  info: {name: 'infocirlce', color: colors.info},
  warning: {name: 'warning', color: colors.warning},
  danger: {name: 'closecircle', color: colors.danger},
};

const showToast = (message: string, type: ToastType, code?: string) => {
  showMessage({
    message: code ? `${message}: ${code}` : message,
    duration: 3000,
    type,
    floating: true,
    icon: () => (
      <Animated.View
        style={{
          marginRight: 12,
          transform: [
            {
              scale: new Animated.Value(0.8).interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }),
            },
          ],
        }}>
        <AnyIcon
          type={Icons.AntDesign}
          name={toastIcons[type].name}
          size={28}
          color={colors.white}
        />
      </Animated.View>
    ),
    textStyle: {
      fontSize: 16,
      color: colors.white,
      textAlign: 'center',
      textTransform: 'capitalize',
      fontFamily: fontFamily.BOLD,
      flexShrink: 1,
    },
    style: {
      ...toastConfig.style,
      backgroundColor: toastIcons[type].color,
    } as StyleProp<ViewStyle>,
  });
};

const showSuccessToast = (message: string, code?: string) =>
  showToast(message, 'success', code);
const showErrorToast = (message: string) => showToast(message, 'danger');
const showInfoToast = (message: string) => showToast(message, 'info');
const showWarningToast = (message: string) => showToast(message, 'warning');

export {showSuccessToast, showErrorToast, showInfoToast, showWarningToast};
