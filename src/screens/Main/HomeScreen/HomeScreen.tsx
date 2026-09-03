import React, { useEffect } from "react";
import { View, ScrollView, TouchableOpacity, I18nManager } from "react-native";
import { verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import ScreenWrapper from "@components/ScreenWrapper";
import AppText from "@components/AppText";
import { selectUser, updateUser } from "@store/slices/authSlice";
import { selectIsRtl } from "@store/slices/appSlice";
import { ROUTES } from "@utils/Routes";
import { colors } from "@theme/colors";
import useTranslation from "@shared/hooks/useTranslation";
import { useGetProfile } from "@shared/query/profile/useProfile";
import { useUrgentBloodRequests } from "@shared/query/blood-requests/useBloodRequests";
import { useUnreadNotificationCount } from "@shared/query/notifications/useNotifications";

import HomeHeader from "./components/HomeHeader";
import BloodTypeCard from "./components/BloodTypeCard";
import InspirationalQuoteCard from "./components/InspirationalQuoteCard";
import UrgentRequestCard from "./components/UrgentRequestCard";
import { MOCK_URGENT_REQUESTS, UrgentRequest } from "./types";
import { styles } from "./HomeScreen.styles";

const HomeScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const reduxUser = useSelector(selectUser);
  const { t } = useTranslation();
  const isRtl = useSelector(selectIsRtl);

  const { data: profile } = useGetProfile();
  const { data: urgentRequestsData } = useUrgentBloodRequests();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  useEffect(() => {
    if (profile) {
      const profileData = profile?.user || profile?.profile || profile;
      dispatch(updateUser(profileData));
    }
  }, [profile, dispatch]);

  const rawUser = profile || reduxUser;
  const user = rawUser?.user || rawUser?.profile || rawUser;
  const displayName =
    user?.full_name ||
    user?.name ||
    user?.fullName ||
    (user?.email ? user.email.split("@")[0] : "User");

  const rawUrgent = Array.isArray(urgentRequestsData?.data)
    ? urgentRequestsData.data
    : Array.isArray(urgentRequestsData)
    ? urgentRequestsData
    : [];

  const urgentRequests: UrgentRequest[] =
    rawUrgent.length > 0 ? rawUrgent : MOCK_URGENT_REQUESTS;

  const stats = user?.stats || {};
  const bloodType = user?.blood_group || "O+";
  const donationsCount = stats.donations_count ?? 0;
  const livesSaved = stats.lives_saved ?? (donationsCount * 3);
  
  const formatLastDonated = (dateStr?: string) => {
    if (!dateStr || dateStr === "N/A" || dateStr === "null" || dateStr === "undefined") {
      return "—";
    }
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) {
      return dateStr;
    }
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const lastDonated = formatLastDonated(stats.last_donated_at);

  return (
    <ScreenWrapper
      backgroundColor={colors.background}
      safeArea
      disableBottomSafeArea={true}
      scrollable
      style={styles.wrapper}
      header={
        <HomeHeader
          userName={displayName}
          profileImage={user?.profile_image}
          notificationCount={unreadCount}
          onNotificationPress={() => navigation.navigate(ROUTES.NOTIFICATIONS)}
          onProfilePress={() => navigation.navigate(ROUTES.PROFILE)}
        />
      }
    >
      <BloodTypeCard
        bloodType={bloodType}
        donations={donationsCount}
        livesSaved={livesSaved}
        lastDonated={lastDonated}
      />

      <View style={styles.sectionGap}>
        <InspirationalQuoteCard />
      </View>

      <View
        style={[
          styles.sectionHeader,
          { flexDirection: isRtl ? "row-reverse" : "row" },
        ]}
      >
        <AppText semiBold FONT_16 style={{ color: colors.text }}>
          {t("home.urgentRequests")}
        </AppText>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate(ROUTES.FEED)}
        >
          <AppText semiBold FONT_12 style={{ color: colors.primary }}>
            {t("home.seeAll")}
          </AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.urgentScrollWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.urgentScroll,
            { flexDirection: isRtl ? "row-reverse" : "row" },
          ]}
        >
          {urgentRequests.map((request: UrgentRequest) => (
            <UrgentRequestCard
              key={request.id}
              {...request}
              onPress={() =>
                navigation.navigate(ROUTES.REQUEST_DETAIL, {
                  request: {
                    ...request,
                    patientName: request.patientName || "Anonymous Patient",
                    distance: request.distance || "0 km",
                  },
                })
              }
            />
          ))}
        </ScrollView>
      </View>

      <View style={{ height: verticalScale(30) }} />
    </ScreenWrapper>
  );
};

export default HomeScreen;
