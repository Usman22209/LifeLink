import { useMutation } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { AUTH_SERVICE } from "../../api/service/auth.service";

interface SignupPayload {
  email: string;
  password: string;
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
    mutationFn: (data: SignupPayload) => AUTH_SERVICE.signup(data),

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
