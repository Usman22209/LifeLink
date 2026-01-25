import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { AUTH_SERVICE } from "../../api/service/auth.service";
import { logout as logoutAction } from "../../../store/slices/authSlice";
import { tokenStorage } from "@shared/utils/storage/tokenStorage";
import Toast from "react-native-toast-message";

export const useLogout = () => {
    const dispatch = useDispatch();
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: ["logout"],
        mutationFn: () => AUTH_SERVICE.logout(),
        onSuccess: async () => {
            await tokenStorage.clearToken();
            dispatch(logoutAction());
            queryClient.clear();
            Toast.show({
                type: "success",
                text2: "Logged out successfully",
            });
        },
        onError: (error: any) => {
            console.error("Logout error:", error);
            // Even if the API call fails, we usually want to clear the local state
            tokenStorage.clearToken().then(() => {
                dispatch(logoutAction());
                queryClient.clear();
            });
            Toast.show({
                type: "error",
                text2: "Logged out from session",
            });
        },
    });
};
