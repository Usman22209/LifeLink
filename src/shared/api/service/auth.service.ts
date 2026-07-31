import HTTP_CLIENT from "../controller/HTTP_CLIENT";
import { API_CONFIG } from "../config";
import axios from "axios";
export const AUTH_SERVICE = {
  login: (data: { email: string; password: string; device_token?: string; device_platform?: string }) => {
    const url = API_CONFIG.AUTH.login;
    console.log("📱 [AUTH_SERVICE] Sending Login with device_token:", data.device_token || "None");
    return HTTP_CLIENT.post(url, data);
  },
  signup: (data: { password: string; email: string; device_token?: string; device_platform?: string }) => {
    const url = API_CONFIG.AUTH.signup;
    console.log("📱 [AUTH_SERVICE] Sending Signup with device_token:", data.device_token || "None");
    return HTTP_CLIENT.post(url, data);
  },
  forgotPassword: (data: { email: string }) => {
    const url = API_CONFIG.AUTH.forgotPassword;
    return HTTP_CLIENT.post(url, data);
  },
  googleLogin: (data: { idToken: string; device_token?: string; device_platform?: string }) => {
    const url = API_CONFIG.AUTH.googleLogin;
    console.log("📱 [AUTH_SERVICE] Sending GoogleLogin with device_token:", data.device_token || "None");
    return HTTP_CLIENT.post(url, data);
  },
  resetPassword: (data: { password: string }, token: string) => {
    const url = API_CONFIG.AUTH.resetPassword;
    return HTTP_CLIENT.patch(url, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  logout: () => {
    const url = API_CONFIG.AUTH.logout;
    return HTTP_CLIENT.post(url);
  },
  refresh: (refreshToken: string) => {
    const url = API_CONFIG.AUTH.refresh;
    return axios.post(`${API_CONFIG.BASE_URL}${url}`, {
      refresh_token: refreshToken,
    });
  },
};
