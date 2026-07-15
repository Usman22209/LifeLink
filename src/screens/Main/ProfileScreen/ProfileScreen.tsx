import React, { useState } from "react";
import { ScrollView, Alert, View } from "react-native";
import { useSelector } from "react-redux";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import Text from "@components/AppText";
import ScreenWrapper from "@components/ScreenWrapper";
import AppButton from "@components/AppButton";
import AppHeader from "@components/AppHeader";
import { selectUser } from "@store/slices/authSlice";
import { colors } from "@theme/colors";
import { useLogout } from "@shared/query/auth/useLogout";
import useTranslation from "@shared/hooks/useTranslation";
import useLanguage from "@shared/hooks/useLanguage";
import { ROUTES } from "@utils/Routes";
import type { UserStackParamList } from "@shared/interfaces/navigation/navigation-params.interface";
import { styles } from "./ProfileScreen.styles";
import ProfileHeaderCard from "./components/ProfileHeaderCard";
import StatsSection from "./components/StatsSection";
import SettingItem from "./components/SettingItem";
import LanguageSelectorModal from "./components/LanguageSelectorModal";

const ProfileScreen = () => {
  const user = useSelector(selectUser);
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const { mutate: logoutMutate, isPending: logoutPending } = useLogout();
  const navigation = useNavigation<NavigationProp<UserStackParamList>>();

  const [modalVisible, setModalVisible] = useState(false);
  const [tempLanguage, setTempLanguage] = useState<"en" | "ur">(language);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      t("profile.logout") || "Logout",
      t("logoutConfirm") || "Are you sure you want to sign out?",
      [
        { text: t("common.cancel") || "Cancel", style: "cancel" },
        {
          text: t("profile.logout") || "Logout",
          style: "destructive",
          onPress: () => logoutMutate(),
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
    <ScreenWrapper backgroundColor={colors.background} safeArea>
      <AppHeader title={t("profile.title") || "Profile"} showBackButton />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeaderCard user={user} />

        <StatsSection />

        <View style={styles.section}>
          <Text bold FONT_10 style={styles.sectionTitle}>
            {t("profile.settings") || "ACCOUNT SETTINGS"}
          </Text>
          <View style={styles.card}>
            <SettingItem
              iconName="user"
              label={t("profile.editProfile") || "Personal Information"}
              onPress={() => {
                navigation.navigate({ name: ROUTES.EDIT_PROFILE, params: { isEditing: true } });
              }}
            />
            <SettingItem
              iconName="droplet"
              label={t("profile.myDonations") || "My Donation History"}
              onPress={() => {
                navigation.navigate(ROUTES.MY_DONATIONS as any);
              }}
            />
            <SettingItem
              iconName="bell"
              label={t("profile.notifications") || "Notification Settings"}
              isLast={true}
              iconColor={colors.primary}
              hasSwitch={true}
              switchValue={notificationsEnabled}
              onSwitchValueChange={setNotificationsEnabled}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text bold FONT_10 style={styles.sectionTitle}>
            {t("preferences") || "PREFERENCES & SUPPORT"}
          </Text>
          <View style={styles.card}>
            <SettingItem
              iconName="globe"
              label={t("profile.language") || "Change Language"}
              onPress={openLanguageModal}
              iconColor={colors.primary}
              valueLabel={language === "en" ? "English" : "اردو"}
            />
            <SettingItem
              iconName="help-circle"
              label="Help & Support"
              onPress={() => {
                Alert.alert("Information", "Frequently Asked Questions coming soon!");
              }}
            />
            <SettingItem
              iconName="shield"
              label="Privacy Policy"
              onPress={() => {
                Alert.alert("Information", "Privacy Policy coming soon!");
              }}
            />
            <SettingItem
              iconName="info"
              label="About LifeLink"
              onPress={() => {
                Alert.alert(
                  "LifeLink",
                  "LifeLink v1.0.0 - Connecting Lives through Blood Donations.",
                );
              }}
              isLast={true}
              iconColor={colors.success}
            />
          </View>
        </View>

        <AppButton
          title={t("profile.logout") || "Sign Out"}
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
    </ScreenWrapper>
  );
};

export default ProfileScreen;
