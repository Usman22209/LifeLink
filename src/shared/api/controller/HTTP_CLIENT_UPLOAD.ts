import axios, { AxiosInstance } from "axios";
import { API_CONFIG } from "../config";
import store from "@store/store";
import { logout } from "@store/slices/authSlice";
import { refreshTokenFlow } from "./tokenRefresh";

const HTTP_CLIENT_UPLOAD: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
  timeout: 30000, // Uploads might take longer
});

HTTP_CLIENT_UPLOAD.interceptors.request.use(
  (config) => {
    const { accessToken } = store.getState().auth;
    console.log(
      `[HTTP_CLIENT_UPLOAD] Request: ${config.method?.toUpperCase()} ${config.url}`,
    );

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log(
        `[HTTP_CLIENT_UPLOAD] Authorization header set from Redux token (ends with ...${accessToken.slice(-10)})`,
      );
    } else {
      console.warn("[HTTP_CLIENT_UPLOAD] No accessToken found in Redux store");
    }
    return config;
  },
  (error) => {
    console.error("[HTTP_CLIENT_UPLOAD] Request error:", error);
    return Promise.reject(error);
  },
);

HTTP_CLIENT_UPLOAD.interceptors.response.use(
  (response) => {
    console.log(
      `[HTTP_CLIENT_UPLOAD] Response: ${response.status} from ${response.config.url}`,
    );
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    console.warn(
      `[HTTP_CLIENT_UPLOAD] Error: ${error.response?.status} from ${originalRequest.url}`,
    );

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const token = await refreshTokenFlow();
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return HTTP_CLIENT_UPLOAD(originalRequest);
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  },
);
export default HTTP_CLIENT_UPLOAD;
