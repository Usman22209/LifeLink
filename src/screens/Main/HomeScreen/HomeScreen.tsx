import React from "react";
import { View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { scale, moderateScale, verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import Text from "@components/AppText";
import ScreenWrapper from "@components/ScreenWrapper";
import { useSelector } from "react-redux";
import { selectUser } from "@store/slices/authSlice";
import { ROUTES } from "@utils/Routes";
import { colors } from "@theme/colors";
import HomeHeader from "./components/HomeHeader";
import BloodTypeCard from "./components/BloodTypeCard";
import DonationEligibilityCard from "./components/DonationEligibilityCard";
import UrgentRequestCard from "./components/UrgentRequestCard";
import type { UrgentRequestData } from "./components/UrgentRequestCard";


const MOCK_URGENT_REQUESTS: UrgentRequestData[] = [
  {
    id: "1",
    bloodType: "B+",
    hospital: "Mayo Hospital",
    city: "Lahore",
    units: 3,
    urgency: "critical",
    time: "2h ago",
    distance: "3.2 km",
  },
  {
    id: "2",
    bloodType: "A-",
    hospital: "Jinnah Hospital",
    city: "Lahore",
    units: 2,
    urgency: "urgent",
    time: "4h ago",
    distance: "5.1 km",
  },
  {
    id: "3",
    bloodType: "O-",
    hospital: "Services Hospital",
    city: "Lahore",
    units: 1,
    urgency: "normal",
    time: "6h ago",
    distance: "1.8 km",
  },
];

const HomeScreen = () => {
  const navigation = useNavigation<any>();
  const user = useSelector(selectUser);

  return (
    <ScreenWrapper
      backgroundColor={colors.background}
      safeArea
      scrollable
      style={styles.wrapper}
      header={
        <HomeHeader
          userName={user?.full_name || user?.email || "User"}
          notificationCount={3}
          onNotificationPress={() => navigation.navigate(ROUTES.NOTIFICATIONS)}
          onProfilePress={() => navigation.navigate(ROUTES.PROFILE)}
        />
      }
    >

      <BloodTypeCard
        bloodType="O+"
        subtitle="Universal Donor"
        donations={5}
        livesSaved={12}
        lastDonated="Mar 12"
      />


      <View style={styles.sectionGap}>
        <DonationEligibilityCard
          daysUntilEligible={0}
          totalDaysCycle={56}
          onDonatePress={() => navigation.navigate(ROUTES.REQUEST)}
        />
      </View>


      <View style={styles.sectionHeader}>
        <Text semiBold FONT_16 style={{ color: colors.text }}>
          Urgent Requests
        </Text>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate(ROUTES.FEED)}
        >
          <Text semiBold FONT_12 style={{ color: colors.primary }}>
            See All
          </Text>
        </TouchableOpacity>
      </View>


      <View style={styles.urgentScrollWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.urgentScroll}
        >
          {MOCK_URGENT_REQUESTS.map((request) => (
            <UrgentRequestCard key={request.id} {...request} />
          ))}
        </ScrollView>
      </View>

      <View style={{ height: verticalScale(30) }} />
    </ScreenWrapper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  wrapper: { flex: 1 },
  sectionGap: {
    marginTop: verticalScale(12),
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: verticalScale(20),
    marginBottom: verticalScale(12),
  },
  urgentScrollWrapper: {
    marginHorizontal: -moderateScale(20),
  },
  urgentScroll: {
    paddingHorizontal: moderateScale(20),
    gap: scale(12),
  },
});