import React, { useContext } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNetInfo } from "@react-native-community/netinfo";
import Text from "@components/AppText";
import { verticalScale, moderateScale } from "react-native-size-matters";
import { ThemeContext } from "@providers/ThemeProvider";

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: any;
  header?: React.ReactNode;
  fixedHeader?: boolean;
  statusBarColor?: string;
  statusBarStyle?: "default" | "light-content" | "dark-content";
  showNetworkBanner?: boolean;
  loading?: boolean;
  loadingText?: string;
  safeArea?: boolean;
  scrollable?: boolean;
  backgroundColor?: string;
  centerContent?: boolean;
  centerHorizontal?: boolean;
  centerVertical?: boolean;
}

const HEADER_HEIGHT = verticalScale(60);

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  header,
  fixedHeader = false,
  statusBarColor,
  statusBarStyle,
  showNetworkBanner = true,
  loading = false,
  loadingText = "Loading...",
  safeArea = true,
  scrollable = false,
  backgroundColor,
  centerContent = false,
  centerHorizontal = false,
  centerVertical = false,
}) => {
  const insets = useSafeAreaInsets();
  const netInfo = useNetInfo();
  const isOffline = !netInfo.isConnected;
  const theme = useContext(ThemeContext);

  const Container = scrollable ? ScrollView : View;

  const getCenteringStyles = () => {
    if (centerContent) {
      return styles.centeredContent;
    }

    const centeringStyles: any = {};
    if (centerHorizontal) {
      centeringStyles.justifyContent = "center";
    }
    if (centerVertical) {
      centeringStyles.alignItems = "center";
    }
    return centeringStyles;
  };

  const containerStyle = fixedHeader ? { marginTop: HEADER_HEIGHT } : {};
  const centeringStyles = getCenteringStyles();

  const bgColor = backgroundColor || theme.background;
  const barColor = statusBarColor || theme.background;
  const barStyle =
    statusBarStyle ||
    (theme.mode === "dark" ? "light-content" : "dark-content");

  const scrollContentContainerStyle = [
    scrollable && styles.scrollContent,
    scrollable && centeringStyles,
  ];

  const viewContainerStyle = [
    styles.container,
    { backgroundColor: bgColor },
    containerStyle,
    !scrollable && centeringStyles,
  ];

  return (
    <>
      <StatusBar backgroundColor={barColor} barStyle={barStyle} />
      <View
        style={[
          styles.wrapper,
          style,
          {
            backgroundColor: bgColor,
            paddingTop: safeArea ? insets.top : 0,
            paddingBottom: safeArea ? insets.bottom : 0,
            paddingLeft: safeArea ? insets.left : 0,
            paddingRight: safeArea ? insets.right : 0,
          },
        ]}
      >
        {fixedHeader && header && (
          <View
            style={[
              styles.fixedHeaderContainer,
              {
                height: HEADER_HEIGHT,
                backgroundColor: theme.card,
                borderBottomColor: theme.border,
              },
            ]}
          >
            {header}
          </View>
        )}

        {showNetworkBanner && isOffline && (
          <View
            style={[styles.offlineBanner, { backgroundColor: theme.primary }]}
          >
            <Text style={styles.offlineText}>No internet connection</Text>
          </View>
        )}

        <Container
          style={scrollable ? undefined : viewContainerStyle}
          contentContainerStyle={
            scrollable ? scrollContentContainerStyle : undefined
          }
        >
          {!fixedHeader && header}
          {children}
        </Container>

        {loading && (
          <View
            style={[
              styles.loadingOverlay,
              {
                backgroundColor:
                  theme.mode === "dark"
                    ? "rgba(0,0,0,0.6)"
                    : "rgba(255,255,255,0.8)",
              },
            ]}
          >
            <ActivityIndicator size="large" color={theme.primary} />
            <Text style={[styles.loadingText, { color: theme.text }]}>
              {loadingText}
            </Text>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: moderateScale(16),
    paddingHorizontal: moderateScale(20),
  },
  centeredContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fixedHeaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    justifyContent: "center",
    paddingHorizontal: moderateScale(16),
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  offlineBanner: {
    padding: verticalScale(10),
    alignItems: "center",
  },
  offlineText: {
    color: "white",
    fontWeight: "bold",
    fontSize: moderateScale(14),
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: verticalScale(10),
    fontSize: moderateScale(16),
  },
});

export default ScreenWrapper;
