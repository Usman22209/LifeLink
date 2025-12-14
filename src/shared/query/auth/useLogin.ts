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
    user: {
      id: string;
      email: string;
    };
  };
}

export const useLogin = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: (data: LoginPayload) => AUTH_SERVICE.login(data),

    onSuccess: (response) => {
      // ✅ FULL AXIOS RESPONSE
      console.log("LOGIN FULL RESPONSE:", response);

      // ✅ ONLY BACKEND DATA
      console.log("LOGIN RESPONSE DATA:", response.data);

      const { session } = response.data as LoginResponse;
      const { access_token, user } = session;

      // Cache
      queryClient.setQueryData(["user"], user);
      queryClient.setQueryData(["token"], access_token);

      // Redux
      dispatch(setAuth({ token: access_token, user: { id: user.id, name: user.email, email: user.email } }));

      Toast.show({
        type: "success",
        text2: "Login successful",
      });
    },

    onError: (error: any) => {
      console.error("LOGIN ERROR FULL:", error);

      console.error("LOGIN ERROR RESPONSE:", error?.response);
      console.error("LOGIN ERROR DATA:", error?.response?.data);
      console.error("LOGIN ERROR STATUS:", error?.response?.status);

      Toast.show({
        type: "error",
        text2:
          error?.response?.data?.message ||
          "Something went wrong, please try again",
      });
    },
  });
};
