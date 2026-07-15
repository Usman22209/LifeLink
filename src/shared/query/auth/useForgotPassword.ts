import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { Linking } from "react-native";
import { AUTH_SERVICE } from "../../api/service/auth.service";

interface ForgotPasswordPayload {
  email: string;
}

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
}

export const useForgotPassword = () => {
  return useMutation({
    mutationKey: ["forgotPassword"],
    mutationFn: (data: ForgotPasswordPayload) =>
      AUTH_SERVICE.forgotPassword(data),

    onSuccess: (response) => {
      const { message } = response.data as ForgotPasswordResponse;

      Toast.show({
        type: "success",
        text2: message,
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
