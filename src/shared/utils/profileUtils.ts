import Toast from "react-native-toast-message";
import { ROUTES } from "./Routes";

export const isProfileComplete = (user: any): boolean => {
  if (!user) return false;

  if (user.is_onboarded === true || String(user.is_onboarded) === "true") {
    return true;
  }

  const hasPhone = Boolean(user.phone?.trim() || user.contact_number?.trim());
  const hasBlood = Boolean(user.blood_group?.trim() || user.blood_type?.trim());
  if (hasPhone && hasBlood) {
    return true;
  }

  const hasName = Boolean(user.full_name?.trim() || user.name?.trim());
  return hasName && hasPhone && hasBlood;
};

export const requireCompleteProfile = (
  user: any,
  navigation: any,
  t?: (key: string) => string,
): boolean => {
  if (!isProfileComplete(user)) {
    Toast.show({
      type: "info",
      text1: t
        ? t("profile.completeProfileTitle") || "Complete Your Profile"
        : "Complete Your Profile",
      text2: t
        ? t("profile.completeProfilePrompt") ||
          "Please complete your profile details first."
        : "Please complete your profile details first.",
    });
    navigation.navigate(ROUTES.EDIT_PROFILE as any, { isEditing: true });
    return false;
  }
  return true;
};
