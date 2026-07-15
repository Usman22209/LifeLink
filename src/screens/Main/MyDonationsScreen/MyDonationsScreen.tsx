import React, { useState, useMemo } from "react";
import { View, FlatList } from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { moderateScale } from "react-native-size-matters";
import ScreenWrapper from "@components/ScreenWrapper";
import AppHeader from "@components/AppHeader";
import AppText from "@components/AppText";
import AnyIcon, { Icons } from "@components/AnyIcon";
import { colors, withOpacity } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { ROUTES } from "@utils/Routes";
import { UserStackParamList } from "@shared/interfaces/navigation/navigation-params.interface";
import { styles } from "./MyDonationsScreen.styles";

import DonationDashboard from "./components/DonationDashboard";
import DonationItem, { DonationLog } from "./components/DonationItem";

const MOCK_DONATIONS: DonationLog[] = [
  {
    id: "log_1",
    hospitalName: "Mayo Hospital",
    date: "2026-03-12",
    units: 1,
    bloodType: "O+",
    request: {
      id: "req_1",
      bloodType: "O+",
      patientName: "Ahmed Khan",
      hospital: "Mayo Hospital",
      city: "Lahore",
      units: 3,
      urgency: "critical",
      time: "2h ago",
      distance: "3.2 km",
    },
  },
  {
    id: "log_2",
    hospitalName: "Jinnah Hospital",
    date: "2025-12-10",
    units: 1,
    bloodType: "A-",
    request: {
      id: "req_2",
      bloodType: "A-",
      patientName: "Sara Malik",
      hospital: "Jinnah Hospital",
      city: "Lahore",
      units: 2,
      urgency: "urgent",
      time: "4h ago",
      distance: "5.1 km",
    },
  },
  {
    id: "log_3",
    hospitalName: "Shaukat Khanum Hospital",
    date: "2025-08-15",
    units: 1,
    bloodType: "B+",
    request: {
      id: "req_3",
      bloodType: "B+",
      patientName: "Bilal Raza",
      hospital: "Shaukat Khanum Hospital",
      city: "Lahore",
      units: 4,
      urgency: "critical",
      time: "30m ago",
      distance: "7.0 km",
    },
  },
  {
    id: "log_4",
    hospitalName: "Services Hospital",
    date: "2025-05-05",
    units: 2,
    bloodType: "AB-",
    request: {
      id: "req_4",
      bloodType: "AB-",
      patientName: "Zubair Ahmad",
      hospital: "Services Hospital",
      city: "Lahore",
      units: 2,
      urgency: "normal",
      time: "1d ago",
      distance: "1.5 km",
    },
  },
  {
    id: "log_5",
    hospitalName: "General Hospital",
    date: "2025-02-01",
    units: 1,
    bloodType: "O-",
    request: {
      id: "req_5",
      bloodType: "O-",
      patientName: "Fatima Bibi",
      hospital: "General Hospital",
      city: "Lahore",
      units: 1,
      urgency: "normal",
      time: "3d ago",
      distance: "8.0 km",
    },
  },
];

const MyDonationsScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<UserStackParamList>>();
  const [donations] = useState<DonationLog[]>(MOCK_DONATIONS);

  const stats = useMemo(() => {
    const totalDonations = donations.length;
    const totalUnits = donations.reduce((sum, item) => sum + item.units, 0);
    const livesSaved = totalUnits * 3;

    let isEligible = true;
    let nextEligibleDateStr = "";

    if (totalDonations > 0) {
      const sorted = [...donations].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
      const latestDonationDate = new Date(sorted[0].date);
      const nextEligibleDate = new Date(latestDonationDate);
      nextEligibleDate.setDate(nextEligibleDate.getDate() + 90);

      const today = new Date("2026-07-15");
      isEligible = today.getTime() >= nextEligibleDate.getTime();

      if (!isEligible) {
        nextEligibleDateStr = nextEligibleDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
    }

    return { totalDonations, livesSaved, isEligible, nextEligibleDateStr };
  }, [donations]);

  const handleItemPress = (item: DonationLog) => {
    navigation.navigate(ROUTES.REQUEST_DETAIL, { request: item.request });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconWrap}>
        <AnyIcon
          type={Icons.Feather}
          name="droplet"
          size={moderateScale(32)}
          color={colors.primary}
        />
      </View>
      <AppText bold FONT_15 style={styles.emptyTitle}>
        No Donations Yet
      </AppText>
      <AppText regular FONT_11 style={styles.emptySubtitle}>
        Your donation history will appear here once you've helped save a life.
      </AppText>
    </View>
  );

  return (
    <ScreenWrapper backgroundColor={colors.background} safeArea>
      <AppHeader
        title={t("profile.myDonationsTitle") || "My Donations"}
        showBackButton
      />

      <FlatList
        data={donations}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16 }}>
            <DonationItem item={item} onPress={handleItemPress} />
          </View>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={renderEmptyState}
        ListHeaderComponent={
          <>
            <DonationDashboard
              totalDonations={stats.totalDonations}
              livesSaved={stats.livesSaved}
              isEligible={stats.isEligible}
              nextEligibleDateStr={stats.nextEligibleDateStr}
            />

            <View style={styles.sectionHeader}>
              <View style={styles.sectionIconWrap}>
                <AnyIcon
                  type={Icons.Feather}
                  name="activity"
                  size={moderateScale(13)}
                  color={colors.primary}
                />
              </View>
              <AppText bold FONT_14 style={styles.sectionTitle}>
                Donation History
              </AppText>
            </View>
          </>
        }
        ListFooterComponent={<View style={{ height: 20 }} />}
      />
    </ScreenWrapper>
  );
};

export default MyDonationsScreen;
