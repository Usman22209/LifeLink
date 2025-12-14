import axios, { AxiosInstance } from "axios";
import { API_CONFIG } from "../config";
import store from "@store/store";

const HTTP_CLIENT_UPLOAD: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

HTTP_CLIENT_UPLOAD.interceptors.request.use(
  (config) => {
    const token = store.getState().auth.token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

HTTP_CLIENT_UPLOAD.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error),
);

export default HTTP_CLIENT_UPLOAD;
