import axios, { AxiosInstance } from "axios";
import { API_CONFIG } from "../config";
import store from "@store/store";
import { logout, updateAccessToken } from "@store/slices/authSlice";
import { supabase } from "@shared/config/supabase";

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
    if (accessToken && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Debug logging
    console.log('--- API Request ---');
    console.log('URL:', config.baseURL ? config.baseURL + config.url : config.url);
    console.log('Method:', config.method?.toUpperCase());
    console.log('Headers:', config.headers);
    console.log('Data:', config.data);
    console.log('-------------------');

    return config;
  },
  (error) => Promise.reject(error),
);

HTTP_CLIENT.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (Token expired)
    if (error?.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data, error: refreshError } = await supabase.auth.refreshSession();

        if (refreshError || !data.session) {
          store.dispatch(logout());
          return Promise.reject(error);
        }

        const { access_token } = data.session;
        store.dispatch(updateAccessToken(access_token));

        // Update authorization header and retry
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return HTTP_CLIENT(originalRequest);
      } catch (refreshErr) {
        store.dispatch(logout());
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  },
);

export default HTTP_CLIENT;
