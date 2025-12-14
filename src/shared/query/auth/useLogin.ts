import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { AUTH_SERVICE } from "@api/service/auth.service";
import { setAuth } from "@store/slices/authSlice";
import { logger } from "@utils/logger";
interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const useLogin = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: (data: LoginPayload) => AUTH_SERVICE.login(data),

    onSuccess: (response) => {
      const { token, user } = response.data as LoginResponse;

      // Cache data
      queryClient.setQueryData(["user"], user);
      queryClient.setQueryData(["token"], token);

      // Redux
      dispatch(setAuth({ token, user }));

      Toast.show({
        type: "success",
        text2: "Login successful",
      });
    },

    onError: (error: any) => {
      logger.error(`Login error: ${JSON.stringify(error)}`);
      Toast.show({
        type: "error",
        text2:
          error?.response?.data?.message ||
          "Something went wrong, please try again",
      });
    },
  });
};
