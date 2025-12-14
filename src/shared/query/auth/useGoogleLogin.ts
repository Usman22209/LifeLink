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
    user: {
      id: string;
      email: string;
    };
  };
}

export const useGoogleLogin = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ["googleLogin"],
    mutationFn: (data: GoogleLoginPayload) => AUTH_SERVICE.googleLogin(data),

    onSuccess: (response) => {
      const { session } = response.data as GoogleLoginResponse;
      const { access_token, user } = session;

      // Cache data
      queryClient.setQueryData(["user"], user);
      queryClient.setQueryData(["token"], access_token);

      // Redux
      dispatch(setAuth({ token: access_token, user: { id: user.id, name: user.email, email: user.email } }));

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