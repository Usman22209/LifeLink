import HTTP_CLIENT from "../controller/HTTP_CLIENT";
import { API_CONFIG } from "../config";

export const NOTIFICATION_SERVICE = {
  getNotifications: () => {
    return HTTP_CLIENT.get(API_CONFIG.NOTIFICATIONS.base);
  },
  getUnreadCount: () => {
    return HTTP_CLIENT.get(API_CONFIG.NOTIFICATIONS.unreadCount);
  },
  markAsRead: (id: string) => {
    return HTTP_CLIENT.patch(`${API_CONFIG.NOTIFICATIONS.base}/${id}/read`);
  },
  readAll: () => {
    return HTTP_CLIENT.post(API_CONFIG.NOTIFICATIONS.readAll);
  },
};
