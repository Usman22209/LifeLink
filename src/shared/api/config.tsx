
const API_URL = "http://192.168.0.101:3001";
const API_CONFIG = {
  BASE_URL: API_URL,
  AUTH: {
    signup: "auth/signup",
    login: "auth/login",
    googleLogin: "auth/google-login",
    forgotPassword: "auth/forgot-password",
    logout: "auth/logout",
  },
};
export { API_CONFIG };
