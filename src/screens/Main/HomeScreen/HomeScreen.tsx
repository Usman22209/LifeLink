import React from "react";
import { View, ScrollView, TouchableOpacity, I18nManager } from "react-native";
import { verticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import ScreenWrapper from "@components/ScreenWrapper";
import AppText from "@components/AppText";
import { selectUser } from "@store/slices/authSlice";
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
  const navigation = useNavigation<any>();
  const reduxUser = useSelector(selectUser);
  const { t } = useTranslation();
  const isRtl = useSelector(selectIsRtl);

  const { data: profile } = useGetProfile();
  const { data: urgentRequestsData } = useUrgentBloodRequests();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();

  const user = profile || reduxUser;
  const urgentRequests: UrgentRequest[] =
    urgentRequestsData && Array.isArray(urgentRequestsData) && urgentRequestsData.length > 0
      ? urgentRequestsData
      : MOCK_URGENT_REQUESTS;

  const stats = user?.stats || {};
  const bloodType = user?.blood_group || "O+";
  const donationsCount = stats.donations_count ?? 0;
  const livesSaved = stats.lives_saved ?? (donationsCount * 3);
  const lastDonated = stats.last_donated_at || "N/A";

  return (
    <ScreenWrapper
      backgroundColor={colors.background}
      safeArea
      disableBottomSafeArea={true}
      scrollable
      style={styles.wrapper}
      header={
        <HomeHeader
          userName={user?.full_name || user?.email || "User"}
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
          contentOffset={isRtl ? { x: 9999, y: 0 } : { x: 0, y: 0 }}
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
