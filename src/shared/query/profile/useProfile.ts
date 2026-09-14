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
      console.log("🔍 [useGetProfile] Fetching profile from API...");
      const response = await PROFILE_SERVICE.getProfile();
      console.log("🔍 [useGetProfile] Raw API Response:", JSON.stringify(response.data));
      const rawData = response.data?.data || response.data;
      const profileData = rawData?.user || rawData?.profile || rawData;
      console.log("🔍 [useGetProfile] Resolved profileData:", JSON.stringify(profileData));
      return profileData;
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
    mutationKey: ["deleteAccount"],
    mutationFn: async () => {
      const response = await PROFILE_SERVICE.deleteAccount();
      return response.data;
    },
    onSuccess: async () => {
      try {
        await Promise.allSettled([
          tokenStorage.clearToken(),
        ]);
      } catch (e) {
        console.error("Token clear error:", e);
      }
      store.dispatch(logout());
      queryClient.clear();
      Toast.show({
        type: "success",
        text1: "Account Deleted",
        text2: "Your account has been permanently deleted.",
      });
    },
    onError: (error: any) => {
      console.error("Delete account failed:", error);
      Toast.show({
        type: "error",
        text1: "Deletion Failed",
        text2: error?.response?.data?.message || "Could not delete account. Please try again.",
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
      hide_phone_number?: boolean;
    }) => {
      const response = await PROFILE_SERVICE.updateSettings(data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me() });
    },
  });
};
