import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@store/store";
import { setLanguage } from "@store/slices/appSlice";
import i18n from "../i18n";
import { I18nManager } from "react-native";
import RNRestart from "react-native-restart";

const useLanguage = () => {
  const dispatch = useDispatch();
  const { language } = useSelector((state: RootState) => state.app);

  // Use the actual I18nManager.isRTL instead of Redux state for layout logic if needed
  const isRtl = I18nManager.isRTL;

  const changeLanguage = async (lng: "en" | "ur") => {
    const newIsRtl = lng === "ur";
    const currentRtl = I18nManager.isRTL;

    await i18n.changeLanguage(lng);
    dispatch(setLanguage(lng));

    // If RTL direction needs to change, restart app immediately
    if (currentRtl !== newIsRtl) {
      I18nManager.allowRTL(newIsRtl);
      I18nManager.forceRTL(newIsRtl);

      // Restart app to apply RTL changes
      setTimeout(() => {
        RNRestart.restart();
      }, 100);
    }
  };

  return { language, isRtl, changeLanguage };
};

export default useLanguage;
