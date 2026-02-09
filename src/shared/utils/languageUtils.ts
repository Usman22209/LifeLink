import { I18nManager, Alert } from "react-native";
import RNRestart from "react-native-restart";
import i18n from "@shared/i18n";
import { RTL_LANGUAGES } from "@shared/i18n";

/**
 * Changes the app language and handles RTL switching
 * @param newLanguage - The language code to switch to (e.g., 'en', 'ur')
 * @param t - Translation function from useTranslation hook
 */
export const changeAppLanguage = async (
    newLanguage: string,
    t: (key: string) => string
) => {
    const currentIsRTL = I18nManager.isRTL;
    const newIsRTL = RTL_LANGUAGES.includes(newLanguage);

    // Change the language
    await i18n.changeLanguage(newLanguage);

    // If RTL direction needs to change, restart the app
    if (currentIsRTL !== newIsRTL) {
        I18nManager.forceRTL(newIsRTL);
        I18nManager.allowRTL(newIsRTL);

        Alert.alert(
            t("restartRequired") || "Restart Required",
            t("restartMessage") ||
            "The app needs to restart to apply the language change.",
            [
                {
                    text: t("restartNow") || "Restart Now",
                    onPress: () => RNRestart.restart(),
                },
            ],
            { cancelable: false }
        );
    }
};
