
const API_URL = "http://192.168.0.102:3001/";
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
  },
  FILE: {
    upload: "file/upload",
    delete: "file/delete",
  },
  BLOOD_REQUESTS: {
    base: "blood-requests",
    create: "blood-requests",
    feed: "blood-requests/feed",
    myRequests: "blood-requests/my",
  },
  DONATIONS: {
    base: "donations",
    accept: "donations/accept",
  },
};
export { API_CONFIG };
