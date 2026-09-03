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
import { useSelector } from "react-redux";
import { selectIsRtl } from "@store/slices/appSlice";
import { UserStackParamList } from "@shared/interfaces/navigation/navigation-params.interface";
import { useMyDonations } from "@shared/query/donations/useDonations";
import { styles } from "./MyDonationsScreen.styles";

import DonationDashboard from "./components/DonationDashboard";
import DonationItem, { DonationLog } from "./components/DonationItem";
import { MOCK_DONATIONS } from "@shared/constants/mockData";

const MyDonationsScreen = () => {
  const { t } = useTranslation();
  const isRtl = useSelector(selectIsRtl);
  const navigation = useNavigation<NavigationProp<UserStackParamList>>();

  const { data: myDonationsData } = useMyDonations();

  const donations: DonationLog[] =
    myDonationsData?.history && Array.isArray(myDonationsData.history)
      ? myDonationsData.history
      : [];

  const stats = useMemo(() => {
    if (myDonationsData?.stats) {
      return {
        totalDonations: myDonationsData.stats.totalDonations ?? donations.length,
        livesSaved: myDonationsData.stats.livesSaved ?? (donations.length * 3),
        isEligible: myDonationsData.stats.isEligible ?? true,
        nextEligibleDateStr: myDonationsData.stats.nextEligibleDateStr || "",
      };
    }

    const totalDonations = donations.length;
    const totalUnits = donations.reduce((sum, item) => sum + (item.units || 1), 0);
    const livesSaved = totalUnits * 3;

    let isEligible = true;
    let nextEligibleDateStr = "";

    if (totalDonations > 0) {
      const validDates = donations
        .map((d) => (d.date ? new Date(d.date) : null))
        .filter((d): d is Date => d !== null && !isNaN(d.getTime()))
        .sort((a, b) => b.getTime() - a.getTime());

      if (validDates.length > 0) {
        const latestDonationDate = validDates[0];
        const nextEligibleDate = new Date(latestDonationDate);
        nextEligibleDate.setDate(nextEligibleDate.getDate() + 90);

        const today = new Date();
        isEligible = today.getTime() >= nextEligibleDate.getTime();

        if (!isEligible) {
          nextEligibleDateStr = nextEligibleDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        }
      }
    }

    return { totalDonations, livesSaved, isEligible, nextEligibleDateStr };
  }, [myDonationsData, donations]);

  const handleItemPress = (item: DonationLog) => {
    if (item.request) {
      navigation.navigate(ROUTES.REQUEST_DETAIL, { request: item.request });
    }
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
        {t("myDonations.emptyTitle")}
      </AppText>
      <AppText regular FONT_11 style={styles.emptySubtitle}>
        {t("myDonations.emptySubtitle")}
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

            <View
              style={[
                styles.sectionHeader,
                { flexDirection: isRtl ? "row-reverse" : "row" },
              ]}
            >
              <View style={styles.sectionIconWrap}>
                <AnyIcon
                  type={Icons.Feather}
                  name="activity"
                  size={moderateScale(13)}
                  color={colors.primary}
                />
              </View>
              <AppText bold FONT_14 style={[styles.sectionTitle, { marginHorizontal: moderateScale(6) }]}>
                {t("myDonations.donationHistory") || "Donation History"}
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
