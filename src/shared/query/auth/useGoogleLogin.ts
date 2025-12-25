import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { AUTH_SERVICE } from "../../api/service/auth.service";
import { setAuth } from "../../../store/slices/authSlice";

interface GoogleLoginPayload {
  idToken: string;
}

interface GoogleLoginResponse {
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

export const useGoogleLogin = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ["googleLogin"],
    mutationFn: (data: GoogleLoginPayload) => AUTH_SERVICE.googleLogin(data),

    onSuccess: (response) => {
      const { session, user } = response.data as GoogleLoginResponse;
      const { access_token, session_id } = session;

      // Cache data
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
        text2: "Google login successful",
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