import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { AUTH_SERVICE } from "../../api/service/auth.service";

import { Platform } from "react-native";

interface SignupPayload {
  email: string;
  password: string;
  device_token?: string;
  device_platform?: string;
}

interface SignupResponse {
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
  };
}

export const useSignup = () => {
  return useMutation({
    mutationKey: ["signup"],
    mutationFn: (data: SignupPayload) => {
      const payload = {
        ...data,
        device_platform: data.device_platform || Platform.OS,
      };
      console.log("🔑 [useSignup] Executing signup mutation with payload:", {
        email: payload.email,
        device_token: payload.device_token || "Not Provided",
        device_platform: payload.device_platform,
      });
      return AUTH_SERVICE.signup(payload);
    },

    onSuccess: (response) => {
      const { message } = response.data as SignupResponse;

      Toast.show({
        type: "success",
        text2: message || "Signup successful",
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
