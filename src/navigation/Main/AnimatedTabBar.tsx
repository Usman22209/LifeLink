import React, { useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  Dimensions,
  I18nManager,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@theme/colors";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";

const TAB_COUNT = 5;
const CENTER_INDEX = 2;
const SCREEN_WIDTH = Dimensions.get("window").width;
const TAB_WIDTH = SCREEN_WIDTH / TAB_COUNT;
const INDICATOR_WIDTH = scale(32);

const FAB_SIZE = moderateScale(50);
const FAB_RING_SIZE = FAB_SIZE + moderateScale(8);

const AnimatedTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();
  const previousIndex = useRef(0);

  const indicatorX = useRef(new Animated.Value(0)).current;
  const indicatorOpacity = useRef(
    new Animated.Value(state.index !== CENTER_INDEX ? 1 : 0),
  ).current;

  const tabScales = useRef(
    state.routes.map((_, i) => new Animated.Value(i === state.index ? 1 : 0)),
  ).current;

  const fabScale = useRef(
    new Animated.Value(state.index === CENTER_INDEX ? 1.08 : 1),
  ).current;
  const fabRotation = useRef(
    new Animated.Value(state.index === CENTER_INDEX ? 1 : 0),
  ).current;

  useEffect(() => {
    const isCenter = state.index === CENTER_INDEX;

    if (!isCenter) {
      previousIndex.current = state.index;
    }

    const isRtl = I18nManager.isRTL;
    if (!isCenter) {
      const visualIndex = isRtl ? TAB_COUNT - 1 - state.index : state.index;
      const target =
        visualIndex * TAB_WIDTH + (TAB_WIDTH - INDICATOR_WIDTH) / 2;

      Animated.parallel([
        Animated.spring(indicatorX, {
          toValue: target,
          useNativeDriver: true,
          damping: 18,
          stiffness: 200,
          mass: 0.8,
        }),
        Animated.timing(indicatorOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.timing(indicatorOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }

    Animated.parallel([
      Animated.spring(fabScale, {
        toValue: isCenter ? 1.08 : 1,
        useNativeDriver: true,
        damping: 14,
        stiffness: 180,
      }),
      Animated.spring(fabRotation, {
        toValue: isCenter ? 1 : 0,
        useNativeDriver: true,
        damping: 14,
        stiffness: 180,
      }),
    ]).start();

    tabScales.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: index === state.index ? 1 : 0,
        useNativeDriver: true,
        damping: 15,
        stiffness: 180,
      }).start();
    });
  }, [
    state.index,
    indicatorX,
    indicatorOpacity,
    fabScale,
    fabRotation,
    tabScales,
  ]);

  const bottomPadding =
    Platform.OS === "ios" ? insets.bottom : verticalScale(6);
  const fabSpin = fabRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "45deg"],
  });
  const isRtl = I18nManager.isRTL;

  return (
    <View style={[styles.barContainer, { paddingBottom: bottomPadding }]}>
      <Animated.View
        style={[
          styles.indicator,
          {
            width: INDICATOR_WIDTH,
            opacity: indicatorOpacity,
            transform: [{ translateX: indicatorX }],
          },
        ]}
      />

      {state.routes.map((_, index) => {
        const originalIndex = isRtl ? TAB_COUNT - 1 - index : index;
        const route = state.routes[originalIndex];
        const { options } = descriptors[route.key];
        const isFocused = state.index === originalIndex;
        const isCenter = originalIndex === CENTER_INDEX;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({ type: "tabLongPress", target: route.key });
        };

        if (isCenter) {
          const onFabPress = () => {
            if (isFocused) {
              const prevRoute = state.routes[previousIndex.current];
              if (prevRoute) {
                navigation.navigate(prevRoute.name);
              }
            } else {
              onPress();
            }
          };

          return (
            <View key={route.key} style={styles.tab}>
              <View style={styles.fabOuter}>
                <View style={styles.fabRing}>
                  <TouchableOpacity
                    accessibilityRole="button"
                    accessibilityLabel={isFocused ? "Close" : "Create Request"}
                    onPress={onFabPress}
                    activeOpacity={0.85}
                  >
                    <Animated.View
                      style={[
                        styles.fab,
                        {
                          transform: [{ scale: fabScale }, { rotate: fabSpin }],
                        },
                      ]}
                    >
                      {options.tabBarIcon &&
                        options.tabBarIcon({
                          focused: isFocused,
                          color: colors.white,
                          size: moderateScale(26),
                        })}
                    </Animated.View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.fabSpacer} />
            </View>
          );
        }

        const iconScale = tabScales[originalIndex].interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.1],
        });
        const labelOpacity = tabScales[originalIndex].interpolate({
          inputRange: [0, 1],
          outputRange: [0.5, 1],
        });
        const iconColor = isFocused ? colors.primary : colors.gray600;

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.7}
            style={styles.tab}
          >
            <Animated.View style={{ transform: [{ scale: iconScale }] }}>
              {options.tabBarIcon &&
                options.tabBarIcon({
                  focused: isFocused,
                  color: iconColor,
                  size: moderateScale(21),
                })}
            </Animated.View>

            <Animated.Text
              style={[
                styles.label,
                { color: iconColor, opacity: labelOpacity },
              ]}
              numberOfLines={1}
            >
              {typeof options.tabBarLabel === "string"
                ? options.tabBarLabel
                : route.name}
            </Animated.Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default AnimatedTabBar;

const styles = StyleSheet.create({
  barContainer: {
    flexDirection: "row",
    backgroundColor: colors.white,
    // Soft top border — primary separator on Android (elevation casts downward, not up)
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.07)",
    paddingTop: verticalScale(10),
    // iOS: upward shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    // Android: elevation gives a downward shadow; the borderTop handles the visual separation
    elevation: 16,
  },
  indicator: {
    position: "absolute",
    top: 0,
    height: verticalScale(3),
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: colors.primary,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(4),
  },
  label: {
    fontFamily: "Montserrat-SemiBold",
    fontSize: moderateScale(9.5),
    marginTop: verticalScale(3),
  },
  fabOuter: {
    position: "absolute",
    top: -(FAB_SIZE / 2) - verticalScale(2),
    alignItems: "center",
    justifyContent: "center",
  },
  fabRing: {
    width: FAB_RING_SIZE,
    height: FAB_RING_SIZE,
    borderRadius: FAB_RING_SIZE / 2,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 14,
  },
  fab: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  fabSpacer: {
    height: verticalScale(20),
  },
});
