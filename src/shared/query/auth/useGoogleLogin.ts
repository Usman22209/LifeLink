import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { AUTH_SERVICE } from "../../api/service/auth.service";
import { setAuth } from "../../../store/slices/authSlice";
import { tokenStorage } from "@shared/utils/storage/tokenStorage";
import { Platform } from "react-native";
import { captureLoginFailure } from "@shared/utils/sentryLogger";

interface GoogleLoginPayload {
  idToken: string;
  nonce?: string;
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
      return AUTH_SERVICE.googleLogin({
        idToken: data.idToken,
        device_platform: Platform.OS,
      });
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
      captureLoginFailure(error, {
        loginMethod: "google",
      });

      Toast.show({
        type: "error",
        text2:
          error?.response?.data?.message ||
          "Something went wrong, please try again",
      });
    },
  });
};
