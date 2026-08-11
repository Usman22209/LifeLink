import React from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNetInfo } from "@react-native-community/netinfo";
import Text from "@components/AppText";
import { verticalScale, moderateScale } from "react-native-size-matters";
import { colors } from "@theme/colors";

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: any;
  header?: React.ReactNode;
  statusBarColor?: string;
  statusBarStyle?: "default" | "light-content" | "dark-content";
  showNetworkBanner?: boolean;
  loading?: boolean;
  loadingText?: string;
  safeArea?: boolean;
  scrollable?: boolean;
  backgroundColor?: string;
  disableBottomSafeArea?: boolean;
}

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  header,
  statusBarColor,
  statusBarStyle,
  showNetworkBanner = true,
  loading = false,
  loadingText = "Loading...",
  safeArea = true,
  scrollable = false,
  backgroundColor,
  disableBottomSafeArea = false,
}) => {
  const insets = useSafeAreaInsets();
  const netInfo = useNetInfo();
  const isOffline = !netInfo.isConnected;

  const Container = scrollable ? ScrollView : View;
  const bgColor = backgroundColor || colors.background;

  return (
    <>
      <StatusBar
        backgroundColor={statusBarColor || colors.primary}
        barStyle={statusBarStyle || "light-content"}
      />
      <View
        style={[
          styles.wrapper,
          {
            backgroundColor: bgColor,
            paddingBottom:
              safeArea && !disableBottomSafeArea ? insets.bottom : 0,
            paddingLeft: safeArea ? insets.left : 0,
            paddingRight: safeArea ? insets.right : 0,
          },
          style,
        ]}
      >
        {header && <View style={styles.headerContainer}>{header}</View>}

        {showNetworkBanner && isOffline && (
          <View
            style={[styles.offlineBanner, { backgroundColor: colors.primary }]}
          >
            <Text style={styles.offlineText}>No internet connection</Text>
          </View>
        )}

        <Container
          style={styles.container}
          contentContainerStyle={scrollable ? styles.scrollContent : undefined}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </Container>

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.text }]}>
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
  headerContainer: {
    width: "100%",
    zIndex: 10,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingVertical: moderateScale(16),
    paddingHorizontal: moderateScale(20),
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
    backgroundColor: "rgba(255,255,255,0.8)",
    zIndex: 999,
  },
  loadingText: {
    marginTop: verticalScale(10),
    fontSize: moderateScale(16),
  },
});

export default ScreenWrapper;
