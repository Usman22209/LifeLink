import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PROFILE_SERVICE } from "../../api/service/profile.service";
import store from "@store/store";
import { logout } from "@store/slices/authSlice";
import { tokenStorage } from "@shared/utils/storage/tokenStorage";
import Toast from "react-native-toast-message";

import { updateUser } from "@store/slices/authSlice";

export const profileKeys = {
  all: ["profile"] as const,
  me: () => [...profileKeys.all, "me"] as const,
};

export const useGetProfile = (enabled = true) => {
  return useQuery({
    queryKey: profileKeys.me(),
    queryFn: async () => {
      const response = await PROFILE_SERVICE.getProfile();
      return response.data?.data || response.data;
    },
    enabled,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await PROFILE_SERVICE.updateProfile(data);
      return response.data?.data || response.data;
    },
    onSuccess: (updatedProfile) => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() });
      if (updatedProfile) {
        store.dispatch(updateUser(updatedProfile));
      }
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await PROFILE_SERVICE.deleteAccount();
      return response.data;
    },
    onSuccess: async () => {
      queryClient.clear();
      store.dispatch(logout());
      await tokenStorage.clearToken();
      Toast.show({
        type: "success",
        text1: "Account Deleted",
        text2: "Your account has been deleted.",
      });
    },
    onError: (error: any) => {
      Toast.show({
        type: "error",
        text2: error?.response?.data?.message || "Failed to delete account.",
      });
    },
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      notifications_enabled?: boolean;
      language_preference?: string;
    }) => {
      const response = await PROFILE_SERVICE.updateSettings(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() });
    },
  });
};
