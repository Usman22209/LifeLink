import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Spinner from "react-native-loading-spinner-overlay";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";

const AnimatedLoader = ({
  visible = true,
  overlayColor = "rgba(0, 0, 0, 0.7)",
  primaryColor = "#4A90E2",
  secondaryColor1 = "#F5A623",
  size = 180,
}) => {
  const rotation = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 2000, easing: Easing.linear }), -1);

    scale.value = withRepeat(
      withTiming(1.08, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );

    return () => {
      rotation.value = 0;
      scale.value = 1;
    };
  }, []);

  const rotatingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const counterRotatingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-rotation.value * 1.5}deg` }],
  }));

  const pulsingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const innerCircumference = 2 * Math.PI * 30;
  const innerDashArray = `${innerCircumference / 4} ${innerCircumference / 4}`;

  return (
    <Spinner
      visible={visible}
      customIndicator={
        <View style={styles.loaderContainer}>
          <Animated.View style={pulsingStyle}>
            <Animated.View style={rotatingStyle}>
              <Svg width={size} height={size} viewBox="0 0 100 100">
                <Circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke={primaryColor}
                  strokeWidth="4"
                  strokeDasharray="70 30"
                  fill="none"
                  strokeLinecap="round"
                />
              </Svg>
            </Animated.View>

            <Animated.View style={[counterRotatingStyle, StyleSheet.absoluteFill]}>
              <Svg width={size} height={size} viewBox="0 0 100 100">
                <Circle
                  cx="50"
                  cy="50"
                  r="30"
                  stroke={secondaryColor1}
                  strokeWidth="4"
                  strokeDasharray={innerDashArray}
                  fill="none"
                  strokeLinecap="round"
                />
              </Svg>
            </Animated.View>

            <Svg width={size} height={size} viewBox="0 0 100 100" style={StyleSheet.absoluteFill}>
              <Circle cx="50" cy="50" r="8" fill={primaryColor} />
            </Svg>
          </Animated.View>
        </View>
      }
      overlayColor={overlayColor}
    />
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    padding: 25,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
});

export default AnimatedLoader;
