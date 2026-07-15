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
import { MOCK_DONATIONS } from "@shared/constants/mockData";

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
