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
    session_id: string;
    expires_at: number;
  };
  user: {
    id: string;
    email: string;
    email_confirmed_at?: string;
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
      const { access_token, session_id } = session;

      // Cache
      queryClient.setQueryData(["user"], user);
      queryClient.setQueryData(["token"], access_token);

      // Redux
      dispatch(
        setAuth({
          token: access_token,
          sessionId: session_id,
          user: { id: user.id, name: user.email, email: user.email },
        }),
      );

      Toast.show({
        type: "success",
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
