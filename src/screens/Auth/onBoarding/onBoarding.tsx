import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import PagerView, { PagerViewOnPageScrollEvent, PagerViewOnPageSelectedEvent } from 'react-native-pager-view';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { scale, moderateScale } from 'react-native-size-matters';

import ScreenWrapper from '@components/ScreenWrapper';
import Text from '@components/AppText';
import AnyIcon, { Icons } from '@components/AnyIcon';
import { colors } from '@theme/colors';
import { styles } from './styles';
interface Page {
  icon: { type: typeof Icons; name: string };
  title: string;
  description: string;
}

const Onboarding: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const pagerRef = useRef<PagerView>(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const pages: Page[] = [
    {
      icon: { type: Icons.FontAwesome5, name: 'heartbeat' },
      title: 'Connect Donors & Patients',
      description: 'Real-time blood donation network connecting those in need with verified donors across Pakistan.',
    },
    {
      icon: { type: Icons.FontAwesome5, name: 'brain' },
      title: 'AI-Powered Recommendations',
      description: 'Smart matching algorithm considers health metrics, location, and availability to find the best donor matches.',
    },
    {
      icon: { type: Icons.Feather, name: 'wifi-off' },
      title: 'Offline Capability',
      description: 'TensorFlow Lite integration enables AI predictions without internet connectivity for rural accessibility.',
    },
    {
      icon: { type: Icons.FontAwesome5, name: 'globe' },
      title: 'Localized Experience',
      description: 'Full Urdu language support and designed specifically for Pakistani healthcare infrastructure.',
    },
  ];

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0.6, duration: 200, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [currentPage]);

  const onPageSelected = (e: PagerViewOnPageSelectedEvent) => setCurrentPage(e.nativeEvent.position);
  const onPageScroll = (e: PagerViewOnPageScrollEvent) =>
    scrollX.setValue(e.nativeEvent.position + e.nativeEvent.offset);

  const goToPage = (page: number) => pagerRef.current?.setPage(page);

  const handleNext = () => {
    if (currentPage < pages.length - 1) goToPage(currentPage + 1);
    else console.log('Navigate → Main App');
  };

  const handleBack = () => {
    if (currentPage > 0) goToPage(currentPage - 1);
  };

  const Header = (
    <View style={styles.topBar}>
      <View style={styles.logoContainer}>
        <View style={styles.logoIcon}>
          <AnyIcon type={Icons.FontAwesome5} name="tint" size={moderateScale(18)} color={colors.primary} />
        </View>
        <Text FONT_20 semiBold>
          Life Link
        </Text>
      </View>
      {currentPage < pages.length - 1 && (
        <TouchableOpacity onPress={() => goToPage(pages.length - 1)} activeOpacity={0.7}>
          <Text FONT_16 semiBold color={colors.gray}>
            Skip
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaProvider>
      <ScreenWrapper
        header={Header}
        fixedHeader
        backgroundColor={colors.white}
        statusBarColor={colors.white}
        statusBarStyle="dark-content"
        showNetworkBanner
        safeArea
      >
        <PagerView
          ref={pagerRef}
          style={styles.pagerView}
          initialPage={0}
          onPageSelected={onPageSelected}
          onPageScroll={onPageScroll}
        >
          {pages.map((page, index) => (
            <View key={index} style={styles.pageContainer}>
              <View style={styles.contentWrapper}>
                <Animated.View style={[styles.iconContainer, { opacity: fadeAnim }]}>
                  <View style={styles.iconCircle}>
                    <AnyIcon type={page.icon.type} name={page.icon.name} size={moderateScale(80)} color={colors.primary} />
                  </View>
                </Animated.View>

                <Animated.View style={[styles.textContainer, { opacity: fadeAnim }]}>
                  <Text FONT_26 bold style={styles.title}>
                    {page.title}
                  </Text>
                  <Text FONT_16 color={colors.gray} style={styles.description}>
                    {page.description}
                  </Text>
                </Animated.View>
              </View>
            </View>
          ))}
        </PagerView>

        <View style={styles.bottomContainer}>
          <View style={styles.paginationContainer}>
            {pages.map((_, index) => {
              const inputRange = [index - 1, index, index + 1];
              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [scale(8), scale(22), scale(8)],
                extrapolate: 'clamp',
              });
              const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.3, 1, 0.3],
                extrapolate: 'clamp',
              });
              return <Animated.View key={index} style={[styles.paginationDot, { width: dotWidth, opacity }]} />;
            })}
          </View>

          <View style={styles.buttonRow}>
            {currentPage > 0 && (
              <TouchableOpacity onPress={handleBack} style={styles.backButton} activeOpacity={0.7}>
                <Text FONT_16 semiBold color={colors.black}>
                  Back
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleNext}
              style={[styles.nextButton, currentPage === 0 && styles.nextButtonFull]}
              activeOpacity={0.85}
            >
              <Text FONT_16 semiBold color={colors.white}>
                {currentPage === pages.length - 1 ? 'Get Started' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenWrapper>
    </SafeAreaProvider>
  );
};

export default Onboarding;
