const API_URL = "http://192.168.18.123:3001/";
const API_CONFIG = {
  BASE_URL: API_URL,
  AUTH: {
    signup: "auth/signup",
    login: "auth/login",
    googleLogin: "auth/google-login",
    forgotPassword: "auth/forgot-password",
    resetPassword: "auth/reset-password",
    logout: "auth/logout",
    refresh: "auth/refresh",
  },
  PROFILE: {
    me: "profile/me",
    delete: "profile/me",
    settings: "profile/settings",
  },
  FILE: {
    upload: "file/upload",
    delete: "file/delete",
  },
  BLOOD_REQUESTS: {
    base: "blood-requests",
    create: "blood-requests",
    feed: "blood-requests/feed",
    urgent: "blood-requests/urgent",
    myRequests: "blood-requests/my",
  },
  DONATIONS: {
    base: "donations",
    accept: "donations/accept",
    my: "donations/my",
  },
  CHAT: {
    base: "chat",
    threads: "chat/threads",
    messages: "chat/messages",
  },
  NOTIFICATIONS: {
    base: "notifications",
    unreadCount: "notifications/unread-count",
    readAll: "notifications/read-all",
    deviceToken: "notifications/device-token",
  },
  SUPPORT: {
    faqs: "support/faqs",
    contact: "support/contact",
  },
};
export { API_CONFIG };
