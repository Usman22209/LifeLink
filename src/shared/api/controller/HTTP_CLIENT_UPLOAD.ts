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
    const fullUrl = `${config.baseURL || ""}${config.url || ""}`;

    console.log(
      `📤 [HTTP_CLIENT_UPLOAD Request] ${config.method?.toUpperCase()} ${fullUrl}`,
    );

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log(
        `🔑 [HTTP_CLIENT_UPLOAD Auth] Attached Token (ends with ...${accessToken.slice(-10)})`,
      );
    } else {
      console.warn("⚠️ [HTTP_CLIENT_UPLOAD Auth] No accessToken found in Redux store");
    }
    return config;
  },
  (error) => {
    console.error("❌ [HTTP_CLIENT_UPLOAD Request Error]:", error);
    return Promise.reject(error);
  },
);

HTTP_CLIENT_UPLOAD.interceptors.response.use(
  (response) => {
    const fullUrl = `${response.config.baseURL || ""}${response.config.url || ""}`;
    console.log(
      `✅ [HTTP_CLIENT_UPLOAD Response] ${response.status} ${response.statusText} from ${fullUrl}`,
    );
    console.log(`📥 [HTTP_CLIENT_UPLOAD Data]:`, response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const fullUrl = `${originalRequest?.baseURL || ""}${originalRequest?.url || ""}`;

    console.error(
      `❌ [HTTP_CLIENT_UPLOAD Error] ${error.response?.status || "UPLOAD_ERROR"} from ${fullUrl}`,
    );

    if (error.response?.data) {
      console.error(
        `🚨 [HTTP_CLIENT_UPLOAD Error Response Body]:`,
        error.response.data,
      );
    }

    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        console.log("🔄 [HTTP_CLIENT_UPLOAD] Attempting 401 token refresh...");
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
