import React, { useState, useEffect } from "react";
import { ScrollView, Alert, View } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import Text from "@components/AppText";
import ScreenWrapper from "@components/ScreenWrapper";
import AppButton from "@components/AppButton";
import AppHeader from "@components/AppHeader";
import { selectUser, updateUser } from "@store/slices/authSlice";
import { selectIsRtl } from "@store/slices/appSlice";
import { colors } from "@theme/colors";
import { useLogout } from "@shared/query/auth/useLogout";
import useTranslation from "@shared/hooks/useTranslation";
import useLanguage from "@shared/hooks/useLanguage";
import { useDeleteAccount, useUpdateSettings, useGetProfile } from "@shared/query/profile/useProfile";
import { ROUTES } from "@utils/Routes";
import type { UserStackParamList } from "@shared/interfaces/navigation/navigation-params.interface";
import { styles } from "./ProfileScreen.styles";
import ProfileHeaderCard from "./components/ProfileHeaderCard";
import StatsSection from "./components/StatsSection";
import SettingItem from "./components/SettingItem";
import LanguageSelectorModal from "./components/LanguageSelectorModal";
import LogoutConfirmationModal from "@shared/components/LogoutConfirmationModal";
import { OneSignal } from "react-native-onesignal";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const reduxUser = useSelector(selectUser);
  const { data: profile } = useGetProfile();
  const rawUser = profile || reduxUser;
  const user = rawUser?.user || rawUser?.profile || rawUser;

  useEffect(() => {
    if (profile) {
      const profileData = profile?.user || profile?.profile || profile;
      dispatch(updateUser(profileData));
    }
  }, [profile, dispatch]);
  const isRtl = useSelector(selectIsRtl);
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const { mutate: logoutMutate, isPending: logoutPending } = useLogout();
  const { mutate: deleteAccountMutate } = useDeleteAccount();
  const { mutate: updateSettingsMutate } = useUpdateSettings();
  const navigation = useNavigation<NavigationProp<UserStackParamList>>();

  const [modalVisible, setModalVisible] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [tempLanguage, setTempLanguage] = useState<"en" | "ur">(language);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    user?.notifications_enabled ?? true,
  );
  const [hidePhoneNumber, setHidePhoneNumber] = useState(
    user?.hide_phone_number ?? false,
  );

  useEffect(() => {
    if (user?.notifications_enabled !== undefined) {
      setNotificationsEnabled(Boolean(user.notifications_enabled));
    }
  }, [user?.notifications_enabled]);

  useEffect(() => {
    if (user?.hide_phone_number !== undefined) {
      setHidePhoneNumber(Boolean(user.hide_phone_number));
    }
  }, [user?.hide_phone_number]);

  const handleNotificationToggle = (val: boolean) => {
    setNotificationsEnabled(val);
    updateSettingsMutate({ notifications_enabled: val });
    try {
      if (val) {
        OneSignal.User.pushSubscription.optIn();
      } else {
        OneSignal.User.pushSubscription.optOut();
      }
    } catch (e: any) {
      console.log("OneSignal push subscription toggle error:", e?.message);
    }
  };

  const handleHidePhoneToggle = (val: boolean) => {
    setHidePhoneNumber(val);
    updateSettingsMutate({ hide_phone_number: val });
  };

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t("profile.deleteAccount") || "Delete Account",
      t("profile.deleteAccountConfirm") ||
        "Are you sure you want to permanently delete your account? This action is irreversible.",
      [
        { text: t("common.cancel") || "Cancel", style: "cancel" },
        {
          text: t("profile.deleteAccountConfirmButton") || "Delete",
          style: "destructive",
          onPress: () => {
            deleteAccountMutate();
          },
        },
      ],
    );
  };

  const openLanguageModal = () => {
    setTempLanguage(language);
    setModalVisible(true);
  };

  const confirmLanguageSelection = () => {
    changeLanguage(tempLanguage);
    setModalVisible(false);
  };

  return (
    <ScreenWrapper
      backgroundColor={colors.background}
      safeArea
      disableBottomSafeArea={true}
    >
      <AppHeader title={t("profile.title") || "Profile"} showBackButton />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeaderCard user={user} />

        <StatsSection stats={user?.stats} />

        <View style={styles.section}>
          <Text
            bold
            FONT_10
            style={[
              styles.sectionTitle,
              { textAlign: isRtl ? "right" : "left" },
            ]}
          >
            {t("profile.accountSettings")}
          </Text>
          <View style={styles.card}>
            <SettingItem
              iconName="user"
              label={t("profile.editProfile")}
              onPress={() => {
                navigation.navigate({
                  name: ROUTES.EDIT_PROFILE,
                  params: { isEditing: true },
                });
              }}
            />
            <SettingItem
              iconName="droplet"
              label={t("profile.myDonations")}
              onPress={() => {
                navigation.navigate(ROUTES.MY_DONATIONS as any);
              }}
            />
            <SettingItem
              iconName="file-text"
              label="My Blood Requests"
              onPress={() => {
                navigation.navigate(ROUTES.MY_REQUESTS as any);
              }}
              iconColor={colors.warning}
            />
            <SettingItem
              iconName="bell"
              label={t("profile.notifications")}
              iconColor={colors.primary}
              hasSwitch={true}
              switchValue={notificationsEnabled}
              onSwitchValueChange={handleNotificationToggle}
            />
            <SettingItem
              iconName="phone-off"
              label={t("profile.hidePhoneNumber") || "Hide Phone Number"}
              isLast={true}
              iconColor={colors.primary}
              hasSwitch={true}
              switchValue={hidePhoneNumber}
              onSwitchValueChange={handleHidePhoneToggle}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text
            bold
            FONT_10
            style={[
              styles.sectionTitle,
              { textAlign: isRtl ? "right" : "left" },
            ]}
          >
            {t("profile.preferences")}
          </Text>
          <View style={styles.card}>
            <SettingItem
              iconName="globe"
              label={t("profile.language")}
              onPress={openLanguageModal}
              iconColor={colors.primary}
              valueLabel={language === "en" ? "English" : "اردو"}
            />
            <SettingItem
              iconName="help-circle"
              label={t("helpSupport.title")}
              onPress={() => {
                navigation.navigate(ROUTES.HELP_SUPPORT as any);
              }}
            />
            <SettingItem
              iconName="shield"
              label={t("privacyPolicy.title")}
              onPress={() => {
                navigation.navigate(ROUTES.PRIVACY_POLICY as any);
              }}
            />
            <SettingItem
              iconName="info"
              label={t("profile.aboutApp")}
              onPress={() => {
                Alert.alert(t("profile.aboutApp"), t("profile.aboutAppDesc"));
              }}
              iconColor={colors.success}
            />
            <SettingItem
              iconName="trash-2"
              label={t("profile.deleteAccount")}
              onPress={handleDeleteAccount}
              iconColor={colors.error}
              textColor={colors.error}
              isLast={true}
            />
          </View>
        </View>

        <AppButton
          title={t("profile.logout")}
          onPress={handleLogout}
          loading={logoutPending}
          style={styles.logoutBtn}
          textStyle={styles.logoutTitle}
        />

        <Text regular FONT_10 style={styles.versionText}>
          Version 1.0.0 (Build 12)
        </Text>
      </ScrollView>

      <LanguageSelectorModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        tempLanguage={tempLanguage}
        setTempLanguage={setTempLanguage}
        onConfirm={confirmLanguageSelection}
        t={t}
      />

      <LogoutConfirmationModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onConfirm={() => {
          logoutMutate();
        }}
        isLoading={logoutPending}
      />
    </ScreenWrapper>
  );
};

export default ProfileScreen;
