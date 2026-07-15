import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { AUTH_SERVICE } from "@api/service/auth.service";
import { setAuth } from "@store/slices/authSlice";
import { tokenStorage } from "@shared/utils/storage/tokenStorage";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
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

export const useLogin = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: (data: LoginPayload) => AUTH_SERVICE.login(data),

    onSuccess: async (response) => {
      const { session, user } = response.data as LoginResponse;
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
        text1: "Welcome Back",
        text2: response.data.message || "Login successful",
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
