import store from "@store/store";
import { updateAccessToken, logout } from "@store/slices/authSlice";
import { tokenStorage } from "@shared/utils/storage/tokenStorage";
import { AUTH_SERVICE } from "@api/service/auth.service";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const refreshTokenFlow = async (): Promise<string> => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    });
  }

  isRefreshing = true;

  try {
    console.log("[TokenRefresh] Attempting to refresh token via backend...");
    const storedRefreshToken = await tokenStorage.getRefreshToken();

    if (!storedRefreshToken) {
      throw new Error("No refresh token stored");
    }

    const response = await AUTH_SERVICE.refresh(storedRefreshToken);
    const { session } = response.data;

    if (!session || !session.access_token) {
      throw new Error("Invalid session returned from refresh");
    }

    const { access_token, refresh_token: new_refresh_token } = session;
    console.log(`[TokenRefresh] Refresh successful.`);

    store.dispatch(updateAccessToken(access_token));

    if (new_refresh_token) {
      await tokenStorage.setRefreshToken(new_refresh_token);
    }

    processQueue(null, access_token);
    return access_token;
  } catch (error: any) {
    console.error(
      "[TokenRefresh] Token refresh failed:",
      error?.response?.data || error.message,
    );
    processQueue(error, null);
    store.dispatch(logout());
    await tokenStorage.clearToken();
    throw error;
  } finally {
    isRefreshing = false;
  }
};
