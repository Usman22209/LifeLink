import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NOTIFICATION_SERVICE } from "../../api/service/notification.service";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: () => [...notificationKeys.all, "list"] as const,
  unreadCount: () => [...notificationKeys.all, "unreadCount"] as const,
};

export const useNotifications = (enabled = true) => {
  return useQuery({
    queryKey: notificationKeys.list(),
    queryFn: async () => {
      const response = await NOTIFICATION_SERVICE.getNotifications();
      return response.data?.data || response.data;
    },
    enabled,
  });
};

export const useUnreadNotificationCount = (enabled = true) => {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async () => {
      const response = await NOTIFICATION_SERVICE.getUnreadCount();
      return response.data?.data?.unreadCount ?? response.data?.unreadCount ?? 0;
    },
    enabled,
    refetchInterval: 30000,
  });
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await NOTIFICATION_SERVICE.markAsRead(id);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useClearAllNotifications = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await NOTIFICATION_SERVICE.readAll();
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
};

export const useRegisterDeviceToken = () => {
  return useMutation({
    mutationFn: async (data: { device_token: string; platform: string }) => {
      const response = await NOTIFICATION_SERVICE.registerDeviceToken(data);
      return response.data;
    },
  });
};
