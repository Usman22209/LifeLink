
const API_URL = "http://192.168.0.101:3001";
const API_CONFIG = {
  BASE_URL: API_URL,
  AUTH: {
    signup: "auth/signup",
    login: "auth/login",
    googleLogin: "auth/google-login",
    forgotPassword: "auth/forgot-password",
    resetPassword: "auth/reset-password",
    logout: "auth/logout",
  },
  FILE: {
    upload: "file/upload",
    delete: "file/delete",
  },
};
export { API_CONFIG };
