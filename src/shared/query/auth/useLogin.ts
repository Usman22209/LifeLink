import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { AUTH_SERVICE } from "@api/service/auth.service";
import { setAuth } from "@store/slices/authSlice";

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
  };
}

export const useLogin = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: (data: LoginPayload) => AUTH_SERVICE.login(data),

    onSuccess: (response) => {
      const { session, user } = response.data as LoginResponse;
      const { access_token, refresh_token, expires_at } = session;

      // Cache
      queryClient.setQueryData(["user"], user);
      queryClient.setQueryData(["accessToken"], access_token);

      // Redux
      dispatch(
        setAuth({
          accessToken: access_token,
          refreshToken: refresh_token,
          expiresAt: expires_at,
          user: user,
        }),
      );

      Toast.show({
        type: "success",
        text1: "Welcome Back",
        text2: "Login successful",
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
