import axios, { AxiosInstance } from "axios";
import { API_CONFIG } from "../config";
import store from "@store/store";
import { logout, updateUser } from "@store/slices/authSlice";
import { Alert } from "react-native";
import { refreshTokenFlow } from "./tokenRefresh";

const HTTP_CLIENT: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

HTTP_CLIENT.interceptors.request.use(
  (config) => {
    const { accessToken } = store.getState().auth;
    const fullUrl = `${config.baseURL || ""}${config.url || ""}`;

    console.log(
      `🌐 [HTTP_CLIENT Request] ${config.method?.toUpperCase()} ${fullUrl}`,
    );

    if (config.params) {
      console.log(`📋 [HTTP_CLIENT Params]:`, config.params);
    }

    if (config.data) {
      console.log(`📦 [HTTP_CLIENT Body]:`, JSON.stringify(config.data, null, 2));
    }

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log(`🔑 [HTTP_CLIENT Auth]: Token Attached`);
    } else {
      console.warn("⚠️ [HTTP_CLIENT Auth]: No accessToken found in Redux store");
    }

    return config;
  },
  (error) => {
    console.error("❌ [HTTP_CLIENT Request Error]:", error);
    return Promise.reject(error);
  },
);

HTTP_CLIENT.interceptors.response.use(
  (response) => {
    const fullUrl = `${response.config.baseURL || ""}${response.config.url || ""}`;
    console.log(
      `✅ [HTTP_CLIENT Response] ${response.status} ${response.statusText} from ${fullUrl}`,
    );
    console.log(`📥 [HTTP_CLIENT Data]:`, response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const fullUrl = `${originalRequest?.baseURL || ""}${originalRequest?.url || ""}`;

    console.error(
      `❌ [HTTP_CLIENT Error] ${error.response?.status || "NETWORK_ERROR"} from ${fullUrl}`,
    );

    if (error.response?.data) {
      console.error(`🚨 [HTTP_CLIENT Error Response Body]:`, error.response.data);
    }

    // Handle 413 Content Too Large
    if (error?.response?.status === 413) {
      Alert.alert(
        "Error",
        "The uploaded image is too large. Please select a file smaller than 2MB.",
      );
      return Promise.reject(error);
    }

    // Handle 404 on profile/me - implies user needs onboarding
    if (
      error?.response?.status === 404 &&
      originalRequest.url?.includes(API_CONFIG.PROFILE.me)
    ) {
      console.warn("⚠️ [HTTP_CLIENT] Profile not found, user needs onboarding.");
      store.dispatch(updateUser({ is_onboarded: false }));
      return Promise.reject(error);
    }

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log("🔄 [HTTP_CLIENT] Attempting 401 token refresh...");
        const token = await refreshTokenFlow();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return HTTP_CLIENT(originalRequest);
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  },
);

export default HTTP_CLIENT;
