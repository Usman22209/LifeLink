import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { AUTH_SERVICE } from "../../api/service/auth.service";
import { logout as logoutAction } from "../../../store/slices/authSlice";
import { tokenStorage } from "@shared/utils/storage/tokenStorage";
import Toast from "react-native-toast-message";
// import { supabase } from "@shared/config/supabase";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export const useLogout = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const fullCleanup = async () => {
    try {
      await Promise.allSettled([
        tokenStorage.clearToken(),
        GoogleSignin.signOut(),
      ]);
      dispatch(logoutAction());
      queryClient.clear();
    } catch (error) {
      console.error("Cleanup error during logout:", error);
    }
  };

  return useMutation({
    mutationKey: ["logout"],
    mutationFn: () => AUTH_SERVICE.logout(),
    onSuccess: async () => {
      await fullCleanup();
      Toast.show({
        type: "success",
        text2: "Logged out successfully",
      });
    },
    onError: async (error: any) => {
      console.error("Logout error:", error);
      // Even if the API call fails, we always want to clear the local state
      await fullCleanup();
      Toast.show({
        type: "error",
        text2: "Logged out from session",
      });
    },
  });
};
