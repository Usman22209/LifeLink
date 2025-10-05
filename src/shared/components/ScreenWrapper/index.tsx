import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ViewStyle,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import {useNetInfo} from '@react-native-community/netinfo';
import Text from '../AppText';
import { colors } from '../../theme/colors';

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

const HEADER_HEIGHT = 60;

const ScreenWrapper: React.FC<ScreenWrapperProps> = ({
  children,
  style,
  header,
  fixedHeader = false,
  statusBarColor = '#fff',
  statusBarStyle = 'dark-content',
  showNetworkBanner = true,
  loading = false,
  loadingText = 'Loading...',
  safeArea = true,
  scrollable = false,
  backgroundColor = '#fff',
}) => {
  const netInfo = useNetInfo();
  const isOffline = !netInfo.isConnected;

  const renderContent = () => {
    const Container = scrollable ? ScrollView : View;
    const containerStyle = fixedHeader ? {marginTop: HEADER_HEIGHT} : {};
    return (
      <Container
        style={[styles.container, {backgroundColor}, containerStyle]}
        contentContainerStyle={scrollable ? styles.scrollContent : undefined}>
        {/* If header is not fixed, render it inside the scrollable content */}
        {!fixedHeader && header}
        {children}
      </Container>
    );
  };

  const Wrapper = safeArea ? SafeAreaView : View;

  return (
    <>
      <StatusBar backgroundColor={statusBarColor} barStyle={statusBarStyle} />
      <Wrapper style={[{flex: 1}, style]}>
        {/* If fixedHeader is true, render header separately (outside of the scrollable content) */}
        {fixedHeader && header && (
          <View style={[styles.fixedHeaderContainer, {height: HEADER_HEIGHT}]}>
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
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  fixedHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#ddd',
  },
  offlineBanner: {
    backgroundColor: '#ff4444',
    padding: 10,
    alignItems: 'center',
  },
  offlineText: {
    color: 'white',
    fontWeight: 'bold',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default ScreenWrapper;
