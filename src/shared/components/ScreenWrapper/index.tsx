import React from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetInfo } from '@react-native-community/netinfo';
import Text from '../AppText';
import { colors } from '../../theme/colors';
import {
  scale,
  verticalScale,
  moderateScale,
} from 'react-native-size-matters';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: any;
  header?: React.ReactNode;
  fixedHeader?: boolean;
  statusBarColor?: string;
  statusBarStyle?: 'default' | 'light-content' | 'dark-content';
  showNetworkBanner?: boolean;
  loading?: boolean;
  loadingText?: string;
  safeArea?: boolean;
  scrollable?: boolean;
  backgroundColor?: string;
}

const HEADER_HEIGHT = verticalScale(60);

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  header,
  fixedHeader = false,
  statusBarColor = colors.secondary,
  statusBarStyle = 'dark-content',
  showNetworkBanner = true,
  loading = false,
  loadingText = 'Loading...',
  safeArea = true,
  scrollable = false,
  backgroundColor = colors.white,
}) => {
  const netInfo = useNetInfo();
  const isOffline = !netInfo.isConnected;

  const renderContent = () => {
    const Container = scrollable ? ScrollView : View;
    const containerStyle = fixedHeader ? { marginTop: HEADER_HEIGHT } : {};
    return (
      <Container
        style={[styles.container, { backgroundColor }, containerStyle]}
        contentContainerStyle={scrollable ? styles.scrollContent : undefined}>
        {!fixedHeader && header}
        {children}
      </Container>
    );
  };

  const Wrapper = safeArea ? SafeAreaView : View;

  return (
    <>
      <StatusBar backgroundColor={statusBarColor} barStyle={statusBarStyle} />
      <Wrapper
        style={[styles.wrapper, style, { backgroundColor }]}
        edges={safeArea ? ['top', 'left', 'right', 'bottom'] : []}>
        {fixedHeader && header && (
          <View style={[styles.fixedHeaderContainer, { height: HEADER_HEIGHT }]}>
            {header}
          </View>
        )}

        {showNetworkBanner && isOffline && (
          <View style={styles.offlineBanner}>
            <Text style={styles.offlineText}>No internet connection</Text>
          </View>
        )}

        {renderContent()}

        {loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>{loadingText}</Text>
          </View>
        )}
      </Wrapper>
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
    padding: moderateScale(16),
  },
  fixedHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: colors.white,
    justifyContent: 'center',
    paddingHorizontal: moderateScale(16),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  offlineBanner: {
    backgroundColor: colors.danger,
    padding: verticalScale(10),
    alignItems: 'center',
  },
  offlineText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: moderateScale(14),
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: verticalScale(10),
    fontSize: moderateScale(16),
  },
});

export default ScreenWrapper;
