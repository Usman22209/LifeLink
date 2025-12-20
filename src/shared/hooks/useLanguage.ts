import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@store/store";
import { setLanguage } from "@store/slices/appSlice";
import i18n from "../i18n";

const useLanguage = () => {
  const dispatch = useDispatch();
  const { language, isRtl } = useSelector((state: RootState) => state.app);

  const changeLanguage = (lng: "en" | "ur") => {
    i18n.changeLanguage(lng);
    dispatch(setLanguage(lng));
  };

  return { language, isRtl, changeLanguage };
};

export default useLanguage;
