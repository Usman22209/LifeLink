import axios, { AxiosInstance } from "axios";
import { API_CONFIG } from "../config";
import store from "@store/store";
import { logout } from "@store/slices/authSlice";

const HTTP_CLIENT_UPLOAD: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

HTTP_CLIENT_UPLOAD.interceptors.request.use(
  (config) => {
    const { accessToken } = store.getState().auth;
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error),
);

HTTP_CLIENT_UPLOAD.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error?.response?.status === 401) {
      store.dispatch(logout());
    }
    return Promise.reject(error);
  },
);

export default HTTP_CLIENT_UPLOAD;
