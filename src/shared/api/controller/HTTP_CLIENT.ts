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
    console.log(`[HTTP_CLIENT] Request: ${config.method?.toUpperCase()} ${config.url}`);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    } else {
      console.warn("[HTTP_CLIENT] No accessToken found in Redux store");
    }

    return config;
  },
  (error) => Promise.reject(error),
);


HTTP_CLIENT.interceptors.response.use(
  (response) => {
    console.log(`[HTTP_CLIENT] Response: ${response.status} from ${response.config.url}`);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.warn(`[HTTP_CLIENT] Error: ${error.response?.status} from ${originalRequest.url}`);

    // Handle 413 Content Too Large
    if (error?.response?.status === 413) {
      Alert.alert("Error", "The uploaded image is too large. Please select a file smaller than 2MB.");
      return Promise.reject(error);
    }

    // Handle 404 on profile/me - implies user needs onboarding
    if (error?.response?.status === 404 && originalRequest.url?.includes(API_CONFIG.PROFILE.me)) {
      console.warn("[HTTP_CLIENT] Profile not found, user needs onboarding.");
      store.dispatch(updateUser({ is_onboarded: false }));
      return Promise.reject(error);
    }

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
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
