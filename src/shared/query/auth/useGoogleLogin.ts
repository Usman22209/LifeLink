import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { AUTH_SERVICE } from "../../api/service/auth.service";
import { setAuth } from "../../../store/slices/authSlice";
import { tokenStorage } from "@shared/utils/storage/tokenStorage";

import { Platform } from "react-native";

interface GoogleLoginPayload {
  idToken: string;
  device_token?: string;
  device_platform?: string;
}

interface GoogleLoginResponse {
  success: boolean;
  message: string;
  session: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
  user: {
    id: string;
    email: string;
    full_name: string;
    is_onboarded: boolean;
  };
}

export const useGoogleLogin = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ["googleLogin"],
    mutationFn: (data: GoogleLoginPayload) => {
      const payload = {
        ...data,
        device_platform: data.device_platform || Platform.OS,
      };
      console.log("🔑 [useGoogleLogin] Executing Google Login mutation with payload:", {
        device_token: payload.device_token || "Not Provided",
        device_platform: payload.device_platform,
      });
      return AUTH_SERVICE.googleLogin(payload);
    },

    onSuccess: async (response) => {
      const { session, user } = response.data as GoogleLoginResponse;
      const { access_token, refresh_token, expires_at } = session;
      console.log(refresh_token, "refresh_token");
      await tokenStorage.setRefreshToken(refresh_token);

      queryClient.setQueryData(["user"], user);
      queryClient.setQueryData(["accessToken"], access_token);

      dispatch(
        setAuth({
          accessToken: access_token,
          expiresAt: expires_at,
          user: user,
        }),
      );

      Toast.show({
        type: "success",
        text1: "Welcome",
        text2: response.data.message || "Google login successful",
      });
    },

    onError: (error: any) => {
      Toast.show({
        type: "error",
        text2:
          error?.response?.data?.message ||
          "Something went wrong, please try again",
      });
    },
  });
};
